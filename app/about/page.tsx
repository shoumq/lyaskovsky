import type { Metadata } from 'next';
import { ContactBand, Label } from '@/components/chrome';
import { DeliveryJourney } from '@/components/delivery-journey';

export const metadata: Metadata = {
  title: 'О компании',
  description: 'LYASKOVSKY помогает бизнесу принимать обоснованные технологические решения и внедрять программные системы.',
  alternates: { canonical: '/about' },
};

const principles = [
  {
    title: 'Сначала задача',
    text: 'Определяем, что именно нужно изменить в работе бизнеса. Технологию выбираем после анализа процесса, пользователей и ограничений.',
  },
  {
    title: 'Понятные основания',
    text: 'Объясняем варианты решения, их последствия и зависимости. Это помогает руководству принимать решения без опоры на технические обещания.',
  },
  {
    title: 'Развитие после запуска',
    text: 'Учитываем, кто будет пользоваться системой, как она связана с другими инструментами и какие изменения могут понадобиться позже.',
  },
];

export default function About() {
  return (
    <main id="main-content">
      <section className="page-hero shell">
        <Label>О КОМПАНИИ</Label>
        <h1>Системный взгляд на технологии.</h1>
        <p>LYASKOVSKY - IT-консалтинг и разработка программного обеспечения для бизнеса.</p>
      </section>

      <section className="section-pad shell editorial-grid about-position">
        <Label>НАША ПОЗИЦИЯ</Label>
        <div>
          <h2 className="statement">Технология полезна, когда решает конкретную бизнес-задачу.</h2>
          <div className="body-column prose-stack">
            <p>Поэтому мы начинаем с понимания процессов, ограничений и целей компании. Затем выбираем подход, проектируем решение и сопровождаем его развитие.</p>
            <p>В проекте одинаково важны управленческий смысл и качество исполнения. Если новая система не вписывается в повседневную работу или создаёт лишнюю сложность, её технические возможности сами по себе не принесут пользы.</p>
          </div>
        </div>
      </section>

      <section className="section-pad about-principles">
        <div className="shell editorial-grid">
          <Label>НА ЧТО ОПИРАЕМСЯ</Label>
          <div>
            <h2 className="section-title">Принципы работы</h2>
            <div className="principle-list">
              {principles.map((principle, index) => (
                <div className="principle-row" key={principle.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad about-process">
        <div className="shell"><div className="section-intro"><div><Label>Как устроен проект</Label><h2>У каждого этапа<br/>есть результат.</h2></div><p>Выберите этап: от исследования текущей ситуации до развития внедрённой системы.</p></div><DeliveryJourney/></div>
      </section>
      <ContactBand />
    </main>
  );
}
