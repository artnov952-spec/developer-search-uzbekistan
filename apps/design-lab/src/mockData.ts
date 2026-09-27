/* Демо-данные для CRM-стенда. Вымышленные, без реальных персональных данных. */

export type Stage = 'new' | 'qualify' | 'proposal' | 'won' | 'lost'

export interface Deal {
  id: string
  company: string
  contact: string
  owner: string
  amount: number
  stage: Stage
  updated: string // ISO
}

export interface Contact {
  id: string
  name: string
  email: string
  company: string
  role: string
  status: 'active' | 'lead' | 'churned'
}

export const stageLabels: Record<Stage, string> = {
  new: 'Новая',
  qualify: 'Квалификация',
  proposal: 'Предложение',
  won: 'Выиграна',
  lost: 'Проиграна',
}

export const stageVariant: Record<Stage, 'outline' | 'secondary' | 'default' | 'destructive'> = {
  new: 'outline',
  qualify: 'secondary',
  proposal: 'secondary',
  won: 'default',
  lost: 'destructive',
}

export const owners = ['Артём Логунов', 'Тагир Солиев', 'Бехруз Дамиров', 'Рустам Ким', 'Ольга Ветрова']

export const deals: Deal[] = [
  { id: 'd1', company: 'Green Middle Asia', contact: 'Дилшод Рахимов', owner: 'Артём Логунов', amount: 35000000, stage: 'won', updated: '2026-08-10T09:12:00Z' },
  { id: 'd2', company: 'YANGI DAVR MAHSULOTLARI', contact: 'Азиз Каримов', owner: 'Тагир Солиев', amount: 3600000, stage: 'proposal', updated: '2026-08-11T14:03:00Z' },
  { id: 'd3', company: 'UPMH', contact: 'Марат Юсупов', owner: 'Бехруз Дамиров', amount: 25000000, stage: 'qualify', updated: '2026-08-09T11:40:00Z' },
  { id: 'd4', company: 'Artel Electronics', contact: 'Санжар Ахмедов', owner: 'Артём Логунов', amount: 48000000, stage: 'new', updated: '2026-08-12T08:20:00Z' },
  { id: 'd5', company: 'Makro Retail', contact: 'Нигора Усманова', owner: 'Ольга Ветрова', amount: 12500000, stage: 'proposal', updated: '2026-08-08T16:55:00Z' },
  { id: 'd6', company: 'Korzinka', contact: 'Фаррух Низамов', owner: 'Рустам Ким', amount: 9800000, stage: 'qualify', updated: '2026-08-07T10:10:00Z' },
  { id: 'd7', company: 'Uzum Market', contact: 'Лола Шарипова', owner: 'Тагир Солиев', amount: 61000000, stage: 'new', updated: '2026-08-12T07:05:00Z' },
  { id: 'd8', company: 'Texnomart', contact: 'Бобур Салимов', owner: 'Бехруз Дамиров', amount: 7200000, stage: 'lost', updated: '2026-08-05T13:30:00Z' },
  { id: 'd9', company: 'Anor Bank', contact: 'Зухра Мирзаева', owner: 'Ольга Ветрова', amount: 54000000, stage: 'won', updated: '2026-08-11T18:44:00Z' },
  { id: 'd10', company: 'Humans', contact: 'Тимур Абдуллаев', owner: 'Артём Логунов', amount: 18300000, stage: 'proposal', updated: '2026-08-10T12:00:00Z' },
  { id: 'd11', company: 'Payme', contact: 'Гулноза Ирисбаева', owner: 'Рустам Ким', amount: 22000000, stage: 'qualify', updated: '2026-08-06T09:25:00Z' },
  { id: 'd12', company: 'Click', contact: 'Отабек Юлдашев', owner: 'Тагир Солиев', amount: 15600000, stage: 'new', updated: '2026-08-12T06:48:00Z' },
]

export const contacts: Contact[] = [
  { id: 'c1', name: 'Дилшод Рахимов', email: 'd.rahimov@gma.uz', company: 'Green Middle Asia', role: 'Директор', status: 'active' },
  { id: 'c2', name: 'Азиз Каримов', email: 'a.karimov@yangidavr.uz', company: 'YANGI DAVR', role: 'Гл. бухгалтер', status: 'active' },
  { id: 'c3', name: 'Марат Юсупов', email: 'm.yusupov@upmh.uz', company: 'UPMH', role: 'Руководитель IT', status: 'lead' },
  { id: 'c4', name: 'Санжар Ахмедов', email: 's.ahmedov@artel.uz', company: 'Artel', role: 'Коммерческий директор', status: 'lead' },
  { id: 'c5', name: 'Нигора Усманова', email: 'n.usmanova@makro.uz', company: 'Makro', role: 'Категорийный менеджер', status: 'active' },
  { id: 'c6', name: 'Бобур Салимов', email: 'b.salimov@texnomart.uz', company: 'Texnomart', role: 'Закупки', status: 'churned' },
]

export const accessPeople = [
  { id: 'u1', name: 'Артём Логунов', email: 'artem@cloudplus.uz', role: 'Владелец', isOwner: true },
  { id: 'u2', name: 'Тагир Солиев', email: 'tagir@cloudplus.uz', role: 'Редактор', isOwner: false },
  { id: 'u3', name: 'Бехруз Дамиров', email: 'behruz@cloudplus.uz', role: 'Редактор', isOwner: false },
  { id: 'u4', name: 'Ольга Ветрова', email: 'olga@cloudplus.uz', role: 'Читатель', isOwner: false },
]

export function formatSum(v: number): string {
  return new Intl.NumberFormat('ru-RU').format(v) + ' сум'
}
