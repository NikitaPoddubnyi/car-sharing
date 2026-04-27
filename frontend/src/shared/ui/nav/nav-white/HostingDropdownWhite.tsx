import Link from 'next/link';

export function HostingDropdownWhite() {
  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-200">
      <Link
        href="/cars"
        className="block px-4! py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
      >
        Cars
      </Link>
      <Link
        href="/bikes"
        className="block px-4! py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
      >
        Bikes
      </Link>
    </div>
  );
}
