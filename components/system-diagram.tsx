'use client';

import { useState } from 'react';
import Image from 'next/image';

const nodes = [
  {icon:'panels-top-left',name:'Приложения', tag:'Web / Mobile', x:7,y:9, title:'Точка входа для пользователя', text:'Личный кабинет, рабочее место сотрудника или клиентское приложение. Интерфейс отражает роли и реальные сценарии работы.'},
  {icon:'network',name:'API Gateway', tag:'Доступ и маршрутизация', x:57,y:9,title:'Единый вход в систему',text:'Проверяет доступ и направляет запрос к нужному сервису. Внутренняя структура системы остаётся отделена от клиентских приложений.'},
  {icon:'workflow',name:'Бизнес-логика', tag:'Backend services', x:57,y:39,title:'Правила вашего бизнеса',text:'Обрабатывает операции и согласования. Границы сервисов определяются задачей: распределённая архитектура нужна не каждому продукту.'},
  {icon:'bot',name:'AI-модуль',tag:'Поиск / обработка',x:7,y:39,title:'AI с проверяемым результатом',text:'Получает только необходимые данные, обрабатывает документы или запросы. Для критичных решений предусматривается проверка человеком.'},
  {icon:'database',name:'База данных',tag:'Хранение и целостность',x:7,y:69,title:'Надёжная основа операций',text:'Хранит состояние системы. Транзакции, правила доступа и резервное копирование учитываются при проектировании.'},
  {icon:'arrow-right-left',name:'Очередь событий',tag:'Асинхронный обмен',x:57,y:69,title:'Связь без жёсткой зависимости',text:'Передаёт события фоновым обработчикам и внешним системам. Повторные попытки и защита от дублей помогают переживать временные сбои.'},
];
const scenarios = [
  {name:'Платформа', route:'M140 82H420V208L140 334H420', nodes:[0,1,2,4,5], text:'Пользователь создаёт заявку. Сервис проверяет правила, сохраняет её и передаёт событие в очередь.'},
  {name:'AI-процесс', route:'M140 82H420V208H140V334',nodes:[0,1,2,3,4],text:'Запрос проходит проверку доступа. AI-модуль получает разрешённый контекст, результат возвращается в рабочий процесс.'},
  {name:'Интеграция', route:'M140 82H420V208L140 334H420',nodes:[0,1,2,4,5],text:'Изменение фиксируется в системе. Событие уходит в очередь для обмена с внешним сервисом без ожидания в интерфейсе.'},
];
export function SystemDiagram({initialScenario=0}:{initialScenario?:number}) {
  const [scenario,setScenario]=useState(initialScenario);
  const [active,setActive]=useState(2);
  const [pulse,setPulse]=useState(0);
  const selected=scenarios[scenario];
  return <div className="architecture">
    <div className="architecture-top"><span className="architecture-mark" aria-hidden="true">⌁</span><span>Система в разрезе</span><span className="architecture-note">Пример архитектуры</span></div>
    <div className="architecture-switch" role="group" aria-label="Сценарий архитектуры">{scenarios.map((item,i)=><button type="button" key={item.name} aria-pressed={scenario===i} onClick={()=>{setScenario(i);setActive(i===1?3:i===2?5:2);setPulse(p=>p+1)}}>{item.name}</button>)}</div>
    <div className="architecture-map">
      <svg viewBox="0 0 560 420" aria-hidden="true" preserveAspectRatio="none"><path className="map-link" d="M140 82H420V334H140V82M140 208H420M140 334L420 208"/><path key={`${scenario}-${pulse}`} className="map-route" d={selected.route}/><circle cx="280" cy="82" r="3" className="map-junction"/><circle cx="420" cy="270" r="3" className="map-junction"/></svg>
      {nodes.map((node,i)=><button type="button" key={node.name} className={`architecture-node ${selected.nodes.includes(i)?'on-route':''}`} style={{left:`${node.x}%`,top:`${node.y}%`}} aria-pressed={active===i} aria-controls="architecture-detail" onClick={()=>setActive(i)}><Image className="node-symbol" src={`/icons/${node.icon}.svg`} alt="" width={21} height={21}/><strong>{node.name}</strong><small>{node.tag}</small></button>)}
      <span className="map-boundary">Контур приложения / доступ по ролям</span>
    </div>
    <div className="architecture-explain" id="architecture-detail" aria-live="polite"><span className="detail-pin"/><div><h3>{nodes[active].title}</h3><p>{nodes[active].text}</p></div></div>
    <div className="architecture-scenario"><button type="button" aria-label="Повторить поток данных" onClick={()=>setPulse(p=>p+1)}>↻</button><p>{selected.text}</p></div>
  </div>;
}
