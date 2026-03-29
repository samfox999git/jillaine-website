import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BeforeAfter from '../components/BeforeAfter'
import { WebGLShader } from '../components/WebGLShader'
import './Gallery.css'

const galleryItems = [
  { id: 1, src: '/images/gallery/animals/wolf-aurora.png', category: 'animals', title: 'Howling Wolf Aurora' },
  { id: 2, src: '/images/gallery/nature-landscapes/peony-butterflies.png', category: 'nature-landscapes', title: 'Peony & Butterflies' },
  { id: 3, src: '/images/gallery/northern-lights/grizzly-aurora.png', category: 'northern-lights', title: 'Grizzly Bear Aurora' },
  { id: 4, src: '/images/gallery/nature-landscapes/hawaii-sunset.png', category: 'nature-landscapes', title: 'Hawaii Sunset' },
  { id: 5, src: '/images/gallery/space/lobster-space.png', category: 'space', title: 'Space Lobster' },
  { id: 6, src: '/images/gallery/northern-lights/aurora-wolf-mountain.png', category: 'northern-lights', title: 'Aurora Wolf Landscape' },
  { id: 7, src: '/images/gallery/northern-lights/campfire-aurora.png', category: 'northern-lights', title: 'Campfire Northern Lights' },
  { id: 8, src: '/images/gallery/nature-landscapes/unicorn-sunset.png', category: 'nature-landscapes', title: 'Unicorn at Sunset' },
  { id: 9, src: '/images/gallery/space/galaxy-feathers.png', category: 'space', title: 'Galaxy Feathers' },
  { id: 10, src: '/images/gallery/nature-landscapes/hibiscus-tropical.png', category: 'nature-landscapes', title: 'Tropical Hibiscus' },
  { id: 11, src: '/images/gallery/nature-landscapes/black-widow-flowers.png', category: 'nature-landscapes', title: 'Black Widow & Flowers' },
  { id: 12, src: '/images/gallery/black-and-grey/cowboy-eagle.png', category: 'black-and-grey', title: 'Cowboy & Eagle' },
  { id: 13, src: '/images/gallery/animals/dog-portrait-realism.jpg', category: 'animals', title: 'Dog Portrait' },
  { id: 14, src: '/images/gallery/northern-lights/moose-river-aurora.jpg', category: 'northern-lights', title: 'Moose River Aurora' },
  { id: 15, src: '/images/gallery/space/pyramid-portal-space.jpg', category: 'space', title: 'Pyramid Portal' },
  { id: 16, src: '/images/gallery/other/snake-sleeve.jpg', category: 'animals', title: 'Snake Sleeve' },
  { id: 17, src: '/images/gallery/nature-landscapes/forest-woman-ravens.jpg', category: 'nature-landscapes', title: 'Forest Woman & Ravens' },
  { id: 18, src: '/images/gallery/animals/raven-pinecones.jpg', category: 'animals', title: 'Raven & Pinecones' },
  { id: 19, src: '/images/gallery/space/jellyfish-galaxy.jpg', category: 'space', title: 'Jellyfish Galaxy' },
  { id: 20, src: '/images/gallery/northern-lights/maple-leaf-moose-aurora.jpg', category: 'northern-lights', title: 'Maple Leaf Moose Aurora' },
  { id: 21, src: '/images/gallery/black-and-grey/wwii-pilot-planes.jpg', category: 'black-and-grey', title: 'WWII Pilot & Planes' },
  { id: 22, src: '/images/gallery/black-and-grey/skull-forest.jpg', category: 'black-and-grey', title: 'Skull & Forest' },
  { id: 23, src: '/images/gallery/northern-lights/mountain-aurora-triangle.jpg', category: 'northern-lights', title: 'Mountain Aurora Triangle' },
  { id: 24, src: '/images/gallery/northern-lights/waterfall-aurora.jpg', category: 'northern-lights', title: 'Waterfall Aurora' },
  { id: 25, src: '/images/gallery/space/astronaut-planet.jpg', category: 'space', title: 'Astronaut on Planet' },
  { id: 26, src: '/images/gallery/space/astro-sleeve-1.jpg', category: 'space', title: 'Astro Sleeve' },
  { id: 27, src: '/images/gallery/space/astro-sleeve-2.jpg', category: 'space', title: 'Astro Sleeve II' },
  { id: 28, src: '/images/gallery/space/astro-sleeve-3.jpg', category: 'space', title: 'Astro Sleeve III' },
  { id: 29, src: '/images/gallery/northern-lights/kayak-aurora-campfire.jpg', category: 'northern-lights', title: 'Kayak Aurora & Campfire' },
]

