import Link from 'next/link';

export function SignUpButtonBlack() {
  return (
    <Link
      href="/register"
      className="flex items-center justify-center box-border bg-white px-4 py-3 w-25 h-11 rounded-sm border border-transparent text-black! font-semibold text-sm hover:bg-transparent hover:text-white! hover:border-white transition"
    >
      Sign Up
    </Link>
  );
}
