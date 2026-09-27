import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bar, BarChart as RBarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  Button,
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  Field, FieldDescription, FieldError, FieldGroup, FieldLabel,
  Input,
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator,
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  toast,
} from '@cloudplus/ui'
import type { ChartConfig } from '@cloudplus/ui'
import { Building2, Home, Settings, Users } from 'lucide-react'
import { Demo } from './Demo'

/* ── Chart ─────────────────────────────────────────────── */

const chartData = [
  { month: 'Янв', won: 42, lost: 12 },
  { month: 'Фев', won: 58, lost: 18 },
  { month: 'Мар', won: 35, lost: 22 },
  { month: 'Апр', won: 71, lost: 15 },
  { month: 'Май', won: 64, lost: 20 },
  { month: 'Июн', won: 88, lost: 11 },
]

const chartConfig = {
  won: { label: 'Выиграно', color: 'var(--chart-1)' },
  lost: { label: 'Проиграно', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function AdvancedChart() {
  return (
    <div className="space-y-10">
      <Demo
        title="BarChart"
        description="Обёртка ChartContainer над Recharts: цвета берутся из токенов --chart-1…5, тултип и легенда уже стилизованы."
        block
        code={`const chartConfig = {
  won: { label: 'Выиграно', color: 'var(--chart-1)' },
  lost: { label: 'Проиграно', color: 'var(--chart-2)' },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="h-64 w-full">
  <RBarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="won" fill="var(--color-won)" radius={4} />
    <Bar dataKey="lost" fill="var(--color-lost)" radius={4} />
  </RBarChart>
</ChartContainer>`}
      >
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <RBarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="won" fill="var(--color-won)" radius={4} />
            <Bar dataKey="lost" fill="var(--color-lost)" radius={4} />
          </RBarChart>
        </ChartContainer>
      </Demo>

      <Demo
        title="LineChart"
        block
        code={`<ChartContainer config={chartConfig} className="h-64 w-full">
  <LineChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <Line dataKey="won" stroke="var(--color-won)" strokeWidth={2} dot={false} />
  </LineChart>
</ChartContainer>`}
      >
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <Line dataKey="won" stroke="var(--color-won)" strokeWidth={2} dot={false} />
            <Line dataKey="lost" stroke="var(--color-lost)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </Demo>
    </div>
  )
}

/* ── Form ──────────────────────────────────────────────── */

const dealSchema = z.object({
  company: z.string().min(2, 'Минимум 2 символа'),
  amount: z.string().min(1, 'Укажите сумму'),
  stage: z.string().min(1, 'Выберите стадию'),
})

type DealValues = z.infer<typeof dealSchema>

export function AdvancedForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DealValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: { company: '', amount: '', stage: '' },
  })

  const stage = watch('stage')

  const onSubmit = handleSubmit((values) => {
    toast.success('Сделка создана', { description: `${values.company} · ${values.amount} ₽` })
  })

  return (
    <Demo
      title="Форма с валидацией"
      description="react-hook-form + zod (обе зависимости уже в ките). Ошибки показываются через FieldError, поля помечаются aria-invalid."
      block
      code={`const dealSchema = z.object({
  company: z.string().min(2, 'Минимум 2 символа'),
  amount: z.string().min(1, 'Укажите сумму'),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(dealSchema),
})

<form onSubmit={handleSubmit(onSubmit)}>
  <Field data-invalid={!!errors.company}>
    <FieldLabel htmlFor="company">Компания</FieldLabel>
    <Input id="company" aria-invalid={!!errors.company} {...register('company')} />
    {errors.company && <FieldError>{errors.company.message}</FieldError>}
  </Field>
  <Button type="submit">Создать</Button>
</form>`}
    >
      <form onSubmit={onSubmit} className="max-w-sm">
        <FieldGroup>
          <Field data-invalid={!!errors.company}>
            <FieldLabel htmlFor="fm-company">Компания</FieldLabel>
            <Input id="fm-company" placeholder="ООО «Ромашка»" aria-invalid={!!errors.company} {...register('company')} />
            {errors.company ? (
              <FieldError>{errors.company.message}</FieldError>
            ) : (
              <FieldDescription>Как в реквизитах.</FieldDescription>
            )}
          </Field>

          <Field data-invalid={!!errors.amount}>
            <FieldLabel htmlFor="fm-amount">Сумма, ₽</FieldLabel>
            <Input id="fm-amount" placeholder="1 240 000" aria-invalid={!!errors.amount} {...register('amount')} />
            {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.stage}>
            <FieldLabel htmlFor="fm-stage">Стадия</FieldLabel>
            <Select value={stage} onValueChange={(v: string) => setValue('stage', v, { shouldValidate: true })}>
              <SelectTrigger id="fm-stage" aria-invalid={!!errors.stage}>
                <SelectValue placeholder="Выберите стадию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Новая</SelectItem>
                <SelectItem value="work">В работе</SelectItem>
                <SelectItem value="won">Выиграна</SelectItem>
              </SelectContent>
            </Select>
            {errors.stage && <FieldError>{errors.stage.message}</FieldError>}
          </Field>

          <Button type="submit" disabled={isSubmitting}>Создать сделку</Button>
        </FieldGroup>
      </form>
    </Demo>
  )
}

