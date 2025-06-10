
export const metadata = {
    title: "Home Catalog",
    description: "Catalog of different styles",
};

import HomePage from "@/components/HomePage/Homepage";


export default function Home() {
    // Example data for the 'ecom' style
    const homePageProps = {
        style: "ecom" as const,
        data: {
            products: [
                { id: 1, name: "Product 1", image: "/images/product1.jpg", price: 29.99 },
                { id: 2, name: "Product 2", image: "/images/product2.jpg", price: 49.99 },
                { id: 3, name: "Product 3", image: "/images/product3.jpg", price: 19.99 },
            ],
        },
    };


    return (
        <>
            <HomePage {...homePageProps} />
            
        </>
    );
}



