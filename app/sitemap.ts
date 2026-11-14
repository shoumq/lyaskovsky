import type { MetadataRoute } from 'next';
import { siteUrl, services } from '@/content';
export default function sitemap():MetadataRoute.Sitemap{return ['','/services','/about','/contacts','/privacy',...services.slice(0,4).map(s=>`/services/${s.slug}`)].map(path=>({url:`${siteUrl}${path}`,lastModified:new Date()}))}
