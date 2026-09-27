/* Подсветка кода в примерах.
   Используется мелкозернистая сборка shiki с JS-движком регулярок — без WASM
   и без загрузки всех грамматик: только tsx/css и две темы. */
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import tsx from 'shiki/langs/tsx.mjs'
import css from 'shiki/langs/css.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'

let instance: Promise<HighlighterCore> | null = null

function highlighter() {
  instance ??= createHighlighterCore({
    langs: [tsx, css],
    themes: [githubLight, githubDark],
    engine: createJavaScriptRegexEngine(),
  })
  return instance
}

export type CodeLang = 'tsx' | 'css'

/** Один и тот же сниппет подсвечивается один раз на тему. */
const cache = new Map<string, string>()

export async function highlight(code: string, lang: CodeLang, dark: boolean): Promise<string> {
  const key = `${dark ? 'd' : 'l'}:${lang}:${code}`
  const hit = cache.get(key)
  if (hit) return hit

  const hl = await highlighter()
  const html = hl.codeToHtml(code, {
    lang,
    theme: dark ? 'github-dark' : 'github-light',
  })
  cache.set(key, html)
  return html
}
