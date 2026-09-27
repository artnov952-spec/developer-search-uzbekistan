import { useState } from 'react'
import {
  AspectRatio,
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
  Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText,
  Calendar,
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
  Checkbox,
  Collapsible, CollapsibleContent, CollapsibleTrigger,
  ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger,
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader,
  DrawerTitle, DrawerTrigger,
  Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet,
  Input,
  InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText,
  Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle,
  Kbd, KbdGroup,
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator,
  MenubarShortcut, MenubarTrigger,
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
  ResizableHandle, ResizablePanel, ResizablePanelGroup,
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
  Textarea,
  toast,
} from '@cloudplus/ui'
import { Building2, ChevronsUpDown, Copy, FileText, Search, Trash2 } from 'lucide-react'
import { Demo } from './Demo'

/** Ссылки внутри демо не должны трогать адресную строку: витрина роутится по хешу,
 *  и переход по «#» уводил бы со страницы. Гасим переход, оставляя семантику ссылки. */
function demoLink(run: () => void) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    run()
  }
}

const TOTAL_PAGES = 8

/** Первая, последняя и соседи текущей; `null` — многоточие. */
function pageWindow(current: number, total: number): (number | null)[] {
  const keep = new Set([1, total, current, current - 1, current + 1])
  const out: (number | null)[] = []
  for (let n = 1; n <= total; n++) {
    if (keep.has(n)) out.push(n)
    else if (out[out.length - 1] !== null) out.push(null)
  }
  return out
}

