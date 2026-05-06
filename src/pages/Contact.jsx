import { useState } from 'react'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import './Contact.css'

const skinTypes = [
  'Very Pale', 'Pale', 'Lightly Tanned', 'Tanned', 'Dark', 'Freckled', 'Scarred/Stretch Marks'
]

const referralSources = [
  'Instagram', 'TikTok', 'Word of Mouth', 'Google Search',
  'AI (Chat GPT, Claude, etc)', 'Tattoo Convention', 'YouTube', 'Other'
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState({})
  const [honeypot, setHoneypot] = useState('')
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', age: '', city: '',
    tattooType: [], skinType: [], referencePhotos: [],
    location: '', description: '', socialMedia: '', referral: '', referralOther: '',
    coverUp: ''
  })

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const clearError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }))
  }

  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.onload = () => {
      const maxWidth = 1200
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
        'image/jpeg',
        0.70
      )
    }
    img.src = url
  })

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 6)
    const compressed = await Promise.all(files.map(compressImage))
    updateField('referencePhotos', compressed)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = true
    if (!formData.lastName.trim()) newErrors.lastName = true
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true
    if (!formData.phone.trim()) newErrors.phone = true
    if (!formData.age.trim()) newErrors.age = true
    if (!formData.city.trim()) newErrors.city = true
    if (!formData.location.trim()) newErrors.location = true
    if (!formData.description.trim()) newErrors.description = true
    if (!formData.referral) newErrors.referral = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setErrorMsg('Please fill in all required fields.')
      return
    }

    // Honeypot: silently succeed if a bot filled the hidden field
    if (honeypot) {
      setSubmitted(true)
      return
    }

    setUploading(true)

    try {
      const body = new FormData()
      body.append('from_name',    `${formData.firstName} ${formData.lastName}`)
      body.append('email',        formData.email)
      body.append('phone',        formData.phone)
      body.append('age',          formData.age)
      body.append('city',         formData.city)
      body.append('cover_up',     formData.coverUp)
      body.append('tattoo_type',  formData.tattooType.join(', '))
      body.append('skin_type',    formData.skinType.join(', '))
      body.append('location',     formData.location)
      body.append('description',  formData.description)
      body.append('social_media', formData.socialMedia)
      body.append('referral',     formData.referral === 'Other' ? `Other: ${formData.referralOther}` : formData.referral)
      body.append('_hp',          honeypot)
      formData.referencePhotos.forEach(file => body.append('referencePhotos', file))

      const res = await fetch('/api/submit', { method: 'POST', body })
      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (res.status === 429) {
        setRateLimited(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setFailed(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setFailed(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setUploading(false)
    }
  }

  if (rateLimited) {
    return (
      <main className="contact-page">
        <div className="page-hero">
          <div className="container">
            <motion.div
              className="submission-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">⏱️</div>
              <h1>Too Many Submissions</h1>
              <p>You've reached the submission limit. Please wait an hour and try again.</p>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  if (failed) {
    return (
      <main className="contact-page">
        <div className="page-hero">
          <div className="container">
            <motion.div
              className="submission-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">⚠️</div>
              <h1>Message Didn't Go Through</h1>
              <p>Sorry, our form had an error.</p>
              <p className="success-note">Please email <a href={['mailto:', 'jillainetattoo.book', '@', 'gmail.com'].join('')}>{['jillainetattoo.book', '@', 'gmail.com'].join('')}</a> directly to set up a consultation.</p>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="contact-page">
        <div className="page-hero">
          <div className="container">
            <motion.div
              className="submission-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">✨</div>
              <h1>Thank You!</h1>
              <p>Your consultation request has been sent successfully.</p>
              <p className="success-note">In the mean time feel free to read the <a href="/faq">FAQ</a> page.</p>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="contact-page">
      <PageMeta
        title="Book A Free Consultation"
        description="Book a free tattoo consultation with Jillaine — award-winning colour realism tattoo artist in Kelowna, BC. Specializing in cover-ups, nature, space, and animal tattoos."
        path="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Book A Free Consultation — Jillaine Tattoo",
          "description": "Request a free tattoo consultation with Jillaine, colour realism tattoo artist in Kelowna, BC.",
          "url": "https://www.jillaine.ca/contact"
        }}
      />
      <div className="page-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Let's Create Together
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Book A <span className="gradient-text">Consultation</span>
          </motion.h1>
        </div>
      </div>

      <div className="section container container-narrow">
        {/* Pre-form Guidelines */}
        <motion.div
          className="booking-guidelines"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="guidelines-eyebrow">Please read before filling out form below.</p>
          <div className="guidelines-rows">
            <div className="guidelines-row">
              <span className="guidelines-dot" />
              <p>I specialize in <strong>colour realism</strong> — no script, neo-trad, traditional, or linework</p>
            </div>
            <div className="guidelines-row">
              <span className="guidelines-dot" />
              <p>I don't do pieces under <strong>2 hours</strong></p>
            </div>
            <div className="guidelines-row">
              <span className="guidelines-dot" />
              <p>My Rates: <strong>Full Day: $3000 (CAD)</strong> | Rates for ongoing work may differ.</p>
            </div>
            <div className="guidelines-row">
              <span className="guidelines-dot" />
              <p>Read through the <a href="/faq">FAQ</a> before submitting</p>
            </div>
            <div className="guidelines-row">
              <span className="guidelines-dot" />
              <p>Please allow <strong>up to 2 weeks</strong> for a response</p>
            </div>
          </div>
        </motion.div>

        {/* Single-page Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="booking-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* ── Personal Info ── */}
          <div className="form-section">
            <h3 className="form-section-title">Personal Information</h3>
            <div className="form-row">
              <div className={`form-group${errors.firstName ? ' has-error' : ''}`}>
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" type="text" value={formData.firstName} onChange={e => { updateField('firstName', e.target.value); clearError('firstName') }} placeholder="Your first name" />
              </div>
              <div className={`form-group${errors.lastName ? ' has-error' : ''}`}>
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" type="text" value={formData.lastName} onChange={e => { updateField('lastName', e.target.value); clearError('lastName') }} placeholder="Your last name" />
              </div>
            </div>
            <div className="form-row">
              <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" value={formData.email} onChange={e => { updateField('email', e.target.value); clearError('email') }} placeholder="your@email.com" />
              </div>
              <div className={`form-group${errors.phone ? ' has-error' : ''}`}>
                <label htmlFor="phone">Phone *</label>
                <input id="phone" type="tel" value={formData.phone} onChange={e => { updateField('phone', e.target.value); clearError('phone') }} placeholder="(250) 555-0000" />
              </div>
            </div>
            <div className="form-row">
              <div className={`form-group${errors.age ? ' has-error' : ''}`}>
                <label htmlFor="age">Age *</label>
                <input id="age" type="text" value={formData.age} onChange={e => { updateField('age', e.target.value); clearError('age') }} placeholder="Your age" />
              </div>
              <div className={`form-group${errors.city ? ' has-error' : ''}`}>
                <label htmlFor="city">Residing City *</label>
                <input id="city" type="text" value={formData.city} onChange={e => { updateField('city', e.target.value); clearError('city') }} placeholder="Your city" />
              </div>
            </div>
          </div>

          {/* ── Tattoo Details ── */}
          <div className="form-section">
            <h3 className="form-section-title">Tattoo Details</h3>
            <div className="form-group">
              <label>Tattoo Type *</label>
              <div className="checkbox-group">
                {['Colour', 'Black and Grey'].map(type => (
                  <label key={type} className={`checkbox-btn ${formData.tattooType.includes(type) ? 'checked' : ''}`}>
                    <input type="checkbox" checked={formData.tattooType.includes(type)} onChange={() => toggleArrayField('tattooType', type)} />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Is it a cover-up?</label>
              <div className="checkbox-group">
                {['Yes', 'No'].map(option => (
                  <label key={option} className={`checkbox-btn ${formData.coverUp === option ? 'checked' : ''}`}>
                    <input type="radio" name="coverUp" checked={formData.coverUp === option} onChange={() => updateField('coverUp', option)} />
                    {option}
                  </label>
                ))}
              </div>
              {formData.coverUp === 'Yes' && (
                <div className="coverup-note">
                  Please include a photo of the tattoo you want covered up in the reference photos below.
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Skin Type *</label>
              <div className="checkbox-group">
                {skinTypes.map(type => (
                  <label key={type} className={`checkbox-btn ${formData.skinType.includes(type) ? 'checked' : ''}`}>
                    <input type="checkbox" checked={formData.skinType.includes(type)} onChange={() => toggleArrayField('skinType', type)} />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div className={`form-group${errors.location ? ' has-error' : ''}`}>
              <label htmlFor="location">Location and Size of Tattoo *</label>
              <input id="location" type="text" value={formData.location} onChange={e => { updateField('location', e.target.value); clearError('location') }} placeholder="e.g., Right forearm, approximately 6 inches" />
            </div>
            <div className={`form-group${errors.description ? ' has-error' : ''}`}>
              <label htmlFor="description">Description of Your Tattoo Idea *</label>
              <textarea id="description" value={formData.description} onChange={e => { updateField('description', e.target.value); clearError('description') }} placeholder="Describe your tattoo idea in as much detail as possible. Include colours, themes, and any specific elements you'd like..." rows={5} />
            </div>
          </div>

          {/* ── References & Final ── */}
          <div className="form-section">
            <h3 className="form-section-title">References & Final Details</h3>
            <div className="form-group">
              <label htmlFor="referencePhotos">Reference Photos (Up to 6)</label>
              <div className="file-upload-area">
                <input id="referencePhotos" type="file" accept="image/*" multiple onChange={handleFileChange} className="file-input" />
                <div className="file-upload-label">
                  <span className="file-upload-icon">📷</span>
                  <p>Drop reference photos here or <span className="file-upload-link">browse</span></p>
                  <p className="file-upload-hint">PNG, JPG up to 10MB each • Max 6 photos</p>
                </div>
              </div>
              {formData.referencePhotos.length > 0 && (
                <div className="file-preview">
                  {formData.referencePhotos.map((file, i) => (
                    <div key={i} className="file-preview-item">
                      <img src={URL.createObjectURL(file)} alt={`Reference ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Are you interested in speaking on camera for a short social media video? This is optional and won't affect the tattoo.</label>
              <div className="checkbox-group">
                {["I'm interested!", 'No thank you'].map(option => (
                  <label key={option} className={`checkbox-btn ${formData.socialMedia === option ? 'checked' : ''}`}>
                    <input type="radio" name="socialMedia" checked={formData.socialMedia === option} onChange={() => updateField('socialMedia', option)} />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className={`form-group${errors.referral ? ' has-error' : ''}`}>
              <label htmlFor="referral">How Did You Find Me? *</label>
              <select id="referral" value={formData.referral} onChange={e => { updateField('referral', e.target.value); clearError('referral') }}>
                <option value="">Select one...</option>
                {referralSources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
              {formData.referral === 'Other' && (
                <input
                  type="text"
                  value={formData.referralOther}
                  onChange={e => updateField('referralOther', e.target.value)}
                  placeholder="Please tell us how you found us..."
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>
          </div>

          {/* Honeypot — hidden from real users, bots will fill it */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />

          {errorMsg && (
            <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '16px' }}>{errorMsg}</p>
          )}

          <div className="form-submit">
            <button type="submit" className="btn btn-primary btn-lg" disabled={uploading}>
              {uploading ? 'Sending...' : 'Submit Consultation Request'}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  )
}
