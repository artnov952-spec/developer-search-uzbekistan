import {
  AppNav, AppNavGroup, AppNavItem, AppRail, AppRailItem,
  Avatar, AvatarFallback, Badge, Button, Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle, Progress, Separator, useTheme,
} from '@cloudplus/ui'
import {
  Bell, BriefcaseBusiness, Building2, Check, Code2, LayoutDashboard,
  MessageSquare, Plus, Search, Settings, Sparkles, Users,
} from 'lucide-react'

const teams = [
  { name: 'Northstack', focus: 'Fintech · React · Node.js', rating: '4,9', fit: 96 },
  { name: 'Pulse Lab', focus: 'B2B SaaS · Design system', rating: '4,8', fit: 91 },
  { name: 'Kite Studio', focus: 'Marketplace · Mobile', rating: '4,7', fit: 87 },
]

export function DevelopmentBrand() {
  const { brand, setBrand } = useTheme()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
        <div>
          <p className="font-semibold">Профиль «Разработка»</p>
          <p className="text-sm text-muted-foreground">Deep Blue + Sky, Onest, крупные радиусы и белые рабочие поверхности.</p>
        </div>
        <Button variant={brand === 'development' ? 'secondary' : 'default'} onClick={() => setBrand(brand === 'development' ? 'default' : 'development')}>
          <Sparkles />{brand === 'development' ? 'Вернуть базовую тему' : 'Включить бренд-профиль'}
        </Button>
      </div>

      <div data-brand="development" data-theme="light" className="overflow-hidden rounded-3xl border bg-background text-foreground shadow-sm">
        <div className="flex min-h-[720px]">
          <AppRail
            top={<div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Code2 className="size-5" /></div>}
            bottom={<><AppRailItem icon={<Bell />} label="Уведомления" /><AppRailItem icon={<Settings />} label="Настройки" /></>}
          >
            <AppRailItem icon={<LayoutDashboard />} label="Обзор" />
            <AppRailItem icon={<BriefcaseBusiness />} label="Проекты" active />
            <AppRailItem icon={<Users />} label="Команды" />
            <AppRailItem icon={<MessageSquare />} label="Сообщения" />
          </AppRail>

          <AppNav
            header={<div className="px-1 py-1"><div className="font-bold tracking-tight">Разработка</div><div className="text-xs text-muted-foreground">кабинет бизнеса</div></div>}
            className="hidden md:flex"
          >
            <AppNavGroup label="Работа">
              <AppNavItem icon={<BriefcaseBusiness />} label="Мои проекты" active count={3} />
              <AppNavItem icon={<Users />} label="Отклики команд" count={12} />
              <AppNavItem icon={<MessageSquare />} label="Диалоги" count={4} />
            </AppNavGroup>
            <AppNavGroup label="Поиск">
              <AppNavItem icon={<Search />} label="Каталог команд" />
              <AppNavItem icon={<Building2 />} label="Подрядчики" />
            </AppNavGroup>
          </AppNav>

          <main className="min-w-0 flex-1 p-5 lg:p-8">
            <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><span>Проекты</span><span>/</span><span>Новый продукт</span></div>
                <h2 className="text-3xl font-bold tracking-tight">Мобильный банк для бизнеса</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">Опубликуйте задачу, получите релевантные предложения и выберите команду в одном процессе.</p>
              </div>
              <Button size="lg"><Plus />Опубликовать задачу</Button>
            </header>

            <section className="mb-7 grid gap-3 md:grid-cols-3">
              {[
                ['1', 'Задача опубликована', 'Бриф видят проверенные команды'],
                ['2', '12 откликов', 'Сравните опыт, сроки и бюджет'],
                ['3', 'Выберите команду', 'Обсудите детали и начните проект'],
              ].map(([n, title, text], index) => (
                <Card key={n} className={index === 1 ? 'border-primary/30 bg-card' : 'bg-card'}>
                  <CardContent className="flex gap-3 pt-5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary font-bold text-secondary-foreground">{n}</div>
                    <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div><CardTitle>Подходящие команды</CardTitle><CardDescription>Рейтинг по опыту, специализации и совпадению с брифом</CardDescription></div>
                    <Badge variant="secondary">12 откликов</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {teams.map((team, index) => (
                    <div key={team.name}>
                      <div className="flex flex-wrap items-center gap-3 py-4">
                        <Avatar className="size-11"><AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">{team.name.slice(0, 2)}</AvatarFallback></Avatar>
                        <div className="min-w-44 flex-1"><p className="font-semibold">{team.name}</p><p className="text-sm text-muted-foreground">{team.focus}</p></div>
                        <div className="text-right"><p className="font-semibold">{team.fit}% match</p><p className="text-sm text-muted-foreground">★ {team.rating}</p></div>
                        <Button variant={index === 0 ? 'default' : 'outline'} size="sm">Выбрать</Button>
                      </div>
                      {index < teams.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
                <CardFooter><Button variant="outline" className="w-full">Показать все команды</Button></CardFooter>
              </Card>

              <Card className="h-fit">
                <CardHeader><CardTitle>Готовность проекта</CardTitle><CardDescription>До выбора исполнителя</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  <div><div className="mb-2 flex justify-between text-sm"><span>Профиль заполнен</span><span className="font-semibold">82%</span></div><Progress value={82} /></div>
                  <div className="space-y-3 text-sm">
                    {['Бриф и цели', 'Бюджет и сроки', 'Референсы'].map((item) => <div key={item} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-secondary text-secondary-foreground"><Check className="size-3" /></span>{item}</div>)}
                  </div>
                  <Button variant="secondary" className="w-full">Дополнить бриф</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
