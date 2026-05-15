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
    return res.status(500).json({ error: 'Server configuration error.' })
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
      return res.status(500).json({ error: 'Could not add to list. Please try again.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
