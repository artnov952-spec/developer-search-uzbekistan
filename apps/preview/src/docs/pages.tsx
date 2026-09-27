import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Alert, AlertDescription, AlertTitle,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Avatar, AvatarFallback,
  Badge,
  Button,
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
  Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  HoverCard, HoverCardContent, HoverCardTrigger,
  Input,
  Label,
  Popover, PopoverContent, PopoverTrigger,
  Progress,
  ScrollArea,
  Separator,
  Skeleton,
  Spinner,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Textarea,
  Tooltip, TooltipContent, TooltipTrigger,
} from '@cloudplus/ui'
import { Inbox, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { Demo } from './Demo'
import { Tokens } from './Tokens'
import { CrmExtrasAnalytics, CrmExtrasBoard, CrmExtrasData, CrmExtrasInputs, CrmExtrasShell } from './CrmExtras'
import { MoreForms, MoreLayout, MoreNavigation, MoreOverlays } from './More'
import { AdvancedChart, AdvancedForm, AdvancedShell } from './Advanced'
import { LiveCommandPage, LiveControls, LiveOtp, LiveProgress, LiveSelect, LiveToggle } from './Live'
import { Keys } from './Keys'
import { VariantsTable } from './PropsTable'
import { Blocks } from './Blocks'
import { Theming } from './Theming'
import { DevelopmentBrand } from './DevelopmentBrand'

export type DocPage = {
  slug: string
  title: string
  description: string
  group: string
  render: () => React.ReactNode
}

export const PAGES: DocPage[] = [
  {
    slug: 'development-brand',
    title: 'Бренд «Разработка»',
    description: 'Рабочий бренд-профиль и продуктовый сценарий: бизнес публикует задачу, сравнивает отклики и выбирает команду.',
    group: 'Разработка',
    render: () => <DevelopmentBrand />,
  },
  {
    slug: 'button',
    title: 'Button',
    description: 'Кнопка с шестью вариантами и четырьмя размерами. Через asChild превращается в любой элемент — ссылку, пункт меню.',
    group: 'Формы',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Варианты"
          code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`}
        >
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Demo>

        <Demo
          title="Размеры"
          code={`<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Добавить"><Plus /></Button>`}
        >
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Добавить"><Plus /></Button>
        </Demo>

        <Demo
          title="С иконкой, загрузка, выключенная"
          description="Иконки внутри кнопки получают размер автоматически — задавать его вручную не нужно."
          code={`<Button><Plus />Добавить</Button>
<Button variant="outline"><Spinner />Загрузка</Button>
<Button disabled>Недоступна</Button>`}
        >
          <Button><Plus />Добавить</Button>
          <Button variant="outline"><Spinner />Загрузка</Button>
          <Button disabled>Недоступна</Button>
        </Demo>

        <Demo
          title="asChild"
          description="Кнопка отдаёт свои стили дочернему элементу — получается ссылка, которая выглядит как кнопка."
          code={`<Button asChild>
  <a href="#button">Обычная ссылка</a>
</Button>`}
        >
          <Button asChild><a href="#button">Обычная ссылка</a></Button>
        </Demo>

        <VariantsTable of="button" />
      </div>
    ),
  },
  {
    slug: 'input',
    title: 'Input и Textarea',
    description: 'Поля ввода с состояниями фокуса, ошибки и блокировки.',
    group: 'Формы',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Базовое поле"
          block
          code={`<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@company.ru" />
</div>`}
        >
          <div className="grid max-w-sm gap-2">
            <Label htmlFor="d-email">Email</Label>
            <Input id="d-email" type="email" placeholder="name@company.ru" />
          </div>
        </Demo>

        <Demo
          title="Состояния"
          block
          code={`<Input placeholder="Обычное" />
<Input placeholder="С ошибкой" aria-invalid />
<Input placeholder="Заблокировано" disabled />
<Textarea placeholder="Комментарий…" />`}
        >
          <div className="grid max-w-sm gap-3">
            <Input placeholder="Обычное" />
            <Input placeholder="С ошибкой" aria-invalid />
            <Input placeholder="Заблокировано" disabled />
            <Textarea placeholder="Комментарий…" />
          </div>
        </Demo>
      </div>
    ),
  },
  {
    slug: 'select',
    title: 'Select',
    description: 'Выпадающий список на Radix: клавиатура, типизация по буквам, позиционирование — из коробки.',
    group: 'Формы',
    render: () => <LiveSelect />,
  },
  {
    slug: 'checkbox',
    title: 'Checkbox, Switch, Radio, Slider',
    description: 'Переключатели и ползунки. Все контролируемые: значение видно под превью.',
    group: 'Формы',
    render: () => <LiveControls />,
  },
  {
    slug: 'card',
    title: 'Card',
    description: 'Карточка с шапкой, действием в углу, содержимым и подвалом.',
    group: 'Отображение',
    render: () => (
      <Demo
        code={`<Card>
  <CardHeader>
    <CardTitle>ООО «Ромашка»</CardTitle>
    <CardDescription>Клиент · Москва</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <Progress value={62} />
  </CardContent>
  <CardFooter className="gap-2">
    <Button size="sm">Открыть</Button>
    <Button size="sm" variant="outline">Написать</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="w-80">
          <CardHeader>
            <CardTitle>ООО «Ромашка»</CardTitle>
            <CardDescription>Клиент · Москва</CardDescription>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Ещё"><MoreHorizontal /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Действия</DropdownMenuLabel>
                  <DropdownMenuItem>Редактировать</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive"><Trash2 />Удалить</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Заполнено</span>
              <span className="font-medium">62%</span>
            </div>
            <Progress value={62} />
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Открыть</Button>
            <Button size="sm" variant="outline">Написать</Button>
          </CardFooter>
        </Card>
      </Demo>
    ),
  },
  {
    slug: 'badge',
    title: 'Badge',
    description: 'Компактная метка статуса.',
    group: 'Отображение',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Варианты"
          code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="ghost">Ghost</Badge>`}
        >
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </Demo>

        <Demo
          title="Как статус записи"
          description="Смысловые цвета берутся из токенов кита — они не входят в базовый shadcn."
          code={`<Badge variant="outline" className="border-transparent bg-[var(--success-soft)] text-[var(--success-soft-fg)]">
  Выиграна
</Badge>`}
        >
          <Badge variant="outline" className="border-transparent bg-[var(--success-soft)] text-[var(--success-soft-fg)]">Выиграна</Badge>
          <Badge variant="outline" className="border-transparent bg-[var(--warning-soft)] text-[var(--warning-soft-fg)]">Ждёт оплаты</Badge>
          <Badge variant="outline" className="border-transparent bg-[var(--danger-soft)] text-[var(--danger-soft-fg)]">Просрочена</Badge>
          <Badge variant="outline" className="border-transparent bg-[var(--info-soft)] text-[var(--info-soft-fg)]">На согласовании</Badge>
        </Demo>

        <VariantsTable of="badge" />
      </div>
    ),
  },
  {
    slug: 'table',
    title: 'Table',
    description: 'Базовая таблица. Для сортировки и выбора строк — DataGrid из CRM-надстройки.',
    group: 'Отображение',
    render: () => (
      <Demo
        block
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Компания</TableHead>
      <TableHead>Стадия</TableHead>
      <TableHead className="text-right">Сумма</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">ООО «Ромашка»</TableCell>
      <TableCell><Badge variant="secondary">В работе</Badge></TableCell>
      <TableCell className="text-right tabular-nums">1 240 000 ₽</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Компания</TableHead>
              <TableHead>Ответственный</TableHead>
              <TableHead>Стадия</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['ООО «Ромашка»', 'АИ', 'В работе', '1 240 000 ₽'],
              ['АО «Вектор»', 'МК', 'Новая', '480 000 ₽'],
              ['ИП Соколов', 'ДП', 'Выиграна', '95 000 ₽'],
            ].map(([co, who, stage, sum]) => (
              <TableRow key={co}>
                <TableCell className="font-medium">{co}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6"><AvatarFallback className="text-[10px]">{who}</AvatarFallback></Avatar>
                    <span className="text-muted-foreground">{who}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">{stage}</Badge></TableCell>
                <TableCell className="text-right tabular-nums">{sum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>
    ),
  },
  {
    slug: 'dialog',
    title: 'Dialog и AlertDialog',
    description: 'Модальные окна. AlertDialog — для подтверждения необратимых действий: его нельзя закрыть кликом мимо.',
    group: 'Оверлеи',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Dialog"
          code={`<Dialog>
  <DialogTrigger asChild><Button variant="outline">Открыть</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Новая сделка</DialogTitle>
      <DialogDescription>Заполните основные поля.</DialogDescription>
    </DialogHeader>
    <Input placeholder="Название" />
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
      <Button>Создать</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Открыть диалог</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая сделка</DialogTitle>
                <DialogDescription>Заполните основные поля — остальное можно позже.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Название" />
                <Input placeholder="Сумма" />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
                <Button>Создать</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Demo>

        <Demo
          title="AlertDialog"
          code={`<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="outline">Удалить</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
      <AlertDialogDescription>Действие необратимо.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Отмена</AlertDialogCancel>
      <AlertDialogAction>Удалить</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline">Удалить запись</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
                <AlertDialogDescription>Действие необратимо.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction>Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Demo>

        <Keys
          rows={[
            [['Esc'], 'Закрыть Dialog. AlertDialog не закрывается — решение требует явного ответа.'],
            [['Tab'], 'Фокус ходит по кругу внутри окна и не уходит на страницу под ним.'],
            [['⇧', 'Tab'], 'То же в обратную сторону.'],
            [['Enter'], 'Активировать элемент в фокусе.'],
          ]}
        />
      </div>
    ),
  },
  {
    slug: 'menu',
    title: 'DropdownMenu, Popover, Tooltip',
    description: 'Всплывающие слои: меню действий, произвольное содержимое, подсказка.',
    group: 'Оверлеи',
    render: () => (
      <Demo
        code={`<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Меню</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Действия</DropdownMenuLabel>
    <DropdownMenuItem>Редактировать</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive"><Trash2 />Удалить</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Popover</Button></PopoverTrigger>
  <PopoverContent>Произвольное содержимое.</PopoverContent>
</Popover>

<Tooltip>
  <TooltipTrigger asChild><Button variant="outline">Наведи</Button></TooltipTrigger>
  <TooltipContent>Подсказка</TooltipContent>
</Tooltip>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline">Меню</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem>Редактировать</DropdownMenuItem>
            <DropdownMenuItem>Дублировать</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive"><Trash2 />Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild><Button variant="outline">Popover</Button></PopoverTrigger>
          <PopoverContent className="text-sm">Произвольное содержимое во всплывающем слое.</PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild><Button variant="outline">Наведи</Button></TooltipTrigger>
          <TooltipContent>Подсказка</TooltipContent>
        </Tooltip>

        <HoverCard>
          <HoverCardTrigger asChild><Button variant="link">Карточка при наведении</Button></HoverCardTrigger>
          <HoverCardContent className="text-sm">Разворачивается по наведению, а не по клику.</HoverCardContent>
        </HoverCard>
      </Demo>
    ),
  },
  {
    slug: 'command',
    title: 'Command',
    description: 'Командная палитра с поиском — основа для Cmd/Ctrl+K. Именно на ней собран поиск этой витрины.',
    group: 'Оверлеи',
    render: () => <LiveCommandPage />,
  },
  {
    slug: 'tabs',
    title: 'Tabs, Toggle, Accordion',
    description: 'Переключение разделов и раскрывающиеся блоки.',
    group: 'Навигация',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Tabs"
          block
          code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Обзор</TabsTrigger>
    <TabsTrigger value="tasks">Задачи</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Сводка по записи.</TabsContent>
  <TabsContent value="tasks">Список задач.</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue="overview" className="max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="tasks">Задачи</TabsTrigger>
              <TabsTrigger value="files">Файлы</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-muted-foreground pt-3 text-sm">Сводка по записи.</TabsContent>
            <TabsContent value="tasks" className="text-muted-foreground pt-3 text-sm">Список задач.</TabsContent>
            <TabsContent value="files" className="text-muted-foreground pt-3 text-sm">Вложения.</TabsContent>
          </Tabs>
        </Demo>

        <LiveToggle />

        <VariantsTable of="tabs" title="Варианты Tabs" />
        <VariantsTable of="toggle" title="Варианты Toggle" />

        <Demo
          title="Accordion"
          block
          code={`<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Реквизиты</AccordionTrigger>
    <AccordionContent>ИНН, КПП, расчётный счёт.</AccordionContent>
  </AccordionItem>
</Accordion>`}
        >
          <Accordion type="single" collapsible className="max-w-md">
            <AccordionItem value="a">
              <AccordionTrigger>Реквизиты</AccordionTrigger>
              <AccordionContent>ИНН, КПП, расчётный счёт.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Контакты</AccordionTrigger>
              <AccordionContent>Телефоны и адреса.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>
      </div>
    ),
  },
  {
    slug: 'feedback',
    title: 'Alert, Progress, Skeleton, Empty',
    description: 'Обратная связь и состояния загрузки/пустоты.',
    group: 'Статусы',
    render: () => (
      <div className="space-y-10">
        <Demo
          title="Alert"
          block
          code={`<Alert>
  <AlertTitle>Синхронизация завершена</AlertTitle>
  <AlertDescription>Обновлено 128 записей.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Ошибка импорта</AlertTitle>
  <AlertDescription>Проверьте формат файла.</AlertDescription>
</Alert>`}
        >
          <div className="grid max-w-md gap-3">
            <Alert>
              <AlertTitle>Синхронизация завершена</AlertTitle>
              <AlertDescription>Обновлено 128 записей.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Ошибка импорта</AlertTitle>
              <AlertDescription>Проверьте формат файла.</AlertDescription>
            </Alert>
          </div>
        </Demo>

        <LiveProgress />

        <Demo
          title="Skeleton"
          block
          code={`<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-4/5" />`}
        >
          <div className="max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Demo>

        <Demo
          title="Empty"
          code={`<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
    <EmptyTitle>Пока пусто</EmptyTitle>
    <EmptyDescription>Здесь появятся записи.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button size="sm"><Plus />Добавить</Button></EmptyContent>
</Empty>`}
        >
          <Empty className="w-80">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
              <EmptyTitle>Пока пусто</EmptyTitle>
              <EmptyDescription>Здесь появятся записи, когда вы их добавите.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm"><Plus />Добавить</Button>
            </EmptyContent>
          </Empty>
        </Demo>

        <VariantsTable of="alert" title="Варианты Alert" />
        <VariantsTable of="empty" title="Варианты EmptyMedia" />
      </div>
    ),
  },
  {
    slug: 'layout',
    title: 'Separator, ScrollArea, Avatar',
    description: 'Вспомогательные элементы раскладки.',
    group: 'Отображение',
    render: () => (
      <Demo
        block
        code={`<Separator />
<ScrollArea className="h-32">…</ScrollArea>
<Avatar><AvatarFallback>АИ</AvatarFallback></Avatar>`}
      >
        <div className="grid max-w-md gap-4">
          <div className="flex items-center gap-3">
            <Avatar><AvatarFallback>АИ</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>МК</AvatarFallback></Avatar>
            <Separator orientation="vertical" className="h-8" />
            <span className="text-muted-foreground text-sm">Разделитель</span>
          </div>
          <Separator />
          <ScrollArea className="h-32 rounded-md border p-3">
            <div className="space-y-2 text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i}>Строка списка {i + 1}</div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Demo>
    ),
  },
  {
    slug: 'blocks',
    title: 'Блоки',
    description: 'Готовые экраны целиком: вход, дашборд, список, настройки, карточка, пустое состояние. Копируются как код — из пакета не экспортируются.',
    group: 'Основа',
    render: () => <Blocks />,
  },
  {
    slug: 'theming',
    title: 'Темизация',
    description: 'Живая площадка: тема, плотность, акцент, шрифт и скругление. Внизу собирается готовый CSS.',
    group: 'Основа',
    render: () => <Theming />,
  },
  {
    slug: 'foundations',
    title: 'Токены',
    description: 'Палитра, шкалы и типографика. Значения читаются из CSS вживую, поэтому меняются вместе с темой, акцентом и плотностью.',
    group: 'Основа',
    render: () => <Tokens />,
  },
  {
    slug: 'field',
    title: 'Field, InputGroup, ButtonGroup',
    description: 'Обёртка поля с подписью и ошибкой, поле с приклеенными элементами, слитая группа кнопок.',
    group: 'Формы',
    render: () => <MoreForms />,
  },
  {
    slug: 'input-otp',
    title: 'InputOTP',
    description: 'Поле одноразового кода: несколько ячеек, работающих как одно поле ввода.',
    group: 'Формы',
    render: () => <LiveOtp />,
  },
  {
    slug: 'nav',
    title: 'Breadcrumb, Pagination, Menubar',
    description: 'Хлебные крошки, постраничная навигация и строка меню.',
    group: 'Навигация',
    render: () => <MoreNavigation />,
  },
  {
    slug: 'sheet',
    title: 'Sheet, Drawer, ContextMenu, тосты',
    description: 'Боковая панель, шторка снизу, меню по правой кнопке и уведомления.',
    group: 'Оверлеи',
    render: () => <MoreOverlays />,
  },
  {
    slug: 'misc',
    title: 'Item, Collapsible, Resizable, Calendar',
    description: 'Строки списка, раскрывающиеся блоки, панели с перетаскиваемой границей, календарь.',
    group: 'Отображение',
    render: () => <MoreLayout />,
  },
  {
    slug: 'form',
    title: 'Форма с валидацией',
    description: 'react-hook-form + zod поверх Field — стандартный способ собрать форму в ките.',
    group: 'Формы',
    render: () => <AdvancedForm />,
  },
  {
    slug: 'chart',
    title: 'Chart',
    description: 'Графики на Recharts с готовой обвязкой: цвета из токенов, стилизованные тултип и легенда.',
    group: 'Отображение',
    render: () => <AdvancedChart />,
  },
  {
    slug: 'app-shell',
    title: 'Sidebar и NavigationMenu',
    description: 'Оболочка приложения со сворачиваемой панелью и горизонтальное меню продукта.',
    group: 'Навигация',
    render: () => <AdvancedShell />,
  },
  {
    slug: 'crm-data',
    title: 'Таблица и фильтры',
    description: 'DataGrid с сортировкой и выбором строк, панель фильтров над ним. В shadcn Table — только разметка, без состояния.',
    group: 'CRM-надстройка',
    render: () => <CrmExtrasData />,
  },
  {
    slug: 'crm-analytics',
    title: 'Аналитика',
    description: 'Показатели, графики и прогресс. Лёгкие SVG-компоненты без внешних зависимостей — на случай, когда Recharts из shadcn избыточен.',
    group: 'CRM-надстройка',
    render: () => <CrmExtrasAnalytics />,
  },
  {
    slug: 'crm-board',
    title: 'Доска и структура',
    description: 'Канбан сделок, оргструктура, дерево.',
    group: 'CRM-надстройка',
    render: () => <CrmExtrasBoard />,
  },
  {
    slug: 'crm-inputs',
    title: 'Поля CRM',
    description: 'Телефон, деньги, редактирование по клику, мультивыбор — то, чего нет в базовом наборе.',
    group: 'CRM-надстройка',
    render: () => <CrmExtrasInputs />,
  },
  {
    slug: 'crm-shell',
    title: 'Оболочка приложения',
    description: 'Тёмный icon-rail со вторичной колонкой, шапка страницы, уведомления.',
    group: 'CRM-надстройка',
    render: () => <CrmExtrasShell />,
  },
]

export const GROUPS = ['Разработка', 'Формы', 'Отображение', 'Оверлеи', 'Навигация', 'Статусы', 'Основа', 'CRM-надстройка']
