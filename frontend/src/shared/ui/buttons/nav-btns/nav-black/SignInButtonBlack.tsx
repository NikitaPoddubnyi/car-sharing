import Link from 'next/link';

export function SignInButtonBlack() {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center bg-transparent px-4 py-3 w-24 h-11 rounded-sm border border-white text-white! text-sm hover:bg-white hover:text-black! hover:border-transparent transition"
    >
      Sign In
    </Link>
  );
}
