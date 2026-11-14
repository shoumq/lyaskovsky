import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import './experience.css';
import { Header, Footer } from '@/components/chrome';
import { siteUrl } from '@/content';
const manrope=Manrope({subsets:['latin','cyrillic'],display:'swap',variable:'--font-manrope'});
export const metadata: Metadata={metadataBase:new URL(siteUrl),title:{default:'LYASKOVSKY - IT-консалтинг и разработка ПО',template:'%s | LYASKOVSKY'},description:'IT-консалтинг, автоматизация и разработка программного обеспечения для бизнеса.',openGraph:{type:'website',locale:'ru_RU',siteName:'LYASKOVSKY',title:'LYASKOVSKY - заказная разработка программных систем',description:'IT-консалтинг и разработка программного обеспечения для бизнеса.'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" data-scroll-behavior="smooth" className={manrope.variable}><body><a className="skip-link" href="#main-content">К содержимому</a><Header/>{children}<Footer/></body></html>}
