import Link from "next/link";

export default function TacoShowcaseButton() {
    return (
        <div className="flex justify-center mt-8">
            <Link
                href="/taco"
                className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-bold py-3 px-8 rounded-2xl shadow-lg transition duration-200"
            >
                See Querrepario Tacos!
            </Link>
        </div>
    );
}
