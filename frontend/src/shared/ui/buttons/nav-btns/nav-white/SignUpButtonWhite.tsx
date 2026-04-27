import Link from 'next/link';

export function SignUpButtonWhite() {
  return (
    <Link
      href="/register"
      className="flex items-center justify-center px-4 py-3 w-25 h-11 rounded-sm border border-black bg-black text-white! font-semibold text-sm hover:bg-white hover:text-black! hover:border-black transition"
    >
      Sign Up
    </Link>
  );
}
