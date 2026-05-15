import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const API_KEY    = (process.env.MAILCHIMP_API_KEY || '').trim()
  const LIST_ID    = (process.env.MAILCHIMP_LIST_ID || '').trim()
  // Derive server from API key (e.g. "...abc-us15" → "us15") as fallback
  const SERVER     = (process.env.MAILCHIMP_SERVER || API_KEY.split('-').pop()).trim()

  if (!API_KEY || !SERVER || !LIST_ID) {
    console.error('Missing Mailchimp environment variables')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const response = await fetch(
      `https://${SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    )

    const data = await response.json()

    // Already subscribed — treat as success so we don't leak info
    if (response.status === 400 && data.title === 'Member Exists') {
      return res.status(200).json({ success: true })
    }

    if (!response.ok) {
      console.error('Mailchimp error status:', response.status, 'title:', data.title, 'detail:', data.detail)
      return res.status(500).json({ error: 'Could not add to list. Please try again.' })
    }

    // Tag the subscriber as Waitlist 2026
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
    await fetch(
      `https://${SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}/tags`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
        },
        body: JSON.stringify({
          tags: [{ name: 'Waitlist 2026', status: 'active' }],
        }),
      }
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
