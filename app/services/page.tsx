import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/content';
import { SolutionFinder } from '@/components/solution-finder';
import { ContactBand, Label } from '@/components/chrome';

export const metadata: Metadata = {
  title: 'Услуги',
  description: 'IT-консалтинг, заказная разработка ПО, автоматизация бизнес-процессов и системная интеграция.',
  alternates: { canonical: '/services' },
};

export default function Services() {
  return (
    <main id="main-content">
      <section className="page-hero shell">
        <Label>НАПРАВЛЕНИЯ РАБОТЫ</Label>
        <h1>Технологические решения начинаются с понимания задачи.</h1>
        <p>От независимой оценки текущих систем до разработки, внедрения и сопровождения программного обеспечения.</p>
      </section>
      <section className="shell services-selector"><h2 className="section-title">Начните с вашей задачи</h2><SolutionFinder/></section>
      <section className="shell page-list" aria-label="Услуги LYASKOVSKY">
        {services.map((service, i) => (
          <article className="detail-row" key={service.slug}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.short}</p>
              <p className="detail-more">{service.detail}</p>
            </div>
            {i < 4 ? (
              <Link href={`/services/${service.slug}`} aria-label={`Подробнее: ${service.title}`}>Подробнее ↗</Link>
            ) : (
              <Link href="/contacts" aria-label={`Обсудить: ${service.title}`}>Обсудить ↗</Link>
            )}
          </article>
        ))}
      </section>
      <ContactBand />
    </main>
  );
}
