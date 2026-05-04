import { formidable } from 'formidable'
import nodemailer from 'nodemailer'
import fs from 'fs'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let fields, files
  try {
    const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 });
    [fields, files] = await form.parse(req)
  } catch (err) {
    console.error('Form parse error:', err)
    return res.status(500).json({ error: 'Failed to parse form data' })
  }

  const get = (f) => (Array.isArray(fields[f]) ? fields[f][0] : fields[f]) ?? ''

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

  // Build attachments
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

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
