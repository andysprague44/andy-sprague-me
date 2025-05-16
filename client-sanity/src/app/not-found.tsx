import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto min-h-screen max-w-2xl p-8 flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold">Sorry, this page could not be found.</h2>
      <p className="text-lg text-gray-600">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/" className="text-blue-600 hover:underline text-lg">
        ← Back to Home
      </Link>
    </main>
  );
}
