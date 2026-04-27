import Link from 'next/link';
import { User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/entities/auth/stores/auth.store';

interface AccountDropdownProps {
  onLogout: () => void;
}

export function AccountDropdownBlack({ onLogout }: AccountDropdownProps) {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return (
      <div className="absolute top-full right-0 mt-2 w-52 bg-black rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-150">
        <Link
          href="/login"
          className="group flex items-center gap-3 px-4! py-2 text-sm hover:text-gray-600! hover:bg-white transition-colors"
        >
          <LogIn size={16} className="text-white group-hover:text-gray-600! transition-colors" />
          <span>Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-52 bg-black rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-150">
      <Link
        href="/profile"
        className="group flex items-center gap-3 px-4! py-2 text-sm hover:text-gray-600! hover:bg-white transition-colors"
      >
        <User size={16} className="text-white group-hover:text-gray-600! transition-colors" />
        <span>Profile</span>
      </Link>

      <div className="border-t border-gray-800 my-1" />

      <button
        onClick={onLogout}
        className="group w-full flex items-center gap-3 px-4! py-2 text-sm text-red-500 hover:bg-red-950! transition-colors"
      >
        <LogOut size={16} className="text-red-500 transition-colors" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
