'use client';
import { ArrowUpRightIcon } from '@/components/arrow-up-right-icon';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isCurrentPage, links } from './navigation';

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    function onPointerDown(event: PointerEvent) {
      if (details?.open && !details.contains(event.target as Node)) details.removeAttribute('open');
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => { ref.current?.removeAttribute('open'); }, [pathname]);

  return <details className="mobile-menu" ref={ref} onToggle={event => setOpen(event.currentTarget.open)} onKeyDown={event => {
    if (event.key === 'Escape') {
      ref.current?.removeAttribute('open');
      ref.current?.querySelector('summary')?.focus();
    }
  }}>
    <summary aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>Меню <span aria-hidden="true">＋</span></summary>
    <nav aria-label="Мобильная навигация" onClick={event => {
      if ((event.target as HTMLElement).closest('a')) ref.current?.removeAttribute('open');
    }}>
      {links.map(({ label, href }) => <Link key={href} href={href} aria-current={isCurrentPage(pathname, href) ? 'page' : undefined}>{label}</Link>)}
      <Link className="mobile-menu-cta" href="/contacts">Обсудить проект <span aria-hidden="true"><ArrowUpRightIcon/></span></Link>
    </nav>
  </details>;
}
