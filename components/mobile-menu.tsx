'use client';
import { useRef } from 'react';
import Link from 'next/link';
const nav=[['Услуги','/services'],['Подход','/#approach'],['О компании','/about'],['Контакты','/contacts']];
export function MobileMenu(){const ref=useRef<HTMLDetailsElement>(null);return <details className="mobile-menu" ref={ref} onKeyDown={event=>{if(event.key==='Escape'){ref.current?.removeAttribute('open');ref.current?.querySelector('summary')?.focus()}}}><summary aria-label="Открыть меню">Меню <span aria-hidden="true">＋</span></summary><nav aria-label="Мобильная навигация" onClick={event=>{if((event.target as HTMLElement).closest('a'))ref.current?.removeAttribute('open')}}>{nav.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}<Link href="/contacts">Обсудить проект</Link></nav></details>}
