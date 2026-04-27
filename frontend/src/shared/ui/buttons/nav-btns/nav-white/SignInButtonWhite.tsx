import Link from 'next/link';

export function SignInButtonWhite() {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center bg-transparent px-4 py-3 w-24 h-11 rounded-sm border border-black text-black text-sm hover:bg-black hover:text-white! hover:border-transparent transition"
    >
      Sign In
    </Link>
  );
}
