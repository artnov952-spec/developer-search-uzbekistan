import { useEffect, useState } from 'react'
import { Button, useTheme } from '@cloudplus/ui'
import { Check, Copy } from 'lucide-react'
import { highlight, type CodeLang } from './highlight'

export function CopyButton({ text, label = 'Копировать' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`${label} код`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? 'Скопировано' : label}
    </Button>
  )
}

export function CodeBlock({
  code, lang = 'tsx', className,
}: { code: string; lang?: CodeLang; className?: string }) {
  const { theme } = useTheme()
  const [html, setHtml] = useState<string | null>(null)
  const trimmed = code.trim()

  useEffect(() => {
    let alive = true
    highlight(trimmed, lang, theme === 'dark').then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [trimmed, lang, theme])

  // До готовности подсветки показываем тот же текст без цвета — без скачка раскладки.
  const shell = `bg-muted/40 overflow-x-auto rounded-lg border p-4 font-mono text-[13px] leading-relaxed ${className ?? ''}`

  if (!html) {
    return <pre className={shell}><code>{trimmed}</code></pre>
  }

  return (
    <div
      className={`${shell} [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
