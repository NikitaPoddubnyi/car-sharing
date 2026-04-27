import Link from 'next/link';
import { User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/entities/auth/stores/auth.store';

interface AccountDropdownProps {
  onLogout: () => void;
}

export function AccountDropdownWhite({ onLogout }: AccountDropdownProps) {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return (
      <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4! py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
        >
          <LogIn size={16} className="text-gray-400" />
          <span>Login</span>
        </Link>
      </div>
    );
  }
  return (
    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
      <Link
        href="/profile"
        className="flex items-center gap-3 px-4! py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
      >
        <User size={16} className="text-gray-400" />
        <span>Profile</span>
      </Link>

      <div className="border-t border-gray-50 my-1" />

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4! py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}
