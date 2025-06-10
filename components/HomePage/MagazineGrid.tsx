type Article = {
    id: string | number
    cover: string
    title: string
    summary: string
    link: string
}

type MagazineGridProps = {
    articles: Article[]
}
export default function MagazineGrid({ articles }: MagazineGridProps) {
    return (
        <section className="p-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article.id} className="rounded-xl bg-white p-6 shadow">
                        <img src={article.cover} className="h-32 w-full object-cover mb-4 rounded" />
                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                        <p className="text-gray-700">{article.summary}</p>
                        <a href={article.link} className="text-blue-600 mt-4 inline-block">Read More →</a>
                    </div>
                ))}
            </div>
        </section>
    )
}
