import Link from 'next/link';

export function HostingDropdownBlack() {
  return (
    <div className="absolute top-full right-0 z-2 mt-2 w-48 bg-black rounded-md shadow-lg py-2">
      <Link
        href="cars"
        className="block px-4! py-2 text-sm text-white hover:bg-white hover:text-gray-600!"
      >
        Cars
      </Link>
      <Link
        href="bikes"
        className="block px-4! py-2 text-sm text-white hover:bg-white hover:text-gray-600!"
      >
        Bikes
      </Link>
    </div>
  );
}
