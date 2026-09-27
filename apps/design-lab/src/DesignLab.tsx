import { useState } from 'react'
import { TooltipProvider, Toaster } from '@cloudplus/ui'
import { CrmDemo } from './CrmDemo'
import { Companies } from './Companies'
import { CompanyCard } from './CompanyCard'
import { Icons } from './Icons'
import './designlab.css'

type SectionId = 'crm' | 'companies' | 'company' | 'icons'

const sections: { id: SectionId; label: string }[] = [
  { id: 'crm', label: 'Demo-экран CRM' },
  { id: 'companies', label: 'Компании (Cloudplus CRM)' },
  { id: 'company', label: 'Карточка компании' },
  { id: 'icons', label: 'Иконки (100)' },
]

function initialSection(): SectionId {
  const s = new URLSearchParams(window.location.search).get('section')
  return s === 'crm' || s === 'companies' || s === 'company' || s === 'icons' ? s : 'crm'
}

function Chrome() {
  const [section, setSection] = useState<SectionId>(initialSection)
  return (
    <div className="dl-root">
      <nav className="dl-nav">
        <span className="dl-nav__brand">Cloudplus Design Lab</span>
        {sections.map((s) => (
          <button
            key={s.id}
            className="dl-nav__item"
            aria-current={section === s.id}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <div className="dl-content">
        {section === 'crm' && <CrmDemo />}
        {section === 'companies' && <Companies />}
        {section === 'company' && <CompanyCard />}
        {section === 'icons' && <Icons />}
      </div>
    </div>
  )
}

export function DesignLab() {
  return (
    <TooltipProvider>
      <Chrome />
      <Toaster />
    </TooltipProvider>
  )
}
