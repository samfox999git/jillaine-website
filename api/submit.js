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
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888880;">${get('from_name')} &mdash; ${get('city')}</p>
          </td></tr>

          <!-- Divider -->
          <tr><td colspan="2" style="height:1px;background:#1e1e1e;"></td></tr>

          <!-- Two columns of stacked fields -->
          <tr>
            <!-- Left column -->
            <td style="padding:8px 16px 8px 28px;vertical-align:top;width:50%;border-right:1px solid #1e1e1e;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${field('Name',          get('from_name'))}
                ${field('City',          get('city'))}
                ${field('Age',           get('age'))}
                ${field('Phone',         get('phone'))}
                ${field('Email',         `<a href="mailto:${get('email')}" style="color:#ffffff;text-decoration:none;">${get('email')}</a>`)}
              </table>
            </td>
            <!-- Right column -->
            <td style="padding:8px 28px 8px 16px;vertical-align:top;width:50%;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${field('Tattoo Type',    get('tattoo_type'))}
                ${field('Skin Type',      get('skin_type'))}
                ${field('Location & Size', get('location'))}
                ${field('How They Found You', get('referral'))}
                ${field('On Camera?',    get('social_media'))}
              </table>
            </td>
          </tr>

          <!-- Description full width -->
          <tr><td colspan="2" style="padding:10px 28px 16px;border-top:1px solid #1e1e1e;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.5;">
            <span style="color:#2dd4a8;font-weight:400;">Description:</span>
            <span style="color:#ffffff;font-weight:700;"> ${get('description')}</span>
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
