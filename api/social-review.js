import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SHEET_TAB = 'Submissions'
const STATUS_OPTIONS = ['New', 'Reviewing', 'Contacted', 'Featured', 'Passed']
const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max)

const appendToSheet = async (submission) => {
  const spreadsheetId = (process.env.GOOGLE_SOCIAL_REVIEW_SHEET_ID || '').trim()
  if (!spreadsheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error('Missing Google Sheets environment variables for social review')
    return
  }
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const meta = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetId = meta.data.sheets.find((s) => s.properties.title === SHEET_TAB)?.properties?.sheetId ?? 0

    // Newest submissions go on top, directly under the header row.
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: { sheetId, dimension: 'ROWS', startIndex: 1, endIndex: 2 },
              inheritFromBefore: false,
            },
          },
          {
            setDataValidation: {
              range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 7, endColumnIndex: 8 },
              rule: {
                condition: { type: 'ONE_OF_LIST', values: STATUS_OPTIONS.map((v) => ({ userEnteredValue: v })) },
                showCustomUi: true,
                strict: true,
              },
            },
          },
        ],
      },
    })
    const submitted = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Vancouver',
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${SHEET_TAB}'!A2:H2`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          submitted,
          submission.name,
          submission.email,
          submission.mainAccount,
          submission.extraAccounts.join('\n'),
          submission.focus,
          'Yes',
          'New',
        ]],
      },
    })
  } catch (err) {
    console.error('Google Sheets error:', err)
  }
}

const notifyFallback = async (submission, reason) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: 'samfox999@gmail.com',
      subject: 'Social Review Submission — Manual Add Needed',
      text: `A social review submission failed to reach Brevo (${reason}). Details:\n\n${JSON.stringify(submission, null, 2)}`,
    })
  } catch (err) {
    console.error('Failed to send fallback notification:', err)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}
  const email = clean(body.email, 254).toLowerCase()
  const mainAccount = clean(body.mainAccount)
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  if (!mainAccount) {
    return res.status(400).json({ error: 'Please add a link to your main social media account.' })
  }
  if (body.ownsAccount !== true) {
    return res.status(400).json({ error: 'Please confirm you own these accounts or have permission to submit them.' })
  }

  const name = clean(body.name, 100)
  const [firstName, ...rest] = name.split(/\s+/)
  const extraAccounts = Array.isArray(body.extraAccounts)
    ? body.extraAccounts.slice(0, 4).map((a) => clean(a)).filter(Boolean)
    : []
  const submission = {
    email,
    name,
    mainAccount,
    extraAccounts,
    focus: clean(body.focus, 100),
  }

  await Promise.all([
    appendToSheet(submission),
    subscribeToBrevo(submission, firstName, rest.join(' ')),
  ])
  return res.status(200).json({ success: true })
}

async function subscribeToBrevo(submission, firstName, lastName) {
  const API_KEY = (process.env.BREVO_API_KEY || '').trim()
  const LIST_ID = parseInt((process.env.BREVO_SOCIAL_REVIEW_LIST_ID || '').trim(), 10)
  const TEMPLATE_ID = parseInt((process.env.BREVO_SOCIAL_REVIEW_TEMPLATE_ID || '').trim(), 10)

  if (!API_KEY || !LIST_ID || !TEMPLATE_ID) {
    console.error('Missing Brevo social review environment variables')
    await notifyFallback(submission, 'missing environment variables')
    return
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
      body: JSON.stringify({
        email: submission.email,
        includeListIds: [LIST_ID],
        templateId: TEMPLATE_ID,
        redirectionUrl: (process.env.SOCIAL_REVIEW_CONFIRM_URL || 'https://www.jillaine.ca/social-review?confirmed=1').trim(),
        attributes: {
          FIRSTNAME: firstName || '',
          LASTNAME: lastName,
          MAIN_ACCOUNT: submission.mainAccount,
          OTHER_ACCOUNTS: submission.extraAccounts.join(', '),
          REVIEW_FOCUS: submission.focus,
        },
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Brevo error:', response.status, data)
      await notifyFallback(submission, `Brevo ${response.status}: ${data.message || 'unknown error'}`)
    }
  } catch (err) {
    console.error('Social review error:', err)
    await notifyFallback(submission, err.message)
  }
}
