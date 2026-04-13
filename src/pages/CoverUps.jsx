import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BeforeAfter from '../components/BeforeAfter'
import { WebGLShader } from '../components/WebGLShader'
import './Gallery.css'

const coverUps = [
  { id: 11, before: '/images/gallery/cover-ups/coverup-wolf-before.jpg',      after: '/images/gallery/cover-ups/coverup-wolf-after.jpg',      title: 'Wolf Space Cover-Up' },
  { id: 5,  before: '/images/gallery/cover-ups/coverup-5-before.jpg',         after: '/images/gallery/cover-ups/coverup-5-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 13, before: '/images/gallery/cover-ups/coverup-snake-before.jpg',     after: '/images/gallery/cover-ups/coverup-snake-after.jpg',     title: 'Full Sleeve Snake Lady Cover-Up' },
  { id: 2,  before: '/images/gallery/cover-ups/coverup-2-before.jpg',         after: '/images/gallery/cover-ups/coverup-2-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 10, before: '/images/gallery/cover-ups/coverup-10-before.png',        after: '/images/gallery/cover-ups/coverup-10-after.png',        title: 'Mountain Landscape Cover-Up' },
  { id: 7,  before: '/images/gallery/cover-ups/coverup-7-before.jpg',         after: '/images/gallery/cover-ups/coverup-7-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 12, before: '/images/gallery/cover-ups/coverup-polarbear-before.jpg', after: '/images/gallery/cover-ups/coverup-polarbear-after.jpg', title: 'Polar Bear Northern Lights Cover-Up' },
  { id: 3,  before: '/images/gallery/cover-ups/coverup-3-before.jpg',         after: '/images/gallery/cover-ups/coverup-3-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 9,  before: '/images/gallery/cover-ups/coverup-9-before.jpg',         after: '/images/gallery/cover-ups/coverup-9-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 1,  before: '/images/gallery/cover-ups/coverup-1-before.jpg',         after: '/images/gallery/cover-ups/coverup-1-after.jpg',         title: 'Tribal to Galaxy Spiral' },
  { id: 6,  before: '/images/gallery/cover-ups/coverup-6-before.jpg',         after: '/images/gallery/cover-ups/coverup-6-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 4,  before: '/images/gallery/cover-ups/coverup-4-before.jpg',         after: '/images/gallery/cover-ups/coverup-4-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 8,  before: '/images/gallery/cover-ups/coverup-8-before.jpg',         after: '/images/gallery/cover-ups/coverup-8-after.jpg',         title: 'Cover-Up Transformation' },
  { id: 14, before: '/images/gallery/cover-ups/coverup-fineline-before.jpg',  after: '/images/gallery/cover-ups/coverup-fineline-after.jpg',  title: 'Fine Line to Campfire Nature Cover-Up' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5 }
  })
}

export default function CoverUps() {
  return (
    <main className="gallery-page">
      <div className="page-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Gallery
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Cover-Up <span className="gradient-text">Tattoos</span>
          </motion.h1>
          <motion.p
            className="coverups-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Drag the slider to reveal each transformation.
          </motion.p>
        </div>
      </div>

      <section className="section coverups-gallery">
        <div className="container">
          <div className="coverups-grid">
            {coverUps.map((item, i) => (
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
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={`Before: ${item.title}`}
                  afterAlt={`After: ${item.title}`}
                  autoDemo={i === 0}
                />
                <p className="coverup-title">{item.title}</p>
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
          <p>I specialize in cover-up tattoos and love helping clients transform old or unwanted ink into custom designs they'll be proud to wear. From small touch-ups to full tattoo makeovers, I focus on creating pieces that are unique, meaningful, and perfectly suited to your style. Explore my before and after gallery to see the transformations I've done, and get in touch to book a consultation for your own cover-up tattoo.</p>
          <p>Based in Kelowna, British Columbia, Canada, I serve clients worldwide and I'm dedicated to making every tattoo experience personal, professional, and unforgettable.</p>
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
            <Link to="/contact" className="btn btn-primary btn-lg">
              <span>Book A Consultation</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
