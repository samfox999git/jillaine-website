import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BeforeAfter from '../components/BeforeAfter'
import BeamsBackground from '../components/BeamsBackground'
import WarpHero from '../components/WarpHero'
import { WebGLShader } from '../components/WebGLShader'
import PageMeta from '../components/PageMeta'
import './Home.css'

/* ── Gallery data ── */
const galleryItems = [
  // Top row (cols 1–5)
  { id: 7,  src: '/images/gallery/northern-lights/campfire-aurora-snow.jpg', title: 'Campfire Northern Lights', objectPosition: 'center 70%' },
  { id: 13, src: '/images/gallery/animals/dog-portrait-realism.jpg', title: 'Dog Portrait', zoom: true },
  { id: 3,  src: '/images/gallery/northern-lights/grizzly-aurora.png', title: 'Grizzly Bear Aurora' },
  { id: 17, src: '/images/gallery/northern-lights/kayak-aurora-campfire.jpg', title: 'Kayak Aurora & Campfire' },
  { id: 11, src: '/images/gallery/nature-landscapes/black-widow-flowers.png', title: 'Black Widow & Flowers' },
  // Row 2+
  { id: 25, src: '/images/gallery/space/space-astronaut-galaxy.jpg', title: 'Astro Sleeve', objectPosition: '30% center' },
  { id: 10, src: '/images/gallery/nature-landscapes/hibiscus-tropical.png', title: 'Tropical Hibiscus' },
  { id: 1,  src: '/images/gallery/animals/wolf-aurora.png', title: 'Howling Wolf Aurora' },
  { id: 24, src: '/images/gallery/northern-lights/waterfall-aurora.jpg', title: 'Waterfall Aurora', zoom: 'lg' },
  { id: 5,  src: '/images/gallery/space/lobster-space.png', title: 'Space Lobster' },
  { id: 14, src: '/images/gallery/northern-lights/moose-river-aurora.jpg', title: 'Moose River Aurora' },
  { id: 8,  src: '/images/gallery/nature-landscapes/unicorn-sunset.png', title: 'Unicorn at Sunset' },
  { id: 6,  src: '/images/gallery/northern-lights/aurora-wolf-mountain.png', title: 'Aurora Wolf Landscape' },
  { id: 16, src: '/images/gallery/other/snake-sleeve.jpg', title: 'Snake Sleeve' },
  { id: 15, src: '/images/gallery/space/pyramid-portal-space.jpg', title: 'Pyramid Portal' },
]

