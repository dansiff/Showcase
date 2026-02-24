import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taqueria Y Birriera Morelia #2 – Authentic Mexican Birria in Chicago | Tacos, Quesabirria, Family Recipes',
  description: 'Discover Taqueria Y Birriera Morelia #2 in Chicago for authentic Mexican birria de chivo (goat), tacos, quesabirria, and traditional family recipes. Dine in, order online, or visit us for the best birria in Chicago. Family-owned and operated.',
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
