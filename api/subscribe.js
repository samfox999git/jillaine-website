import nodemailer from 'nodemailer'

const notifyManualAdd = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: 'samfox999@gmail.com',
      subject: 'Waitlist — Manual Add Needed',
      text: `A waitlist signup failed to reach Brevo. Please manually add this email:\n\n${email}`,
    })
  } catch (err) {
    console.error('Failed to send manual add notification:', err)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const API_KEY = (process.env.BREVO_API_KEY || '').trim()
  const LIST_ID = parseInt((process.env.BREVO_LIST_ID || '').trim(), 10)

  if (!API_KEY || !LIST_ID) {
    console.error('Missing Brevo environment variables')
    await notifyManualAdd(email)
    return res.status(200).json({ success: true })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        email,
        includeListIds: [LIST_ID],
        templateId: 1,
        redirectionUrl: 'https://jillaine.ca/waitlist-confirmed',
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Brevo error:', response.status, data)
      await notifyManualAdd(email)
      return res.status(200).json({ success: true })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    await notifyManualAdd(email)
    return res.status(200).json({ success: true })
  }
}
