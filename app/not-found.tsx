import { ArrowUpRightIcon } from '@/components/arrow-up-right-icon';
import Link from 'next/link';
export default function NotFound(){return <main id="main-content" className="shell not-found"><span>404</span><h1>Страница не найдена.</h1><p>Возможно, адрес изменился или страница была удалена.</p><Link className="button-dark" href="/">На главную <ArrowUpRightIcon/></Link></main>}
