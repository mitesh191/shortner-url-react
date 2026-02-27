export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-indigo-600">404</h1>
      <p className="text-gray-600 mt-4 text-lg">Page Not Found</p>
      <a
        href="/dashboard"
        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl"
      >
        Go to Dashboard
      </a>
    </div>
  );
}