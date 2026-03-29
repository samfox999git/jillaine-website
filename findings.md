# Findings & Research

## About Jillaine
- Tattoo artist based in **Kelowna, BC** at **District Ink Tattoo Studio** (1990 Landsdowne Pl #3)
- **8 years** of tattooing experience
- Specializes in **colour realism** — nature landscapes, northern lights, space, animals/pets, florals, underwater scenes
- One of the **top tattoo cover-up artists in the world**
- Won an award at **Calgary Tattoo and Arts Festival** (Canada's largest tattoo convention)
- Featured by **Inked Magazine**
- Raised on a farm in Alberta — deep love for nature inspires her work
- Uses **Fusion Ink** — vegan, body safe, high pigment load
- Green and blue hair — vibrant, warm, open-hearted personality
- Instagram: **@jillaine.tattoo**
- Current site: **jillaine.ca** (Squarespace)

## North Star
"A potential client feels connected to Jillaine's art and her as a person, feels awe and a connection with nature, and with her heart as a good person (rare in the industry) — and wants to book a session."

## Current Site Structure (jillaine.ca)
### Pages
1. **Homepage** — Gallery grid, specialties (Colour Realism + Cover-Ups), About section, testimonials
2. **Colour Realism Tattoos** — Gallery sections: Northern Lights, Nature/Landscape, Space, Animals/Pets, Black and Grey
3. **Cover-Up Tattoos** — Before/After gallery with descriptions
4. **FAQ** — 16 questions covering location, pricing, deposits, cancellation, aftercare, preparation
5. **After Care** — Detailed derm wrap instructions
6. **Contact/Booking** — Detailed booking form

### Current Contact Form Fields
| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Email | Email | Yes |
| Phone | Phone | Yes |
| Age | Text | Yes |
| Residing City | Text | Yes |
| Tattoo Type | Checkbox (Colour / Black and Grey) | Yes |
| Skin Type | Checkbox (Very Pale / Pale / Lightly Tanned / Tanned / Dark / Freckled / Scarred/Stretch Marks) | Yes |
| Reference Photos | File Upload (Max 6) | Optional |
| Location and size of tattoo | Text | Yes |
| Description of tattoo idea | Textarea | Yes |
| On-camera social media video | Checkbox (I'm interested / No thank you) | Optional |
| How did you find me? | Dropdown (includes AI/ChatGPT, Instagram, etc.) | Yes |

### Pre-form Warnings
- Only colour realism — no script, neo-trad, traditional, linework
- No pieces under 2 hours
- Review Instagram portfolio first
- Read FAQ before filling out form
- Allow up to 2 weeks for response

## Existing Testimonials
1. **Chelsea Turner** — Cover-up story about going from hiding her arm to flaunting it
2. **Jaimie Wilson** — Multiple projects including seascape sleeve, complete trust in Jillaine

## Design Direction
- **NOT** dark/grungy tattoo shop aesthetic
- Feel like a **gallery**, not a parlour
- Beautiful, approachable, bold, artistic, fun, vibrant
- Reflect her personality: green/blue hair, warm, open-hearted
- Target emotions: awe, trust, warmth, connection with nature
- Colour palette should echo: northern lights (teals, purples, greens), nature, vibrant life

## New Features Requested
- Homepage starts with **beautiful gallery** with category filter tabs (Nature, Cover-Ups, Space, Animals, Other)
- **Social media showcase** — Instagram/YouTube/TikTok videos with view counts
- **Reviews section**
- Contact form sends to email with photo attachments
- Thorough booking form (filter out non-serious inquiries)

## Technical Notes
- GitHub repo: https://github.com/samfox999git/jillaine-website
- Photos available locally and on Squarespace
- Booking requests → email delivery
- Framework: TBD (recommending Next.js or Vite)
- Deployment: TBD (recommending Vercel)
