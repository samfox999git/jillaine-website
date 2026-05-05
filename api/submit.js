import { formidable } from 'formidable'
import nodemailer from 'nodemailer'
import fs from 'fs'
import { google } from 'googleapis'

export const config = { api: { bodyParser: false } }

const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

// Rate limiting: 3 submissions per IP per hour
const rateLimitMap = new Map()
const isRateLimited = (ip) => {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

const makeTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
})

const sendErrorReport = async (err, fields) => {
  try {
    const rows = fields
      ? Object.entries(fields)
          .map(([k, v]) => {
            const val = Array.isArray(v) ? v[0] : v
            return `<tr>
              <td style="padding:5px 10px;color:#aaaaaa;font-size:13px;white-space:nowrap;">${esc(k)}</td>
              <td style="padding:5px 10px;color:#ffffff;font-size:13px;">${esc(String(val ?? ''))}</td>
            </tr>`
          })
          .join('')
      : `<tr><td colspan="2" style="padding:8px 10px;color:#aaaaaa;">No form data available</td></tr>`

    const errorLine = esc(err?.message || String(err))
    const codeLine = err?.code ? `<p style="margin:0 0 4px;font-size:13px;color:#aaaaaa;"><strong style="color:#ff6b6b;">Code:</strong> ${esc(String(err.code))}</p>` : ''

    await makeTransporter().sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: 'samfox999@gmail.com',
      subject: `⚠️ Form Error — ${new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}`,
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:24px;background:#111111;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:10px;overflow:hidden;">
            <div style="height:4px;background:linear-gradient(90deg,#ff6b6b,#ff9f43);"></div>
            <div style="padding:24px 28px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff6b6b;">Jillaine Website</p>
              <h1 style="margin:0 0 16px;font-size:20px;color:#ffffff;">Form Submission Error</h1>
              <p style="margin:0 0 4px;font-size:13px;color:#aaaaaa;"><strong style="color:#ff6b6b;">Error:</strong> ${errorLine}</p>
              ${codeLine}
            </div>
            <div style="height:1px;background:#2a2a2a;"></div>
            <div style="padding:20px 28px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2dd4a8;">Form Data Submitted</p>
              <table style="width:100%;border-collapse:collapse;">${rows}</table>
            </div>
            <div style="height:3px;background:linear-gradient(90deg,#ff6b6b,#ff9f43);"></div>
          </div>
        </body></html>`,
    })
  } catch (reportErr) {
    console.error('Failed to send error report:', reportErr)
  }
}

const SHEET_NAME = 'Intake Forms'

const SOURCE_COLORS = {
  'Instagram':               'FCE4EC',
  'TikTok':                  'E8EAF6',
  'Word of Mouth':           'E8F5E9',
  'Google Search':           'FFF9C4',
  'Tattoo Convention':       'F3E5F5',
  'YouTube':                 'FBE9E7',
  'Other':                   'E0F7FA',
  'AI (Chat GPT, Claude, etc)': 'EDE7F6',
}

const hexToRgb = (hex) => ({
  red:   parseInt(hex.slice(0, 2), 16) / 255,
  green: parseInt(hex.slice(2, 4), 16) / 255,
  blue:  parseInt(hex.slice(4, 6), 16) / 255,
})

const formatPhone = (raw) => {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  return raw
}

const addToSheet = async (row, source) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    // Look up the sheetId by tab name
    const meta = await sheets.spreadsheets.get({ spreadsheetId })
    const sheet = meta.data.sheets.find(s => s.properties.title === SHEET_NAME)
    const sheetId = sheet?.properties?.sheetId ?? 0

    // Insert blank row + apply source color in one batchUpdate
    const requests = [{
      insertDimension: {
        range: { sheetId, dimension: 'ROWS', startIndex: 1, endIndex: 2 },
        inheritFromBefore: false,
      },
    }]

    const colorHex = SOURCE_COLORS[source]
    if (colorHex) {
      requests.push({
        repeatCell: {
          range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 10, endColumnIndex: 11 },
          cell: { userEnteredFormat: { backgroundColor: hexToRgb(colorHex) } },
          fields: 'userEnteredFormat.backgroundColor',
        },
      })
    }

    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } })

    // Write the new submission into that row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${SHEET_NAME}'!A2`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } catch (err) {
    console.error('Google Sheets error:', err)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Please try again in an hour.' })
  }

  let fields, files
  try {
    const form = formidable({ multiples: true, maxFileSize: 4 * 1024 * 1024 })
    ;[fields, files] = await form.parse(req)
  } catch (err) {
    console.error('Form parse error:', err)
    await sendErrorReport(err, null)
    return res.status(500).json({ error: 'Failed to parse form data' })
  }

  const get = (f) => (Array.isArray(fields[f]) ? fields[f][0] : fields[f]) ?? ''

  // Honeypot check — silently succeed to confuse bots
  if (get('_hp')) {
    return res.status(200).json({ success: true })
  }

  // Basic server-side validation
  if (!get('from_name').trim() || !get('email').trim()) {
    return res.status(400).json({ error: 'Name and email are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email'))) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  // File type validation
  if (files.referencePhotos) {
    const photos = Array.isArray(files.referencePhotos) ? files.referencePhotos : [files.referencePhotos]
    for (const file of photos) {
      if (!file.mimetype?.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed.' })
      }
    }
  }

  const field = (label, value) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1e1e1e;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.4;">
        <span style="color:#2dd4a8;font-weight:400;">${label}:</span>
        <span style="color:#ffffff;font-weight:700;"> ${value}</span>
      </td>
    </tr>`

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:32px 16px;">
      <tr><td align="center">
        <table width="720" cellpadding="0" cellspacing="0" style="max-width:720px;width:100%;background:#111111;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.15);">

          <!-- Teal accent bar -->
          <tr><td colspan="2" style="height:4px;background:linear-gradient(90deg,#2dd4a8,#22d3ee);"></td></tr>

          <!-- Header -->
          <tr><td colspan="2" style="padding:24px 28px 18px;">
            <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#2dd4a8;">Jillaine Tattoo</p>
            <h1 style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;line-height:1.2;">New Consultation Request</h1>
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888880;">${esc(get('from_name'))} &mdash; ${esc(get('city'))}</p>
          </td></tr>

          <!-- Divider -->
          <tr><td colspan="2" style="height:1px;background:#1e1e1e;"></td></tr>

          <!-- Two columns of stacked fields -->
          <tr>
            <!-- Left column -->
            <td style="padding:8px 16px 8px 28px;vertical-align:top;width:50%;border-right:1px solid #1e1e1e;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${field('Name',          esc(get('from_name')))}
                ${field('City',          esc(get('city')))}
                ${field('Age',           esc(get('age')))}
                ${field('Phone',         esc(get('phone')))}
                ${field('Email',         `<a href="mailto:${esc(get('email'))}" style="color:#ffffff;text-decoration:none;">${esc(get('email'))}</a>`)}
              </table>
            </td>
            <!-- Right column -->
            <td style="padding:8px 28px 8px 16px;vertical-align:top;width:50%;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${field('Tattoo Type',    esc(get('tattoo_type')))}
                ${field('Skin Type',      esc(get('skin_type')))}
                ${field('Location & Size', esc(get('location')))}
                ${field('How They Found You', esc(get('referral')))}
                ${field('On Camera?',    esc(get('social_media')))}
              </table>
            </td>
          </tr>

          <!-- Description full width -->
          <tr><td colspan="2" style="padding:10px 28px 16px;border-top:1px solid #1e1e1e;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.5;">
            <span style="color:#2dd4a8;font-weight:400;">Description:</span>
            <span style="color:#ffffff;font-weight:700;"> ${esc(get('description'))}</span>
          </td></tr>

          <!-- Quoted Rate footnote -->
          <tr><td colspan="2" style="padding:10px 28px 14px;border-top:1px solid #1e1e1e;">
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#aaaaaa;">QR3</p>
          </td></tr>

          <!-- Bottom bar -->
          <tr><td colspan="2" style="height:3px;background:linear-gradient(90deg,#2dd4a8,#22d3ee);"></td></tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `

  // Build attachments from uploaded files
  const attachments = []
  if (files.referencePhotos) {
    const photos = Array.isArray(files.referencePhotos) ? files.referencePhotos : [files.referencePhotos]
    for (const file of photos) {
      attachments.push({
        filename: file.originalFilename || 'reference.jpg',
        content: fs.readFileSync(file.filepath),
      })
    }
  }

  try {
    await makeTransporter().sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_TO || process.env.GMAIL_USER,
      replyTo: get('email'),
      subject: `New Consultation Request — ${get('from_name')} — ${get('city')}`,
      html,
      attachments,
    })

    const referral = get('referral')
    const source = referral.startsWith('Other: ') ? 'Other' : referral
    const sourceDetails = referral.startsWith('Other: ') ? referral.slice(7) : ''
    const dateSubmitted = new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', timeZone: 'America/Vancouver' })

    await addToSheet([
      dateSubmitted,
      get('from_name'),
      get('email'),
      formatPhone(get('phone')),
      get('age'),
      get('city'),
      get('tattoo_type'),
      get('skin_type'),
      get('location'),
      get('description'),
      source,
      sourceDetails,
      get('social_media'),
    ], source)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    await sendErrorReport(err, fields)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
