import { put } from '@vercel/blob'
import { formidable } from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({ maxFileSize: 20 * 1024 * 1024 })
    const [, files] = await form.parse(req)

    const file = Array.isArray(files.photo) ? files.photo[0] : files.photo
    if (!file) return res.status(400).json({ error: 'No file provided' })

    const buffer = fs.readFileSync(file.filepath)
    const blob = await put(`consultation/${Date.now()}-${file.originalFilename}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return res.status(200).json({ url: blob.url })
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: err.message })
  }
}
