import Link from 'next/link';

export function RentCarHeaderBtn() {
  return (
    <Link
      href="/cars"
      className="flex items-center justify-center box-border bg-white px-4 py-3 w-36 h-13 rounded-sm border border-transparent text-black font-semibold text-xl hover:bg-transparent hover:text-white! hover:border-white transition"
    >
      Rent car
    </Link>
  );
}
