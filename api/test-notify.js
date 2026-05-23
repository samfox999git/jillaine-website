import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: 'samfox999@gmail.com',
      subject: 'Waitlist — Manual Add Needed',
      text: `A waitlist signup failed to reach Brevo. Please manually add this email:\n\ntest@example.com`,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