/* ── Sidebar и NavigationMenu ──────────────────────────── */

const navItems = [
  { icon: Home, label: 'Главная', badge: undefined },
  { icon: Building2, label: 'Компании', badge: '128' },
  { icon: Users, label: 'Контакты', badge: '42' },
  { icon: Settings, label: 'Настройки', badge: undefined },
]

export function AdvancedShell() {
  const [active, setActive] = useState('Компании')
  const [route, setRoute] = useState('Продажи / Сделки')

  return (
    <div className="space-y-10">
      <Demo
        title="Sidebar"
        description="Полноценная оболочка приложения от shadcn: сворачивание, горячая клавиша, состояние в cookie. Для плотного тёмного rail в CRM есть AppRail в надстройке."
        block
        code={`<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Cloudplus</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Разделы</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive><Building2 />Компании</SidebarMenuButton>
              <SidebarMenuBadge>128</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    …содержимое…
  </SidebarInset>
</SidebarProvider>`}
      >
        <div className="w-full overflow-hidden rounded-lg border">
          <SidebarProvider className="min-h-72">
            <Sidebar collapsible="icon" className="absolute">
              <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded text-xs font-semibold">
                    C
                  </span>
                  <span className="truncate text-sm font-semibold">Cloudplus</span>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Разделы</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map(({ icon: Icon, label, badge }) => (
                        <SidebarMenuItem key={label}>
                          <SidebarMenuButton
                            isActive={active === label}
                            onClick={() => setActive(label)}
                            tooltip={label}
                          >
                            <Icon />
                            <span>{label}</span>
                          </SidebarMenuButton>
                          {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <div className="text-muted-foreground px-2 py-1 text-xs">v1.0</div>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="flex h-12 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm font-medium">{active}</span>
              </header>
              <div className="text-muted-foreground p-4 text-sm">
                Содержимое раздела «{active}». Кнопка слева сворачивает панель до иконок.
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </Demo>

      <Demo
        title="NavigationMenu"
        description="Горизонтальное меню с раскрывающимися панелями — для верхней навигации продукта."
        block
        code={`<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Продажи</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/deals">Сделки</NavigationMenuLink>
        <NavigationMenuLink href="/funnel">Воронка</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
      >
        <div className="space-y-3">
          <NavigationMenu>
            <NavigationMenuList>
              {[
                { menu: 'Продажи', items: ['Сделки', 'Воронка', 'Прогноз'] },
                { menu: 'Клиенты', items: ['Компании', 'Контакты', 'Сегменты'] },
              ].map(({ menu, items }) => (
                <NavigationMenuItem key={menu}>
                  <NavigationMenuTrigger>{menu}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-64 gap-1 p-2">
                      {items.map((t) => (
                        <li key={t}>
                          <NavigationMenuLink
                            href="#app-shell"
                            className="rounded-md p-2 text-sm"
                            onClick={(e: React.MouseEvent) => { e.preventDefault(); setRoute(`${menu} / ${t}`) }}
                          >
                            {t}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#app-shell"
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); setRoute('Отчёты') }}
                >
                  Отчёты
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <p className="text-muted-foreground text-sm">
            Текущий раздел: <span className="text-foreground font-medium">{route}</span>
          </p>
        </div>
      </Demo>
    </div>
  )
}
