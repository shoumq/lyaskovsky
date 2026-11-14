import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services } from '@/content';
import { SystemDiagram } from '@/components/system-diagram';
import { ArrowLink, ContactBand, Label } from '@/components/chrome';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.slice(0, 4).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.slice(0, 4).find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.intro,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.slice(0, 4).find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main id="main-content">
      <section className="page-hero shell">
        <Label>НАПРАВЛЕНИЕ / {service.title.toUpperCase()}</Label>
        <h1>{service.title}</h1>
        <p>{service.intro}</p>
      </section>

      <section className="shell service-context service-visual-context">
        <div><Label>Суть задачи</Label><h2 className="service-context-title">{service.contextTitle}</h2><p>{service.context}</p></div>
        <SystemDiagram initialScenario={slug === 'system-integration' ? 2 : 0}/>
      </section>

      <section className="service-situations">
        <div className="shell editorial-grid">
          <Label>КОГДА ЭТО АКТУАЛЬНО</Label>
          <div>
            <h2 className="section-title">Типичные ситуации</h2>
            <div className="situation-list">
              {service.situations.map((situation, index) => (
                <div key={situation}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{situation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell service-detail section-pad">
        <div className="editorial-grid">
          <Label>ЧТО МЫ ДЕЛАЕМ</Label>
          <div>
            <h2 className="section-title">Работа с задачей целиком</h2>
            <p className="section-lead">Состав и глубина работ зависят от исходной ситуации. При этом каждый шаг должен давать понятную основу для следующего решения.</p>
            <div className="task-list">
              {service.tasks.map((task, index) => (
                <div key={task}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="editorial-grid service-outcome">
          <Label>РЕЗУЛЬТАТ</Label>
          <div>
            <p>{service.result}</p>
            <ArrowLink href="/contacts">Обсудить задачу</ArrowLink>
          </div>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
