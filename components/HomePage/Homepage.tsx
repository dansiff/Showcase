import HeroClassic from './HeroClassic'
import HeroMinimal from './HeroMinimal'
import EcomShowcase from './EcomShowcase'
import MagazineGrid from './MagazineGrid'

type HomePageProps =
    | { style: 'classic'; data: { title: string; subtitle: string; ctaText: string; heroImage: string } }
    | { style: 'minimal'; data: { title: string; tagline: string } }
    | { style: 'ecom'; data: { products: { id: string | number; name: string; image: string; price: number }[] } }
    | { style: 'magazine'; data: { articles: { id: string | number; cover: string; title: string; summary: string; link: string }[] } }

export default function HomePage(props: HomePageProps) {
    switch (props.style) {
        case 'classic':
            return <HeroClassic {...props.data} />
        case 'minimal':
            return <HeroMinimal {...props.data} />
        case 'ecom':
            return <EcomShowcase {...props.data} />
        case 'magazine':
            return <MagazineGrid {...props.data} />
        default:
            return <div>Choose a style!</div>
    }
}
