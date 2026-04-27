'use client';

import { AuthApi } from '@/entities/auth/api/auth.api';
import { useAuth } from '@/entities/auth/stores/auth.store';
import { SignInButtonBlack, SignUpButtonBlack } from '@/shared/ui/buttons/nav-btns/nav-black';
import { AccountDropdownBlack, HostingDropdownBlack } from '@/shared/ui/nav/nav-black';
import { ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function NavBlack() {
  const [isHostingOpen, setIsHostingOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropDownHosting = useRef<HTMLDivElement>(null);
  const dropDownAccount = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    AuthApi.logout();
    logout();
  };

  return (
    <nav className="w-full h-27 bg-black text-white backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-360 mx-auto! px-35! h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold hover:text-gray-300 transition animate-bounce">
              Drivee
            </span>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
          <div
            className="relative py-2"
            onMouseEnter={() => setIsHostingOpen(true)}
            onMouseLeave={() => setIsHostingOpen(false)}
            ref={dropDownHosting}
          >
            <button className="group flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
              <span className="text-lg">Hosting</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isHostingOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isHostingOpen && <HostingDropdownBlack />}
          </div>

          <Link href="/contact" className="text-lg text-white hover:text-gray-300! transition">
            Contact Us
          </Link>

          <div
            className="relative py-2"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
            ref={dropDownAccount}
          >
            <button className="group flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
              <span className="text-lg">Account</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isAccountOpen && <AccountDropdownBlack onLogout={handleLogout} />}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <Link href="/profile" className="text-lg text-white hover:text-gray-300! transition">
              {user.avatar ? (
                <Image
                  src={user.avatar.url}
                  alt="avatar"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <User size={26} className="text-white hover:text-gray-300!" />
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButtonBlack />
              <SignUpButtonBlack />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
