import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to the MERN Assessment</h1>
      <Link href="/search?category=televisions" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg">
        Go to Product Search
      </Link>
    </div>
  );
}