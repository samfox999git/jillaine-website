import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { WebGLShader } from '../components/WebGLShader'
import PageMeta from '../components/PageMeta'
import './Gallery.css'

const galleryItems = [
  // Row 1
  { id: 29, src: '/images/gallery/northern-lights/kayak-aurora-campfire.jpg',        categories: ['northern-lights', 'nature-landscapes'],            title: 'Kayak Aurora & Campfire' },
  { id: 2,  src: '/images/gallery/nature-landscapes/peony-butterflies.png',          categories: ['nature-landscapes', 'animals'],                    title: 'Peony & Butterflies' },
  { id: 7,  src: '/images/gallery/northern-lights/campfire-aurora-snow.jpg',              categories: ['northern-lights', 'nature-landscapes'],            title: 'Campfire Northern Lights' },
  // Row 2
  { id: 40, src: '/images/gallery/nature-landscapes/flowers-moon-mountain.jpg',      categories: ['nature-landscapes'],                               title: 'Flowers, Moon & Mountain' },
  { id: 3,  src: '/images/gallery/northern-lights/grizzly-aurora.png',               categories: ['northern-lights', 'animals'],                      title: 'Grizzly Bear Aurora' },
  { id: 17, src: '/images/gallery/nature-landscapes/forest-woman-ravens.jpg',        categories: ['nature-landscapes'],                               title: 'Forest Woman & Ravens' },
  // Row 3
  { id: 13, src: '/images/gallery/animals/dog-portrait-realism.jpg',                 categories: ['animals'],                                         title: 'Dog Portrait', zoom: true },
  { id: 26, src: '/images/gallery/space/space-astronaut-galaxy.jpg',                 categories: ['space'],                                           title: 'Astro Sleeve', zoom: 'sm' },
  { id: 38, src: '/images/gallery/northern-lights/bear-northern-lights.jpg',         categories: ['northern-lights', 'animals'],                      title: 'Bear & Northern Lights' },
  // Row 4
  { id: 10, src: '/images/gallery/nature-landscapes/hibiscus-tropical.png',          categories: ['nature-landscapes'],                               title: 'Tropical Hibiscus' },
  { id: 5,  src: '/images/gallery/space/lobster-space.png',                          categories: ['space', 'animals'],                               title: 'Space Lobster' },
  { id: 24, src: '/images/gallery/northern-lights/waterfall-aurora.jpg',             categories: ['northern-lights', 'nature-landscapes'],            title: 'Waterfall Aurora', zoom: 'lg' },
  // Row 5
  { id: 49, src: '/images/gallery/black-and-grey/bg-elephant-back.jpg',              categories: ['black-and-grey', 'animals'],                       title: 'Elephant Full Back' },
  { id: 1,  src: '/images/gallery/animals/wolf-aurora.png',                          categories: ['animals', 'northern-lights'],                      title: 'Howling Wolf Aurora' },
  { id: 19, src: '/images/gallery/space/jellyfish-galaxy.jpg',                       categories: ['space', 'animals'],                               title: 'Jellyfish Galaxy' },
  // Row 6
  { id: 35, src: '/images/gallery/nature-landscapes/fall-forest-river.jpg',          categories: ['nature-landscapes'],                               title: 'Fall Forest River' },
  { id: 6,  src: '/images/gallery/northern-lights/aurora-wolf-mountain.png',         categories: ['northern-lights', 'nature-landscapes'],            title: 'Aurora Wolf Landscape' },
  { id: 30, src: '/images/gallery/animals/portrait-dogs-frame.png',                  categories: ['animals'],                                         title: 'Dog Portrait Triptych' },
  // Row 7
  { id: 15, src: '/images/gallery/space/pyramid-portal-space.jpg',                   categories: ['space'],                                           title: 'Pyramid Portal' },
  { id: 37, src: '/images/gallery/northern-lights/alaska-northern-lights-elk.jpg',   categories: ['northern-lights'],                                 title: 'Alaska Northern Lights & Elk' },
  { id: 21, src: '/images/gallery/black-and-grey/wwii-pilot-planes.jpg',             categories: ['black-and-grey'],                                  title: 'WWII Pilot & Planes' },
  // Row 8
  { id: 32, src: '/images/gallery/space/jellyfish-thigh.jpg',                        categories: ['space', 'animals'],                               title: 'Glowing Jellyfish' },
  { id: 46, src: '/images/gallery/black-and-grey/bg-mountains-nature.jpg',           categories: ['black-and-grey', 'nature-landscapes'],             title: 'Mountains & Waterfall' },
  { id: 8,  src: '/images/gallery/nature-landscapes/unicorn-sunset.png',             categories: ['nature-landscapes', 'animals'],                    title: 'Unicorn at Sunset' },
  // Row 9
  { id: 34, src: '/images/gallery/northern-lights/mountain-aurora-diamond.jpg',      categories: ['northern-lights', 'nature-landscapes'],            title: 'Mountain Aurora Diamond' },
  { id: 18, src: '/images/gallery/animals/raven-pinecones.jpg',                      categories: ['animals', 'nature-landscapes'],                    title: 'Raven & Pinecones' },
  { id: 47, src: '/images/gallery/black-and-grey/bg-cowboy-horse.jpg',               categories: ['black-and-grey', 'animals', 'nature-landscapes'],  title: 'Cowboy & Horse' },
  // Row 10
  { id: 27, src: '/images/gallery/space/astro-sleeve-2.jpg',                         categories: ['space'],                                           title: 'Astro Sleeve II' },
  { id: 4,  src: '/images/gallery/nature-landscapes/hawaii-sunset.png',              categories: ['nature-landscapes'],                               title: 'Hawaii Sunset' },
  { id: 48, src: '/images/gallery/black-and-grey/bg-dog-portrait.jpg',               categories: ['black-and-grey', 'animals'],                       title: 'Dog Portrait B&G' },
  // Row 11
  { id: 12, src: '/images/gallery/black-and-grey/cowboy-eagle.png',                  categories: ['black-and-grey', 'animals'],                       title: 'Cowboy & Eagle' },
  { id: 16, src: '/images/gallery/other/snake-sleeve.jpg',                           categories: ['animals'],                                         title: 'Snake Sleeve' },
  { id: 25, src: '/images/gallery/space/astronaut-planet.jpg',                       categories: ['space'],                                           title: 'Astronaut on Planet' },
  // Row 12
  { id: 28, src: '/images/gallery/space/astro-sleeve-3.jpg',                         categories: ['space'],                                           title: 'Astro Sleeve III' },
  { id: 20, src: '/images/gallery/northern-lights/maple-leaf-moose-aurora.jpg',      categories: ['northern-lights', 'nature-landscapes'],            title: 'Maple Leaf Moose Aurora' },
  { id: 50, src: '/images/gallery/black-and-grey/bg-lion.jpg',                       categories: ['black-and-grey', 'animals'],                       title: 'Lion Portrait' },
  // Row 13
  { id: 33, src: '/images/gallery/animals/octopus-sleeve.jpg',                       categories: ['animals'],                                         title: 'Octopus Sleeve' },
  { id: 41, src: '/images/gallery/other/fresh-vs-healed.png',                        categories: ['other'],                                           title: 'Fresh vs Healed' },
  { id: 42, src: '/images/gallery/black-and-grey/formula-1-ayrton-senna.webp',       categories: ['black-and-grey'],                                  title: 'Ayrton Senna Formula 1' },
  // Row 14
  { id: 43, src: '/images/gallery/space/cosmic-woman-space.webp',                    categories: ['space'],                                           title: 'Cosmic Woman' },
  { id: 44, src: '/images/gallery/space/space-nebula-sleeve.webp',                   categories: ['space'],                                           title: 'Space Nebula Sleeve' },
  { id: 45, src: '/images/gallery/space/star-wars-princess-leia.webp',               categories: ['space'],                                           title: 'Star Wars — Princess Leia' },
  // Row 15
  { id: 36, src: '/images/gallery/space/galaxy-butterfly.jpg',                       categories: ['space', 'animals'],                               title: 'Galaxy Butterfly' },
  { id: 22, src: '/images/gallery/black-and-grey/skull-forest.jpg',                  categories: ['black-and-grey', 'nature-landscapes'],             title: 'Skull & Forest' },
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'northern-lights', label: 'Northern Lights' },
  { id: 'nature-landscapes', label: 'Nature' },
  { id: 'space', label: 'Space' },
  { id: 'animals', label: 'Animals' },
  { id: 'black-and-grey', label: 'Black & Grey' },
]


