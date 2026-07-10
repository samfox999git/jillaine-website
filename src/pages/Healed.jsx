import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BeforeAfter from '../components/BeforeAfter'
import { WebGLShader } from '../components/WebGLShader'
import PageMeta from '../components/PageMeta'
import './Gallery.css'
import './Healed.css'

const healedPairs = [
  { id: 1, healed: '/images/gallery/healed/healed-1-healed.jpg', fresh: '/images/gallery/healed/healed-1-fresh.jpg', title: 'Northern Lights Tattoo' },
  { id: 2, healed: '/images/gallery/healed/healed-2-healed.jpg', fresh: '/images/gallery/healed/healed-2-fresh.jpg', title: 'Space Nebula Tattoo' },
  { id: 3, healed: '/images/gallery/healed/healed-3-healed.jpg', fresh: '/images/gallery/healed/healed-3-fresh.jpg', title: 'Alien Woman Space Eye Tattoo' },
  { id: 4, healed: '/images/gallery/healed/healed-4-healed.jpg', fresh: '/images/gallery/healed/healed-4-fresh.jpg', title: 'Space Flower Cover-Up Tattoo' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5 }
  })
}

export default function Healed() {
  return (
    <main className="gallery-page healed-page">
      <PageMeta
        title="Fresh vs Healed Tattoo Results"
        description="See how Jillaine's colour realism tattoos look fresh off the needle versus fully healed. Before & after healing photos from her Kelowna, BC studio."
        path="/healed"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Fresh vs Healed Tattoo Results",
          "description": "Fresh versus healed tattoo comparison photos showing how Jillaine's colour realism tattoo work settles and heals over time.",
          "provider": {
            "@type": "Person",
            "name": "Jillaine",
            "worksFor": {
              "@type": "TattooParlor",
              "name": "District Ink Tattoo Studio",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1990 Landsdowne Pl #3",
                "addressLocality": "Kelowna",
                "addressRegion": "BC",
                "addressCountry": "CA"
              }
            }
          },
          "areaServed": ["Kelowna", "British Columbia", "Canada"],
          "url": "https://www.jillaine.ca/healed"
        }}
      />
      <div className="page-hero">
        <div className="container">
          <motion.h1
            className="healed-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="healed-hero-fresh">Fresh</span>
            <span className="healed-hero-vs">vs</span>
            <span className="gradient-text">Healed</span>
          </motion.h1>
          <motion.p
            className="coverups-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Drag to reveal.
          </motion.p>
        </div>
      </div>

      <section className="section coverups-gallery">
        <div className="container">
          <div className="coverups-grid">
            {healedPairs.map((item, i) => (
              <motion.div
                key={item.id}
                className="coverup-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <BeforeAfter
                  beforeSrc={item.fresh}
                  afterSrc={item.healed}
                  beforeLabel="Fresh"
                  afterLabel="Healed"
                  beforeAlt={`Fresh: ${item.title} — freshly done colour realism tattoo by Jillaine, Kelowna BC`}
                  afterAlt={`Healed: ${item.title} — fully healed colour realism tattoo by Jillaine, Kelowna BC`}
                  autoDemo={i === 0}
                />
                {item.title.toLowerCase().includes('cover-up') && (
                  <p className="coverup-title">Cover-Up</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="coverups-blurb container container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p>I get asked all the time what my healed tattoos actually look like, so here you go. I do everything I can on my end to make sure you walk away with a vibrant tattoo that lasts.</p>
          <p>A huge part of it comes down to after-care and how much sun your tattoo gets afterward. Take care of it right and it'll stay looking incredible for a long time.</p>
        </motion.div>
      </section>

      <section className="cta-section">
        <WebGLShader className="cta-webgl" />
        <div className="container">
          <motion.div
            className="cta-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>Ready to Start Your <span className="gradient-text">Next Piece</span>?</h2>
            <p>Book a free consultation and let's create something beautiful together.</p>
            <Link to="/waitlist" className="btn btn-primary btn-lg">
              <span>Book A Consultation</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
