/**
 * Общий визуальный язык полей ввода: `Input`, `Textarea`, `SelectTrigger`.
 *
 * Зачем отдельный файл, а не строка в каждом компоненте: у стокового shadcn поля прозрачные,
 * с рамкой `oklch(0.922)` и кольцом фокуса `ring-[3px] ring-ring/50` серого `oklch(0.708)`.
 * На белой карточке диалога поле почти не видно, пока не встанешь в него, — а как встанешь,
 * вокруг вырастает толстый серый ореол. Владелец 26.08: «инпуты и их выделение страшноватые».
 *
 * Что поменяли: поле в покое залито (`bg-muted/40`) — видно границы, куда писать; на фокусе
 * заливка уходит в фон карточки, рамка темнеет до `--ring`, ореол остаётся, но тонкий
 * (`/15` вместо `/50`). Читается как переключение «поле активно», а не как подсветка ошибки.
 *
 * Расхождение со стоком намеренное. Пере-установка компонента официальным CLI
 * (`npx shadcn@latest add input`) эти классы затрёт — после неё вернуть отсюда.
 */

/** Покой и наведение. Размеры (высота, паддинги, шрифт) остаются за компонентом. */
export const fieldSurface =
  "rounded-md border border-input bg-muted shadow-none transition-[color,background-color,border-color,box-shadow] outline-none placeholder:text-muted-foreground/70 hover:border-ring/40 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/25 dark:hover:bg-input/35"

/** Фокус: заливка уходит, рамка темнеет, ореол тонкий. */
export const fieldFocus =
  "focus-visible:border-ring focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/15 dark:focus-visible:bg-input/40"

/** Ошибка: тот же тонкий ореол, но красный, — чтобы фокус и ошибка не спорили толщиной. */
export const fieldInvalid =
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/25"
