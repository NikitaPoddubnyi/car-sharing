import Link from 'next/link';

export function RentBikeHeaderBtn() {
  return (
    <Link
      href="/bikes"
      className="flex items-center justify-center bg-transparent px-4 py-3 w-36 h-13 rounded-sm border border-white text-white! text-xl hover:bg-white hover:text-black! hover:border-transparent transition"
    >
      Rent bike
    </Link>
  );
}
