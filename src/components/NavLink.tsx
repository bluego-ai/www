'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );
}