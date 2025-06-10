type Product = {
    id: string | number
    name: string
    image: string
    price: number
}

type EcomShowcaseProps = {
    products: Product[]
}
export default function EcomShowcase({ products }: EcomShowcaseProps) {
    return (
        <section className="p-8">
            <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="border rounded-xl p-4 flex flex-col items-center">
                        <img src={product.image} className="w-32 h-32 object-cover mb-3" />
                        <h3 className="font-medium">{product.name}</h3>
                        <p>${product.price}</p>
                        <button className="mt-2 px-4 py-2 bg-black text-white rounded">Buy</button>
                    </div>
                ))}
            </div>
        </section>
    )
}