export function MoreNavigation() {
  const [page, setPage] = useState(2)
  const [crumb, setCrumb] = useState<string | null>(null)

  return (
    <div className="space-y-10">
      <Demo
        title="Breadcrumb"
        block
        code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/crm">CRM</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>ООО «Ромашка»</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
      >
        <div className="space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#nav" onClick={demoLink(() => setCrumb('CRM'))}>CRM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#nav" onClick={demoLink(() => setCrumb('Компании'))}>Компании</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>ООО «Ромашка»</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-muted-foreground text-sm">
            Последний переход: <span className="text-foreground font-medium">{crumb ?? '—'}</span>
          </p>
        </div>
      </Demo>

      <Demo
        title="Pagination"
        block
        code={`const [page, setPage] = useState(2)

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href={\`?page=\${page - 1}\`}
        aria-disabled={page === 1}
        className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
        onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
      />
    </PaginationItem>

    {pages.map((n) => (
      <PaginationItem key={n}>
        <PaginationLink
          href={\`?page=\${n}\`}
          isActive={n === page}
          onClick={(e) => { e.preventDefault(); setPage(n) }}
        >
          {n}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem><PaginationEllipsis /></PaginationItem>

    <PaginationItem>
      <PaginationNext
        href={\`?page=\${page + 1}\`}
        aria-disabled={page === total}
        className={page === total ? 'pointer-events-none opacity-50' : undefined}
        onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(total, p + 1)) }}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
      >
        <div className="space-y-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#nav"
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
                  onClick={demoLink(() => setPage((p) => Math.max(1, p - 1)))}
                />
              </PaginationItem>

              {pageWindow(page, TOTAL_PAGES).map((n, i) =>
                n === null ? (
                  <PaginationItem key={`gap-${i}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={n}>
                    <PaginationLink href="#nav" isActive={n === page} onClick={demoLink(() => setPage(n))}>
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#nav"
                  aria-disabled={page === TOTAL_PAGES}
                  className={page === TOTAL_PAGES ? 'pointer-events-none opacity-50' : undefined}
                  onClick={demoLink(() => setPage((p) => Math.min(TOTAL_PAGES, p + 1)))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-muted-foreground text-center text-sm">
            Страница <span className="text-foreground font-medium">{page}</span> из {TOTAL_PAGES}
          </p>
        </div>
      </Demo>

      <Demo
        title="Menubar"
        block
        code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Файл</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Новая сделка <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Экспорт</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
      >
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Файл</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Новая сделка <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>Импорт</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Экспорт в Excel</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Правка</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Отменить <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
              <MenubarItem>Повторить</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Вид</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Таблица</MenubarItem>
              <MenubarItem>Доска</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Demo>
    </div>
  )
}

export function MoreOverlays() {
  return (
    <div className="space-y-10">
      <Demo
        title="Sheet"
        description="Панель, выезжающая сбоку. В отличие от Dialog не перекрывает центр экрана — удобно для фильтров и деталей записи."
        code={`<Sheet>
  <SheetTrigger asChild><Button variant="outline">Открыть панель</Button></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Фильтры</SheetTitle>
      <SheetDescription>Настройте выборку записей.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <Button>Применить</Button>
      <SheetClose asChild><Button variant="outline">Отмена</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
      >
        {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild><Button variant="outline">{side}</Button></SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
                <SheetDescription>Настройте выборку записей.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 px-4">
                <Input placeholder="Название компании" />
                <Input placeholder="Ответственный" />
              </div>
              <SheetFooter>
                <Button>Применить</Button>
                <SheetClose asChild><Button variant="outline">Отмена</Button></SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </Demo>

      <Demo
        title="Drawer"
        description="Шторка снизу с жестом перетаскивания. Основной паттерн для мобильных."
        code={`<Drawer>
  <DrawerTrigger asChild><Button variant="outline">Открыть шторку</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Быстрое действие</DrawerTitle>
      <DrawerDescription>Выберите, что сделать с записью.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Позвонить</Button>
      <DrawerClose asChild><Button variant="outline">Закрыть</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
      >
        <Drawer>
          <DrawerTrigger asChild><Button variant="outline">Открыть шторку</Button></DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Быстрое действие</DrawerTitle>
              <DrawerDescription>Выберите, что сделать с записью.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Позвонить</Button>
              <DrawerClose asChild><Button variant="outline">Закрыть</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Demo>

      <Demo
        title="ContextMenu"
        description="Меню по правой кнопке мыши — для действий над строкой таблицы или карточкой."
        code={`<ContextMenu>
  <ContextMenuTrigger>Правый клик по области</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Открыть <ContextMenuShortcut>⏎</ContextMenuShortcut></ContextMenuItem>
    <ContextMenuCheckboxItem checked>Показывать сумму</ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive"><Trash2 />Удалить</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
      >
        <ContextMenu>
          <ContextMenuTrigger className="border-border text-muted-foreground flex h-28 w-72 items-center justify-center rounded-lg border border-dashed text-sm">
            Правый клик сюда
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Открыть <ContextMenuShortcut>⏎</ContextMenuShortcut></ContextMenuItem>
            <ContextMenuItem><Copy />Дублировать</ContextMenuItem>
            <ContextMenuCheckboxItem checked>Показывать сумму</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive"><Trash2 />Удалить</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>

      <Demo
        title="Sonner — тосты"
        description="Императивный toast() из любого места. Требует смонтированного <Toaster /> в корне приложения."
        code={`import { toast, Toaster } from '@cloudplus/ui'

// в корне приложения:
<Toaster />

// где угодно:
toast.success('Сделка создана', { description: 'Черновик добавлен в воронку' })
toast.error('Не удалось сохранить')
toast('Ссылка скопирована', { action: { label: 'Отменить', onClick: () => {} } })`}
      >
        <Button variant="outline" onClick={() => toast('Обычный тост')}>Обычный</Button>
        <Button variant="outline" onClick={() => toast.success('Сделка создана', { description: 'Черновик добавлен в воронку' })}>
          Успех
        </Button>
        <Button variant="outline" onClick={() => toast.error('Не удалось сохранить')}>Ошибка</Button>
        <Button
          variant="outline"
          onClick={() => toast('Ссылка скопирована', { action: { label: 'Отменить', onClick: () => {} } })}
        >
          С действием
        </Button>
      </Demo>
    </div>
  )
}

export function MoreForms() {
  return (
    <div className="space-y-10">
      <Demo
        title="Field"
        description="Обёртка поля: подпись, описание и ошибка в едином ритме. Работает с любым контролом."
        block
        code={`<FieldSet>
  <FieldLegend>Реквизиты</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="inn">ИНН</FieldLabel>
      <Input id="inn" placeholder="305471028" />
      <FieldDescription>10 или 12 цифр без пробелов.</FieldDescription>
    </Field>
    <Field data-invalid>
      <FieldLabel htmlFor="kpp">КПП</FieldLabel>
      <Input id="kpp" aria-invalid />
      <FieldError>Обязательное поле.</FieldError>
    </Field>
  </FieldGroup>
</FieldSet>`}
      >
        <FieldSet className="max-w-sm">
          <FieldLegend>Реквизиты</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="f-inn">ИНН</FieldLabel>
              <Input id="f-inn" placeholder="305471028" />
              <FieldDescription>10 или 12 цифр без пробелов.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="f-kpp">КПП</FieldLabel>
              <Input id="f-kpp" aria-invalid placeholder="—" />
              <FieldError>Обязательное поле.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="f-agree" />
              <FieldLabel htmlFor="f-agree">Плательщик НДС</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Demo>

      <Demo
        title="InputGroup"
        description="Поле с приклеенными элементами: иконкой, префиксом, кнопкой."
        block
        code={`<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Поиск…" />
</InputGroup>

<InputGroup>
  <InputGroupInput placeholder="0" />
  <InputGroupAddon align="inline-end"><InputGroupText>₽</InputGroupText></InputGroupAddon>
</InputGroup>`}
      >
        <div className="grid max-w-sm gap-3">
          <InputGroup>
            <InputGroupAddon><Search /></InputGroupAddon>
            <InputGroupInput placeholder="Поиск компании…" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
            <InputGroupInput placeholder="company.ru" />
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="0" />
            <InputGroupAddon align="inline-end"><InputGroupText>₽</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Комментарий" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>Отправить</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Demo>

      <Demo
        title="ButtonGroup"
        description="Слитая группа кнопок — переключатели вида, сплит-кнопки."
        code={`<ButtonGroup>
  <Button variant="outline">Таблица</Button>
  <Button variant="outline">Доска</Button>
  <Button variant="outline">Календарь</Button>
</ButtonGroup>

<ButtonGroup>
  <Button variant="outline">Сохранить</Button>
  <ButtonGroupSeparator />
  <Button variant="outline" size="icon"><ChevronsUpDown /></Button>
</ButtonGroup>`}
      >
        <ButtonGroup>
          <Button variant="outline">Таблица</Button>
          <Button variant="outline">Доска</Button>
          <Button variant="outline">Календарь</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>Валюта</ButtonGroupText>
          <Button variant="outline">₽</Button>
          <ButtonGroupSeparator />
          <Button variant="outline" size="icon" aria-label="Ещё"><ChevronsUpDown /></Button>
        </ButtonGroup>
      </Demo>

      <Demo
        title="Kbd"
        description="Клавиши в подсказках и меню."
        code={`<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`}
      >
        <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
        <KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup>
        <span className="text-muted-foreground text-sm">— открыть командную палитру</span>
      </Demo>
    </div>
  )
}

export function MoreLayout() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-10">
      <Demo
        title="Item"
        description="Строка списка: медиа, заголовок, описание, действия. Основа для списков записей без таблицы."
        block
        code={`<ItemGroup>
  <Item>
    <ItemMedia variant="icon"><Building2 /></ItemMedia>
    <ItemContent>
      <ItemTitle>ООО «Ромашка»</ItemTitle>
      <ItemDescription>Клиент · Москва</ItemDescription>
    </ItemContent>
    <ItemActions><Button size="sm" variant="outline">Открыть</Button></ItemActions>
  </Item>
</ItemGroup>`}
      >
        <ItemGroup className="max-w-lg">
          {[
            ['ООО «Ромашка»', 'Клиент · Москва'],
            ['АО «Вектор»', 'Лид · Казань'],
            ['ИП Соколов', 'Клиент · Уфа'],
          ].map(([name, sub], i, arr) => (
            <div key={name}>
              <Item>
                <ItemMedia variant="icon"><Building2 /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                  <ItemDescription>{sub}</ItemDescription>
                </ItemContent>
                <ItemActions><Button size="sm" variant="outline">Открыть</Button></ItemActions>
              </Item>
              {i < arr.length - 1 && <ItemSeparator />}
            </div>
          ))}
        </ItemGroup>
      </Demo>

      <Demo
        title="Collapsible"
        block
        code={`<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Показать ещё <ChevronsUpDown /></Button>
  </CollapsibleTrigger>
  <CollapsibleContent>…скрытое содержимое…</CollapsibleContent>
</Collapsible>`}
      >
        <Collapsible open={open} onOpenChange={setOpen} className="max-w-sm">
          <CollapsibleTrigger asChild>
            <Button variant="ghost">Дополнительные поля <ChevronsUpDown /></Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-muted-foreground space-y-2 px-3 pt-2 text-sm">
            <div>ОКПО — 12345678</div>
            <div>ОКВЭД — 62.01</div>
            <div>Расчётный счёт — 40702810…</div>
          </CollapsibleContent>
        </Collapsible>
      </Demo>

      <Demo
        title="Resizable"
        description="Панели с перетаскиваемой границей — раскладка «список / деталь»."
        block
        code={`<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize={35}>Список</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65}>Деталь</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <ResizablePanelGroup orientation="horizontal" className="h-56 w-full rounded-lg border">
          <ResizablePanel defaultSize={35}>
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">Список</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65}>
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">Карточка записи</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>

      <Demo
        title="AspectRatio и Carousel"
        block
        code={`<AspectRatio ratio={16 / 9}>…</AspectRatio>

<Carousel>
  <CarouselContent>
    <CarouselItem>Слайд 1</CarouselItem>
  </CarouselContent>
  <CarouselPrevious /><CarouselNext />
</Carousel>`}
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center rounded-lg">
            <span className="text-muted-foreground text-sm">16 : 9</span>
          </AspectRatio>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {[1, 2, 3].map((n) => (
                <CarouselItem key={n}>
                  <div className="bg-muted flex h-32 items-center justify-center rounded-lg text-2xl font-semibold">
                    {n}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Demo>

      <Demo
        title="Calendar"
        description="Календарь на react-day-picker. Для CRM-полей даты есть DatePicker в надстройке."
        code={`<Calendar mode="single" selected={date} onSelect={setDate} />`}
      >
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
      </Demo>

      <Demo
        title="Textarea в форме"
        block
        code={`<Field>
  <FieldLabel htmlFor="note">Заметка</FieldLabel>
  <Textarea id="note" placeholder="Итог разговора…" />
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="m-note">Заметка</FieldLabel>
          <Textarea id="m-note" placeholder="Итог разговора…" />
          <FieldDescription>Видна всем участникам сделки.</FieldDescription>
        </Field>
      </Demo>

      <Demo
        title="Иконка документа"
        code={`<Item variant="outline">
  <ItemMedia variant="icon"><FileText /></ItemMedia>
  <ItemContent><ItemTitle>Договор_285.pdf</ItemTitle></ItemContent>
</Item>`}
      >
        <Item variant="outline" className="w-72">
          <ItemMedia variant="icon"><FileText /></ItemMedia>
          <ItemContent>
            <ItemTitle>Договор_285.pdf</ItemTitle>
            <ItemDescription>240 КБ · вчера</ItemDescription>
          </ItemContent>
        </Item>
      </Demo>
    </div>
  )
}
