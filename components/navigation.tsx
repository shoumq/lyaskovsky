'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const links = [
  { label: 'Услуги', href: '/services' },
  { label: 'Подход', href: '/#approach' },
  { label: 'О компании', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
];

export function isCurrentPage(pathname: string, href: string) {
  if (href === '/services') return pathname === href || pathname.startsWith('/services/');
  return pathname === href;
}

export function DesktopNav() {
  const pathname = usePathname();
  return <nav className="desktop-nav" aria-label="Основная навигация">
    {links.map(({ label, href }) => <Link key={href} href={href} aria-current={isCurrentPage(pathname, href) ? 'page' : undefined}>{label}</Link>)}
  </nav>;
}
