/* Игровая площадка темы: крутим ручки — внизу собирается готовый CSS. */
import { useEffect, useState } from 'react'
import {
  Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, Input, Label, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Slider, Switch, Tabs, TabsList, TabsTrigger,
  useTheme, ACCENTS, FONTS,
} from '@cloudplus/ui'
import { Moon, RotateCcw, Sun } from 'lucide-react'
import { CodeBlock, CopyButton } from './CodeBlock'

const DEFAULT_RADIUS = 0.625

export function Theming() {
  const { theme, setTheme, density, setDensity, accent, setAccent, font, setFont } = useTheme()
  const [radius, setRadius] = useState(DEFAULT_RADIUS)

  // --radius не проходит через ThemeProvider — это чистый CSS-токен.
  // Ставим его на <html> и обязательно снимаем при уходе со страницы,
  // иначе значение из площадки утекло бы на остальные разделы витрины.
  useEffect(() => {
    document.documentElement.style.setProperty('--radius', `${radius}rem`)
    return () => { document.documentElement.style.removeProperty('--radius') }
  }, [radius])

  const accentInfo = ACCENTS.find((a) => a.value === accent)

  const snippet = [
    '/* Тема приложения. Кладите рядом со своим Tailwind-энтрипоинтом. */',
    ':root {',
    `  --radius: ${radius}rem;`,
    '}',
    '',
    '/* Атрибуты ставит <ThemeProvider>: */',
    `/* <html data-theme="${theme}" data-density="${density}" data-accent="${accent}" data-font="${font}"> */`,
    '',
    '/* Либо задайте стартовые значения прямо в провайдере: */',
    '/*',
    '<ThemeProvider',
    `  defaultTheme="${theme}"`,
    `  defaultDensity="${density}"`,
    `  defaultAccent="${accent}"`,
    `  defaultFont="${font}"`,
    '>',
    '*/',
  ].join('\n')

  return (
    <div className="space-y-10">
      <section id="nastroyki" data-toc="Настройки" className="scroll-mt-20">
        <h3 className="mb-3 text-lg font-semibold tracking-tight">Настройки</h3>

        <div className="grid gap-6 rounded-lg border p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Тема</Label>
            <Tabs value={theme} onValueChange={(v: string) => setTheme(v as typeof theme)}>
              <TabsList className="w-full">
                <TabsTrigger value="light" className="flex-1"><Sun />Светлая</TabsTrigger>
                <TabsTrigger value="dark" className="flex-1"><Moon />Тёмная</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Плотность</Label>
            <Tabs value={density} onValueChange={(v: string) => setDensity(v as typeof density)}>
              <TabsList className="w-full">
                <TabsTrigger value="default" className="flex-1">Обычная</TabsTrigger>
                <TabsTrigger value="compact" className="flex-1">Плотная</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <Label>Акцент</Label>
              <span className="text-muted-foreground text-xs">
                {accentInfo?.label} · переопределяет <code className="font-mono">--primary</code>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAccent(a.value)}
                  title={a.label}
                  aria-label={`Акцент: ${a.label}`}
                  aria-pressed={accent === a.value}
                  style={{ background: a.color }}
                  className={
                    'size-7 rounded-full border transition-transform ' +
                    (accent === a.value ? 'ring-ring/60 scale-110 ring-2 ring-offset-2' : 'hover:scale-110')
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Шрифт</Label>
            <Select value={font} onValueChange={(v: string) => setFont(v as typeof font)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label>Скругление</Label>
              <span className="text-sm font-medium tabular-nums">{radius.toFixed(3)}rem</span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[radius]}
                onValueChange={([v]: number[]) => setRadius(v)}
                min={0}
                max={1.5}
                step={0.125}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Сбросить скругление"
                onClick={() => setRadius(DEFAULT_RADIUS)}
              >
                <RotateCcw />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="predprosmotr" data-toc="Предпросмотр" className="scroll-mt-20">
        <h3 className="mb-1 text-lg font-semibold tracking-tight">Предпросмотр</h3>
        <p className="text-muted-foreground mb-3 text-sm">
          Настоящие компоненты — так изменения выглядят в интерфейсе.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Новая сделка</CardTitle>
              <CardDescription>Заполните основные поля.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="th-name">Название</Label>
                <Input id="th-name" placeholder="Поставка оборудования" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="th-notify" defaultChecked />
                <Label htmlFor="th-notify">Уведомить ответственного</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="th-active" defaultChecked />
                <Label htmlFor="th-active">Активная</Label>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Создать</Button>
              <Button variant="outline">Отмена</Button>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Default</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Button size="sm" variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <Progress value={62} />
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Карточка на текущем скруглении</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Все радиусы выведены из одного токена — меняется вся библиотека сразу.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="css" data-toc="Готовый CSS" className="scroll-mt-20">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Готовый CSS</h3>
            <p className="text-muted-foreground mt-1 text-sm">Текущие настройки — можно копировать в проект.</p>
          </div>
          <CopyButton text={snippet} />
        </div>
        <CodeBlock code={snippet} lang="css" />
      </section>
    </div>
  )
}