export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.categories.includes(activeCategory))

  return (
    <main className="gallery-page">
      <PageMeta
        title="Colour Realism Tattoo Gallery — Kelowna, BC"
        description="Browse Jillaine's colour realism tattoo portfolio — northern lights, nature, space, animals, and cover-ups. Award-winning tattoo artist in Kelowna, BC."
        path="/colour-realism-tattoos"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Colour Realism Tattoo Portfolio — Jillaine",
          "description": "Gallery of colour realism tattoos including northern lights, nature, space, animals, and cover-ups by Jillaine, tattoo artist in Kelowna, BC.",
          "url": "https://www.jillaine.ca/colour-realism-tattoos",
          "author": {
            "@type": "Person",
            "name": "Jillaine",
            "jobTitle": "Colour Realism Tattoo Artist"
          }
        }}
      />
      <div className="page-hero">
        <div className="container">
          <motion.p className="section-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Portfolio
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Color Realism <span className="gradient-text">Tattoos</span>
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
          <Link to="/cover-up-tattoos" className="gallery-filter-btn">
            Cover-Ups
          </Link>
        </div>

        <motion.div className="gallery-masonry" layout>
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              className={`gallery-masonry-item${item.zoom === true ? ' gallery-masonry-item--zoomed' : item.zoom === 'sm' ? ' gallery-masonry-item--zoomed-sm' : item.zoom === 'lg' ? ' gallery-masonry-item--zoomed-lg' : ''}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              onClick={() => setLightboxImage(item)}
            >
              <img src={item.src} alt={item.categories.includes('black-and-grey') ? `Black and grey ${item.title} tattoo by Jillaine — Kelowna, BC` : `Colour realism ${item.title} tattoo by Jillaine — Kelowna, BC`} loading="lazy" />
              <div className="gallery-item-overlay">
                <span className="gallery-item-title">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
              alt={lightboxImage.categories.includes('black-and-grey') ? `Black and grey ${lightboxImage.title} tattoo by Jillaine — Kelowna, BC` : `Colour realism ${lightboxImage.title} tattoo by Jillaine — Kelowna, BC`}
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
