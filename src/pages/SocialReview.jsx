import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './Gallery.css'
import './SocialReview.css'

const focusOptions = [
  'Overall feed & branding',
  'Video content & editing',
  'Hooks & captions',
  'Showing off my portfolio',
  'Growing my following',
  'Not sure, surprise me',
]

function CheckIcon() {
  return (
    <svg className="sr-check-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MAX_EXTRA_ACCOUNTS = 4
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SocialReview() {
  const [form, setForm] = useState({ name: '', email: '', mainAccount: '', focus: '' })
  const [ownsAccount, setOwnsAccount] = useState(false)
  const [extraAccounts, setExtraAccounts] = useState([''])
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(searchParams.get('confirmed') ? 'confirmed' : 'idle')
  const [errorMsg, setErrorMsg] = useState('')

  // The success box is much shorter than the form it replaces, so bring it into view.
  const scrollIntoView = useCallback((el) => {
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' })
  }, [])

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setErrorMsg('')
  }

  const updateExtra = (i) => (e) => {
    const next = [...extraAccounts]
    next[i] = e.target.value
    setExtraAccounts(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!EMAIL_RE.test(form.email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!form.mainAccount.trim()) {
      setErrorMsg('Please add a link to your main social media account.')
      return
    }
    if (!ownsAccount) {
      setErrorMsg('Please confirm you own these accounts or have permission to submit them.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/social-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ownsAccount,
          extraAccounts: extraAccounts.map((a) => a.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('idle')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const loading = status === 'loading'

  return (
    <main className="gallery-page sr-page">
      <PageMeta
        title="Get Your Socials Reviewed"
        description="Submit your tattoo social media for a full-length YouTube review by Jillaine."
        path="/review"
      />

      {status !== 'confirmed' && (
      <div className="page-hero">
        <div className="container container-narrow">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Tattoo Artists
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Get Your Socials <span className="gradient-text">Reviewed</span>
          </motion.h1>
          <motion.p
            className="coverups-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            I'm making full-length YouTube videos reviewing tattoo artists' social media posts and profiles. Submit your account below and yours could be featured.
          </motion.p>
        </div>
      </div>
      )}

      <section className={`section container sr-section${status === 'confirmed' ? ' sr-section--solo' : ''}`}>
        <AnimatePresence mode="wait">
          {status === 'success' || status === 'confirmed' ? (
            <motion.div
              key="success"
              ref={status === 'success' ? scrollIntoView : undefined}
              className="sr-success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {status === 'success' ? (
                <>
                  <h2 className="sr-success-title"><CheckIcon />Check Your Inbox</h2>
                  <p>Please confirm your email address so we know it's really you. Just click the link in the email we sent.</p>
                </>
              ) : (
                <>
                  <h2 className="sr-success-title"><CheckIcon />You Are Confirmed</h2>
                  <p>Your submission is in. Keep an eye on YouTube. We'll get to as many profiles as we can!</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="sr-form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="sr-field">
                <label htmlFor="sr-name">Name</label>
                <input id="sr-name" type="text" autoComplete="name" value={form.name} onChange={update('name')} disabled={loading} />
              </div>

              <div className="sr-field">
                <label htmlFor="sr-email">Email <span className="sr-required">*</span></label>
                <input id="sr-email" type="email" autoComplete="email" placeholder="your@email.com" value={form.email} onChange={update('email')} disabled={loading} required />
              </div>

              <div className="sr-field">
                <label htmlFor="sr-main">Main social media account <span className="sr-required">*</span></label>
                <input id="sr-main" type="url" placeholder="instagram.com/yourhandle" value={form.mainAccount} onChange={update('mainAccount')} disabled={loading} required />
              </div>

              <div className="sr-field">
                <label htmlFor="sr-extra-0">Other accounts <span className="sr-optional">Optional</span></label>
                <div className="sr-extra-list">
                  {extraAccounts.map((acct, i) => (
                    <input
                      key={i}
                      id={`sr-extra-${i}`}
                      type="url"
                      placeholder="tiktok.com/@yourhandle"
                      value={acct}
                      onChange={updateExtra(i)}
                      disabled={loading}
                      aria-label={`Other account ${i + 1}`}
                    />
                  ))}
                </div>
                {extraAccounts.length < MAX_EXTRA_ACCOUNTS && (
                  <button type="button" className="sr-add" onClick={() => setExtraAccounts([...extraAccounts, ''])} disabled={loading}>
                    + Add another account
                  </button>
                )}
              </div>

              <div className="sr-field">
                <label htmlFor="sr-focus">Main area you want feedback on <span className="sr-optional">Optional</span></label>
                <select id="sr-focus" value={form.focus} onChange={update('focus')} disabled={loading}>
                  <option value="">Choose one</option>
                  {focusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <label className="sr-check" htmlFor="sr-owns">
                <input
                  id="sr-owns"
                  type="checkbox"
                  checked={ownsAccount}
                  onChange={(e) => { setOwnsAccount(e.target.checked); setErrorMsg('') }}
                  disabled={loading}
                />
                <span>I own these accounts or have permission to submit them. <span className="sr-required">*</span></span>
              </label>

              {errorMsg && <p className="sr-error" role="alert">{errorMsg}</p>}

              <button type="submit" className="btn btn-primary sr-submit" disabled={loading}>
                <span>{loading ? 'Submitting...' : 'Submit My Socials'}</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
