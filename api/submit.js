import { del } from '@vercel/blob'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    body = JSON.parse(Buffer.concat(chunks).toString())
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const get = (f) => body[f] ?? ''
  const photoUrls = Array.isArray(body.photoUrls) ? body.photoUrls : []

  const html = `
    <h2 style="color:#2dd4a8">New Consultation Request</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:15px">
      <tr><td style="padding:8px;font-weight:bold;width:200px">Name</td><td style="padding:8px">${get('from_name')}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${get('email')}">${get('email')}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${get('phone')}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Age</td><td style="padding:8px">${get('age')}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">City</td><td style="padding:8px">${get('city')}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Tattoo Type</td><td style="padding:8px">${get('tattoo_type')}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Skin Type</td><td style="padding:8px">${get('skin_type')}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Location & Size</td><td style="padding:8px">${get('location')}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Description</td><td style="padding:8px">${get('description')}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">On Camera?</td><td style="padding:8px">${get('social_media')}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">How They Found You</td><td style="padding:8px">${get('referral')}</td></tr>
    </table>
    <hr style="margin:24px 0;border:none;border-top:1px solid #ddd" />
    <p style="font-family:sans-serif;font-size:13px;color:#888">
      <strong>Quoted Rate:</strong> $3,000 CAD / full day
    </p>
  `

  // Fetch photos from Blob and build attachments
  const attachments = []
  for (const url of photoUrls) {
    try {
      const response = await fetch(url)
      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = url.split('/').pop() || 'reference.jpg'
      attachments.push({ filename, content: buffer })
    } catch (err) {
      console.error('Failed to fetch photo:', url, err)
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Jillaine Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: get('email'),
      subject: `New Consultation — ${get('from_name')}`,
      html,
      attachments,
    })

    // Delete photos from Blob after sending
    for (const url of photoUrls) {
      try { await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN }) } catch {}
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