const coverUps = [
  { id: 1, before: '/images/gallery/cover-ups/coverup-1-before.jpg', after: '/images/gallery/cover-ups/coverup-1-after.jpg', title: 'Tribal to Galaxy Spiral' },
  { id: 2, before: '/images/gallery/cover-ups/coverup-2-before.jpg', after: '/images/gallery/cover-ups/coverup-2-after.jpg', title: 'Cover-Up Transformation' },
  { id: 3, before: '/images/gallery/cover-ups/coverup-3-before.jpg', after: '/images/gallery/cover-ups/coverup-3-after.jpg', title: 'Cover-Up Transformation' },
  { id: 4, before: '/images/gallery/cover-ups/coverup-4-before.jpg', after: '/images/gallery/cover-ups/coverup-4-after.jpg', title: 'Cover-Up Transformation' },
  { id: 5, before: '/images/gallery/cover-ups/coverup-5-before.jpg', after: '/images/gallery/cover-ups/coverup-5-after.jpg', title: 'Cover-Up Transformation' },
  { id: 6, before: '/images/gallery/cover-ups/coverup-6-before.jpg', after: '/images/gallery/cover-ups/coverup-6-after.jpg', title: 'Cover-Up Transformation' },
  { id: 7, before: '/images/gallery/cover-ups/coverup-7-before.jpg', after: '/images/gallery/cover-ups/coverup-7-after.jpg', title: 'Cover-Up Transformation' },
  { id: 8, before: '/images/gallery/cover-ups/coverup-8-before.jpg', after: '/images/gallery/cover-ups/coverup-8-after.jpg', title: 'Cover-Up Transformation' },
  { id: 9, before: '/images/gallery/cover-ups/coverup-9-before.jpg', after: '/images/gallery/cover-ups/coverup-9-after.jpg', title: 'Cover-Up Transformation' },
  { id: 10, before: '/images/gallery/cover-ups/coverup-10-before.png', after: '/images/gallery/cover-ups/coverup-10-after.png', title: 'Mountain Landscape Cover-Up' },
  { id: 11, before: '/images/gallery/cover-ups/coverup-wolf-before.jpg', after: '/images/gallery/cover-ups/coverup-wolf-after.jpg', title: 'Wolf Space Cover-Up' },
  { id: 12, before: '/images/gallery/cover-ups/coverup-polarbear-before.jpg', after: '/images/gallery/cover-ups/coverup-polarbear-after.jpg', title: 'Polar Bear Northern Lights Cover-Up' },
  { id: 13, before: '/images/gallery/cover-ups/coverup-snake-before.jpg', after: '/images/gallery/cover-ups/coverup-snake-after.jpg', title: 'Full Sleeve Snake Lady Cover-Up' },
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'northern-lights', label: 'Northern Lights' },
  { id: 'nature-landscapes', label: 'Nature' },
  { id: 'space', label: 'Space' },
  { id: 'animals', label: 'Animals' },
  { id: 'black-and-grey', label: 'Black & Grey' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5 }
  })
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    if (window.location.hash === '#cover-ups') {
      setTimeout(() => {
        document.getElementById('cover-ups')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  return (
    <main className="gallery-page">
      <div className="page-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Colour Realism Gallery
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="gradient-text">Portfolio</span>
          </motion.h1>
        </div>
      </div>

      <section className="section container">
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`gallery-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div className="filter-indicator" layoutId="galleryFilterIndicator" />
              )}
            </button>
          ))}
          <button
            className="gallery-filter-btn gallery-filter-btn--coverups"
            onClick={() => document.getElementById('cover-ups')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Cover-Ups ↓
          </button>
        </div>

        <motion.div className="gallery-masonry" layout>
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              className="gallery-masonry-item"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              onClick={() => setLightboxImage(item)}
            >
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="gallery-item-overlay">
                <span className="gallery-item-title">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section coverups-gallery" id="cover-ups">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Transformations</p>
            <h2>Cover-Up <span className="gradient-text">Gallery</span></h2>
            <p>Drag the slider to reveal each transformation.</p>
          </div>

          <div className="coverups-grid">
            {coverUps.map((item) => (
              <motion.div
                key={item.id}
                className="coverup-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <BeforeAfter
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={`Before: ${item.title}`}
                  afterAlt={`After: ${item.title}`}
                />
                <p className="coverup-title">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
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
            <Link to="/contact" className="btn btn-primary btn-lg">
              <span>Book A Consultation</span>
            </Link>
          </motion.div>
        </div>
      </section>

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
