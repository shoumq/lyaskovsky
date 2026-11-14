'use client';
import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { services } from '@/content';

type Fields={name:string;company:string;email:string;phone:string;service:string;message:string;consent:boolean;website:string};
const initial:Fields={name:'',company:'',email:'',phone:'',service:'',message:'',consent:false,website:''};
function conversion(event:string){window.dispatchEvent(new CustomEvent('lyaskovsky:conversion',{detail:{event}}))}
export function ContactForm({initialService=''}:{initialService?:string}){
  const [fields,setFields]=useState<Fields>({...initial,service:initialService});
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [serverMessage,setServerMessage]=useState('');
  const [additional,setAdditional]=useState(Boolean(initialService));
  const formRef=useRef<HTMLFormElement>(null);
  const sending=useRef(false);
  function change<K extends keyof Fields>(key:K,value:Fields[K]){setFields(prev=>({...prev,[key]:value}));setErrors(prev=>({...prev,[key]:''}));if(status==='error')setStatus('idle')}
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(sending.current)return;
    const next:Record<string,string>={};
    if(fields.name.trim().length<2||fields.name.length>120)next.name='Укажите имя (не менее 2 символов).';
    if(fields.company.length>180)next.company='Название компании не должно превышать 180 символов.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||fields.email.length>254)next.email='Укажите корректный email.';
    if(fields.phone&&!/^[+\d\s()\-]{7,25}$/.test(fields.phone))next.phone='Проверьте номер телефона.';
    if(fields.message.trim().length<20)next.message='Опишите задачу не менее чем в 20 символах.';
    if(fields.message.length>5000)next.message='Сократите описание до 5000 символов.';
    if(!fields.consent)next.consent='Подтвердите согласие на обработку данных.';
    setErrors(next);
    if(Object.keys(next).length){if(next.company||next.phone)setAdditional(true);requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return}
    sending.current=true;setStatus('sending');conversion('inquiry_submitted');
    try{const response=await fetch('/api/v1/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fields)});const data=await response.json().catch(()=>({}));if(response.status!==201||typeof data.id!=='string'){throw new Error(typeof data.error==='string'?data.error:'Не удалось отправить сообщение. Попробуйте ещё раз.')}setStatus('success');setFields(initial);conversion('inquiry_saved')}
    catch(error){setServerMessage(error instanceof Error?error.message:'Не удалось отправить сообщение.');setStatus('error')}
    finally{sending.current=false}
  }
  if(status==='success')return <div className="form-success" role="status" tabIndex={-1} ref={node=>node?.focus()}><span>✓</span><h2>Сообщение отправлено.</h2><p>Ваше обращение сохранено. Мы свяжемся с вами по указанному адресу.</p><button type="button" onClick={()=>setStatus('idle')}>Отправить ещё одно сообщение ↗</button></div>;
  return <form ref={formRef} className="contact-form" onSubmit={submit} noValidate aria-busy={status==='sending'}><div className="form-heading"><span className="section-label">Первый шаг</span><h2>Что вы хотите изменить?</h2><p>Достаточно нескольких предложений. Поля с * обязательны.</p></div><div className="form-grid"><Field id="name" label="Имя *" value={fields.name} onChange={v=>change('name',v)} error={errors.name} autoComplete="name" maxLength={120}/><Field id="email" label="Email *" type="email" value={fields.email} onChange={v=>change('email',v)} error={errors.email} autoComplete="email" maxLength={254}/></div><div className="form-field"><label htmlFor="message">Описание задачи *</label><textarea id="message" rows={5} value={fields.message} onChange={e=>change('message',e.target.value)} maxLength={5000} placeholder="Какой процесс или продукт нужен? Что сейчас мешает работе?" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?'message-error':'message-hint'} required/>{errors.message?<span className="field-error" id="message-error">{errors.message}</span>:<span id="message-hint" className="form-hint">От 20 до 5000 символов. Без конфиденциальных данных.</span>}</div>
    <details className="form-additional" open={additional} onToggle={e=>setAdditional(e.currentTarget.open)}><summary>Дополнительные сведения <span>Необязательно</span></summary><div className="form-grid"><Field id="company" label="Компания" value={fields.company} onChange={v=>change('company',v)} error={errors.company} autoComplete="organization" maxLength={180}/><Field id="phone" label="Телефон" type="tel" value={fields.phone} onChange={v=>change('phone',v)} error={errors.phone} autoComplete="tel" maxLength={25}/></div><div className="form-field"><label htmlFor="service">Интересующая услуга</label><select id="service" value={fields.service} onChange={e=>change('service',e.target.value)}><option value="">Помогите определить направление</option>{services.map(s=><option value={s.title} key={s.slug}>{s.title}</option>)}</select></div></details>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Сайт</label><input id="website" value={fields.website} onChange={e=>change('website',e.target.value)} tabIndex={-1} autoComplete="off"/></div><div className="consent-wrap"><label className="consent"><input type="checkbox" checked={fields.consent} onChange={e=>change('consent',e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent?'consent-error':undefined} required/><span>Я согласен(на) на обработку персональных данных в соответствии с <Link href="/privacy" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</Link>.</span></label>{errors.consent&&<span className="field-error" id="consent-error">{errors.consent}</span>}</div>{status==='error'&&<p role="alert" className="submit-error">{serverMessage}</p>}<button className="button-dark submit-button" type="submit" disabled={status==='sending'}>{status==='sending'?'Отправляем…':'Отправить сообщение'} <span aria-hidden="true">↗</span></button><p className="form-hint form-submit-note">Сначала обсудим задачу. Оценка объёма и условий - после уточнения деталей.</p></form>;
}
function Field({id,label,value,onChange,error,type='text',autoComplete,maxLength}:{id:string;label:string;value:string;onChange:(v:string)=>void;error?:string;type?:string;autoComplete:string;maxLength:number}){return <div className="form-field"><label htmlFor={id}>{label}</label><input id={id} type={type} value={value} onChange={e=>onChange(e.target.value)} autoComplete={autoComplete} maxLength={maxLength} required={id==='name'||id==='email'} aria-invalid={Boolean(error)} aria-describedby={error?`${id}-error`:undefined}/>{error&&<span className="field-error" id={`${id}-error`}>{error}</span>}</div>}
