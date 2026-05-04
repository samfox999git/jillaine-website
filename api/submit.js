import { formidable } from 'formidable'
import nodemailer from 'nodemailer'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let fields, files
  try {
    const form = formidable({ multiples: true, maxFileSize: 4 * 1024 * 1024 })
    ;[fields, files] = await form.parse(req)
  } catch (err) {
    console.error('Form parse error:', err)
    return res.status(500).json({ error: 'Failed to parse form data' })
  }

  const get = (f) => (Array.isArray(fields[f]) ? fields[f][0] : fields[f]) ?? ''

  const row = (label, value, accent = false) => `
    <tr>
      <td style="padding:12px 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#2dd4a8;width:160px;vertical-align:top;border-bottom:1px solid #1e1e1e;">${label}</td>
      <td style="padding:12px 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:${accent ? '#2dd4a8' : '#e8e0d5'};vertical-align:top;border-bottom:1px solid #1e1e1e;">${value}</td>
    </tr>`

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#0d0d0d;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:12px;overflow:hidden;border:1px solid #222;">

          <!-- Teal accent bar -->
          <tr><td style="height:4px;background:linear-gradient(90deg,#2dd4a8,#22d3ee);"></td></tr>

          <!-- Header -->
          <tr><td style="padding:32px 32px 24px;background:#111;">
            <p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#2dd4a8;">Jillaine Tattoo</p>
            <h1 style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;line-height:1.2;">New Consultation Request</h1>
            <p style="margin:8px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#888880;">${get('from_name')} &mdash; ${get('city')}</p>
          </td></tr>

          <!-- Divider -->
          <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

          <!-- Fields -->
          <tr><td style="padding:8px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('Name',          get('from_name'), true)}
              ${row('Email',         `<a href="mailto:${get('email')}" style="color:#2dd4a8;text-decoration:none;">${get('email')}</a>`)}
              ${row('Phone',         get('phone'))}
              ${row('Age',           get('age'))}
              ${row('City',          get('city'))}
              ${row('Tattoo Type',   get('tattoo_type'))}
              ${row('Skin Type',     get('skin_type'))}
              ${row('Location & Size', get('location'))}
              ${row('Description',   get('description'))}
              ${row('On Camera?',    get('social_media'))}
              ${row('How They Found You', get('referral'))}
            </table>
          </td></tr>

          <!-- Quoted Rate -->
          <tr><td style="padding:24px 32px;background:#0d0d0d;border-top:1px solid #1e1e1e;">
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#888880;letter-spacing:1px;text-transform:uppercase;">Quoted Rate</p>
            <p style="margin:4px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;color:#2dd4a8;">$3,000 CAD / full day</p>
          </td></tr>

          <!-- Bottom bar -->
          <tr><td style="height:3px;background:#1a1a1a;"></td></tr>

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
      subject: `New Consultation Request — ${get('from_name')} — ${get('city')}`,
      html,
      attachments,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
