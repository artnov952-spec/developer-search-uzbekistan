# Cloudplus Icons v1.0.0

100 авторских иконок под Cloudplus CRM. Собственная геометрия, не производная
от Lucide / Feather / Phosphor.

## Что внутри

| Путь | Что это |
|---|---|
| `svg/` | 100 отдельных SVG, 24x24, `currentColor` |
| `sprite.svg` | спрайт с `<symbol id="cp-<имя>">` |
| `react/CpIcon.jsx` | React-компонент |
| `react/icons.js` | карта имя → разметка |
| `react/icons.d.ts` | типы имен для TypeScript |
| `icons.css` | двухцветный режим и модификаторы |
| `preview.html` | офлайн-каталог с поиском, открывается двойным кликом |

## Состав

- **Навигация** - 14
- **Сущности** - 12
- **Продажи** - 12
- **Коммуникации** - 12
- **Действия** - 14
- **Файлы** - 8
- **Состояния** - 10
- **Аналитика** - 8
- **Система** - 10

## Правила набора

1. **Диагональная асимметрия радиусов** - у контейнеров радиус 5 на верхнем-левом и
   нижнем-правом углах, радиус 2 на двух других. Подпись набора.
2. **Акцентная точка** - не более одной залитой точки r=1.15 на смысловом центре.
3. **Сетка 2px, углы 0/45/90** - четкость на 16px без хинтинга.
4. Обводка 1.6, `linecap/linejoin: round`, цвет - `currentColor`.

## Встраивание в CRM (React)

```bash
cp -r icon-pack/react apps/web/src/icons
cp icon-pack/icons.css apps/web/src/icons/icons.css
```

```tsx
import { CpIcon } from './icons/CpIcon'
import './icons/icons.css'

<CpIcon name="deal" size={20} />
<CpIcon name="calendar" size={20} className="cp-icon--duo" />  // акцентная точка цветом бренда
```

Замена в сайдбаре - один в один по смыслу:

| Было (lucide) | Стало |
|---|---|
| `Building2` | `crm` / `company` |
| `Gauge` | `logos` |
| `CheckSquare` | `mitos` |
| `Send` | `telegram` |
| `MessageCircle` | `communications` |
| `Calendar` | `calendar` |
| `Database` | `database` |
| `Network` | `structure` |
| `BarChart3` | `sales-rating` |
| `BookOpen` | `knowledge` |
| `Bot` | `assistant` |
| `History` | `action-log` |
| `Code2` | `dev` |

## Спрайт (без сборки)

```html
<div hidden id="cp-sprite"></div>
<script>fetch('/sprite.svg').then(r=>r.text()).then(s=>cpSprite.innerHTML=s)</script>

<svg width="20" height="20"><use href="#cp-deal"></use></svg>
```

## Цвет

Контур наследует `color` родителя. Акцентная точка красится через переменную:

```css
.sidebar { --cp-icon-accent: #5b8cff; }
```
