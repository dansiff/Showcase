import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taqueria Y Birriera Morelia #2 | Authentic Mexican Birria & Tacos',
  description: 'Experience authentic Mexican birria, tacos, and traditional recipes. Order online for pickup. Family-owned taqueria serving the community with love.',
  keywords: ['birria', 'tacos', 'mexican food', 'taqueria', 'morelia', 'authentic mexican', 'quesabirria', 'consomé'],
  openGraph: {
    title: 'Taqueria Y Birriera Morelia #2',
    description: 'Authentic Mexican Birria & Tacos - Order Online',
    type: 'website',
  },
}

export default function MoreliaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
