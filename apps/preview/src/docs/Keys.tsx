import { Kbd, KbdGroup } from '@cloudplus/ui'
import { slugify } from './Demo'

export type KeyRow = [keys: string[], description: string]

/** Клавиатурная модель компонента. Она приходит от Radix и работает
 *  без дополнительной настройки — здесь просто описано, что именно работает. */
export function Keys({ title = 'Клавиши', rows }: { title?: string; rows: KeyRow[] }) {
  return (
    <section id={slugify(title)} data-toc={title} className="scroll-mt-20">
      <h3 className="mb-1 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mb-3 text-sm">
        Обеспечивается Radix — отдельно подключать ничего не нужно.
      </p>
      <div className="divide-y rounded-lg border">
        {rows.map(([keys, description]) => (
          <div key={keys.join('+')} className="flex items-center gap-4 px-4 py-2.5">
            <KbdGroup className="shrink-0">
              {keys.map((k) => <Kbd key={k}>{k}</Kbd>)}
            </KbdGroup>
            <span className="text-muted-foreground text-sm">{description}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
