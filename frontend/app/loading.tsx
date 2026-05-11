export default function GlobalLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white!">
      <div className="text-center">
        <div className="text-3xl">Loading...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto! mt-4!" />
      </div>
    </main>
  );
}
