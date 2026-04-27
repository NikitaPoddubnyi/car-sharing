'use client';
import { useAuth } from '@/entities/auth/stores/auth.store';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { AccountDropdownWhite, HostingDropdownWhite } from '@/shared/ui/nav/nav-white';
import { AuthApi } from '@/entities/auth/api/auth.api';
import { SignInButtonWhite, SignUpButtonWhite } from '@/shared/ui/buttons/nav-btns/nav-white';
import Image from 'next/image';

export default function NavWhite() {
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
    <nav className="w-full h-27! bg-white text-black border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-360 mx-auto! px-35! h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold animate-bounce hover:text-gray-600 transition-colors">
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
            <button className="group flex items-center space-x-2 text-black hover:text-gray-600 transition-colors">
              <span className="text-lg">Hosting</span>
              <ChevronDown
                size={16}
                className={`transition-all duration-200 group-hover:text-gray-600 ${
                  isHostingOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isHostingOpen && <HostingDropdownWhite />}
          </div>

          <Link
            href="/contact"
            className="text-lg text-black hover:text-gray-600! transition-colors"
          >
            Contact Us
          </Link>

          <div
            className="relative py-2"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
            ref={dropDownAccount}
          >
            <button className="group flex items-center space-x-2 text-black hover:text-gray-600 transition-colors">
              <span className="text-lg">Account</span>
              <ChevronDown
                size={16}
                className={`transition-all duration-200 group-hover:text-gray-600 ${
                  isAccountOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isAccountOpen && <AccountDropdownWhite onLogout={handleLogout} />}
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-lg text-black hover:text-gray-600! transition-colors"
            >
              {user.avatar ? (
                <Image
                  src={user.avatar.url}
                  alt={user.firstName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <User size={26} />
              )}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <SignInButtonWhite />
            <SignUpButtonWhite />
          </div>
        )}
      </div>
    </nav>
  );
}