const testimonials = [
  {
    name: 'Chelsea Turner',
    photo: '/images/testimonials/chelsea-turner.png',
    text: `Jillaine is a brilliant artist that creates an amazing environment. I had a tattoo on my shoulder that I got young and always hid. I never wore tank tops or anything that showed my shoulder. Jillaine took one look and was like "I got this" — I sat for 8 hours and she took me from hiding my arm to flaunting it at every opportunity.`,
  },
  {
    name: 'Jaimie Wilson',
    photo: '/images/testimonials/jaimie-wilson.png',
    text: `Jillaine is a tremendously talented tattoo artist and her work is phenomenal. My journey with Jillaine started off by me challenging her with a request for a teacup with the northern lights and somehow a whale incorporated. She knocked it out of the park and I've been hooked since then.`,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
}

/* ── Jellyfish/Space Canvas Background ── */
function SpaceBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrame

    const particles = []
    const jellies = []

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth * 2
      canvas.height = canvas.parentElement.offsetHeight * 2
      canvas.style.width = canvas.parentElement.offsetWidth + 'px'
      canvas.style.height = canvas.parentElement.offsetHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles (stars)
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5,
        speed: 0.15 + Math.random() * 0.3,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    // Far background — small, faint, slow
    for (let i = 0; i < 5; i++) {
      jellies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 10 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -0.06 - Math.random() * 0.08,
        hue: 170 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
        layer: 'far',
      })
    }
    // Mid — medium size
    for (let i = 0; i < 5; i++) {
      jellies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 45 + Math.random() * 45,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -0.15 - Math.random() * 0.2,
        hue: 170 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
        layer: 'mid',
      })
    }
    // Close foreground — large, vivid, faster
    for (let i = 0; i < 5; i++) {
      jellies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 110 + Math.random() * 80,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -0.25 - Math.random() * 0.25,
        hue: 170 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
        layer: 'near',
      })
    }
    // Sometimes 1–2 super close up — massive, very slow drift
    const superCount = Math.random() < 0.1 ? 1 : 0
    for (let i = 0; i < superCount; i++) {
      jellies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 260 + Math.random() * 140,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -0.1 - Math.random() * 0.1,
        hue: 170 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
        layer: 'super',
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Stars
      particles.forEach(p => {
        p.pulse += 0.02
        p.y -= p.speed
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        const alpha = 0.3 + Math.sin(p.pulse) * 0.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`
        ctx.fill()
      })

      // Jellyfish blobs
      jellies.forEach(j => {
        j.phase += 0.01
        j.x += j.speedX + Math.sin(j.phase) * 0.5
        j.y += j.speedY
        if (j.y < -j.r * 3) { j.y = canvas.height + j.r * 3; j.x = Math.random() * canvas.width }
        if (j.x < -j.r * 3) j.x = canvas.width + j.r * 3
        if (j.x > canvas.width + j.r * 3) j.x = -j.r * 3

        const pulseR = j.r + Math.sin(j.phase * 2) * (j.r * 0.07)
        const isFar   = j.layer === 'far'
        const isNear  = j.layer === 'near'
        const isSuper = j.layer === 'super'
        const glowA  = isFar ? 0.06 : isSuper ? 0.22 : isNear ? 0.18 : 0.12
        const bellA  = isFar ? 0.04 : isSuper ? 0.18 : isNear ? 0.14 : 0.08
        const tendA  = isFar ? 0.03 : isSuper ? 0.13 : isNear ? 0.10 : 0.06
        const tendW  = isFar ? 0.8  : isSuper ? 3.5  : isNear ? 2.5  : 1.5

        // Body glow
        const grad = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, pulseR * 2.5)
        grad.addColorStop(0,   `hsla(${j.hue}, 80%, 65%, ${glowA})`)
        grad.addColorStop(0.5, `hsla(${j.hue}, 70%, 55%, ${glowA * 0.4})`)
        grad.addColorStop(1,   `hsla(${j.hue}, 60%, 45%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(j.x, j.y, pulseR * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Bell / dome
        ctx.beginPath()
        ctx.ellipse(j.x, j.y, pulseR, pulseR * 0.7, 0, Math.PI, 0)
        ctx.fillStyle = `hsla(${j.hue}, 80%, 65%, ${bellA})`
        ctx.fill()

        // Tendrils
        for (let t = 0; t < 5; t++) {
          const tx = j.x + (t - 2) * pulseR * 0.3
          const ty = j.y + pulseR * 0.3
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.quadraticCurveTo(
            tx + Math.sin(j.phase + t) * (pulseR * 0.1),
            ty + pulseR * 0.8,
            tx + Math.sin(j.phase + t * 0.5) * (pulseR * 0.15),
            ty + pulseR * 1.5
          )
          ctx.strokeStyle = `hsla(${j.hue}, 70%, 60%, ${tendA})`
          ctx.lineWidth = tendW
          ctx.stroke()
        }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="space-canvas" />
}

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <main className="home-page">
      <PageMeta
        title="Award-Winning Colour Realism Tattoo Artist"
        description="Award-winning colour realism tattoo artist in Kelowna, BC. Vibrant nature, northern lights, space, animals, and cover-up tattoos. Book a free consultation."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TattooParlor",
          "name": "Jillaine Tattoo",
          "description": "Award-winning colour realism and cover-up tattoo specialist in Kelowna, BC. One of Canada's best cover-up tattoo artists.",
          "url": "https://www.jillaine.ca",
          "image": "https://www.jillaine.ca/images/og-preview.jpg",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1990 Landsdowne Pl #3",
            "addressLocality": "Kelowna",
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          "areaServed": ["Kelowna", "British Columbia", "Canada"],
          "sameAs": [
            "https://www.instagram.com/jillaine.tattoo/",
            "https://www.tiktok.com/@jillaine.tattoo",
            "https://www.youtube.com/@jillaine.tattoo"
          ],
          "employee": {
            "@type": "Person",
            "name": "Jillaine",
            "jobTitle": "Colour Realism Tattoo Artist",
            "knowsAbout": ["colour realism tattoos", "cover-up tattoos", "nature tattoos", "space tattoos", "animal portrait tattoos", "northern lights tattoos"]
          }
        }}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero">
        <WarpHero />
        <div className="hero-inner">
          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Vibrant <em className="accent-italic">Colour</em><br />
            <em className="accent-italic">Realism</em> Tattoos
          </motion.h1>
          <motion.p
            className="hero-subtext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            by Jillaine — Award-winning<br />vibrant, high quality ink that lasts
          </motion.p>
        </div>
        <div className="hero-gradient-transition" />
      </section>

      {/* ═══════════════ GALLERY GRID ═══════════════ */}
      <section className="home-gallery">
        <div className="gallery-grid">
          {galleryItems.slice(0, 10).map((item, i) => (
            <motion.div
              key={item.id}
              className={`gallery-grid-item${item.zoom === true ? ' gallery-grid-item--zoomed' : item.zoom === 'sm' ? ' gallery-grid-item--zoomed-sm' : item.zoom === 'lg' ? ' gallery-grid-item--zoomed-lg' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              onClick={() => setLightboxImage(item)}
            >
              <img src={item.src} alt={`Colour realism ${item.title} tattoo by Jillaine — Kelowna, BC`} loading="lazy" style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined} />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="gallery-grid-cta"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/colour-realism-tattoos" className="btn btn-secondary">
            <span>View Full Gallery →</span>
          </Link>
        </motion.div>
      </section>

      <div className="divider" />

      {/* ═══════════════ COVER-UP (two side by side) ═══════════════ */}
      <section className="section coverup-section" id="coverup">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2>Cover-Up Tattoo <span className="gradient-text">Magic</span></h2>
            <p>Drag the slider to reveal each transformation.</p>
          </motion.div>

          <motion.div
            className="coverup-pair"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="coverup-item">
              <BeforeAfter
                beforeSrc="/images/gallery/cover-ups/coverup-wolf-before.jpg"
                afterSrc="/images/gallery/cover-ups/coverup-wolf-after.jpg"
                beforeAlt="Before: Old unwanted tattoo — cover-up transformation by Jillaine, Kelowna BC"
                afterAlt="After: Wolf in space colour realism cover-up tattoo by Jillaine — Kelowna, BC"
                autoDemo
              />
            </div>
            <div className="coverup-item">
              <BeforeAfter
                beforeSrc="/images/gallery/cover-ups/coverup-fineline-before.jpg"
                afterSrc="/images/gallery/cover-ups/coverup-fineline-after.jpg"
                beforeAlt="Before: Fine line tattoo — cover-up transformation by Jillaine, Kelowna BC"
                afterAlt="After: Campfire and nature colour realism cover-up tattoo by Jillaine — Kelowna, BC"
              />
            </div>
          </motion.div>

          <div className="coverup-cta">
            <Link to="/cover-up-tattoos" className="btn btn-secondary">
              <span>View All Cover-Ups →</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════ ABOUT (with space/jellyfish bg) ═══════════════ */}
      <section className="section about-section" id="about">
        <SpaceBackground />
        <div className="container about-layout">
          <motion.div
            className="about-image-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <img
              src="/images/about/jillaine-portrait.jpg"
              alt="Jillaine, colour realism tattoo artist in Kelowna, BC"
              className="about-portrait"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="about-text-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="section-label" variants={fadeUp}>About Me</motion.p>
            <motion.p variants={fadeUp}>
              Hi, I'm Jillaine — a tattoo artist located in Kelowna BC, Canada. With 8 years of tattooing
              experience, I've had the honour of welcoming clients from all across North America.
              One of my proudest moments was winning an award at Canada's largest tattoo
              convention — the Calgary Tattoo and Arts Festival.
            </motion.p>
            <motion.p variants={fadeUp}>
              Raised on a farm in Alberta, I developed a deep love for nature, which continues
              to inspire much of my work. I specialize in colour realism and love creating
              detailed landscapes, northern lights, florals, underwater scenes, space themes,
              and wildlife — anything that captures the beauty of the natural world.
            </motion.p>
            <motion.p variants={fadeUp}>
              Cover-up tattoos are another passion of mine. I love the challenge of transforming
              unwanted ink into something beautiful, helping people reclaim their confidence and
              feel more at home in their skin.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="testimonial-section" id="testimonials">
        <BeamsBackground intensity="subtle">
          <div className="section container">
            <motion.div
              className="testimonial-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <p className="section-label">Kind Words</p>
              <h2 className="testimonial-subheading">from <span className="gradient-text">clients</span></h2>
            </motion.div>

            <div className="testimonial-cards">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className={`testimonial-card ${i === 1 ? 'testimonial-card--offset' : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  custom={i}
                >
                  <span className="testimonial-card-quote">"</span>
                  <p className="testimonial-card-text">{t.text}</p>
                  <div className="testimonial-card-author">
                    <img src={t.photo} alt={`${t.name} — client of Jillaine Tattoo, Kelowna BC`} className="testimonial-card-avatar" loading="lazy" />
                    <span className="testimonial-card-name">{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </BeamsBackground>
      </section>

      <div className="divider" />

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="cta-section" id="cta">
        <WebGLShader className="cta-webgl" />
        <div className="container">
          <motion.div
            className="cta-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2>Ready to Start Your <span className="gradient-text">Next Piece</span>?</h2>
            <p>Book a free consultation and let's create something beautiful together.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              <span>Book A Consultation</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ LIGHTBOX ═══════════════ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>✕</button>
            <motion.img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="lightbox-img"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
