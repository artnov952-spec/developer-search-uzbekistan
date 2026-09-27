import { useEffect } from 'react'

/** Вешает глобальный Cmd/Ctrl+K. Используется вместе с shadcn CommandDialog. */
export function useCommandK(setOpen: (o: boolean) => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // `e.code` — физическая клавиша, не зависит от раскладки. `e.key` на кириллической
      // (ЙЦУКЕН) раскладке для той же клавиши даёт «л», а не «k»: проверка по `e.key`
      // не сработала бы для человека с русской раскладкой, и вместо окна открылся бы
      // встроенный поиск браузера.
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])
}
