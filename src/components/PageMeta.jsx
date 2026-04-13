import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.jillaine.ca'
const DEFAULT_IMAGE = `${BASE_URL}/images/og-preview.jpg`

export default function PageMeta({ title, description, path = '' }) {
  const fullTitle = `${title} | Jillaine Tattoo`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Helmet>
  )
}
