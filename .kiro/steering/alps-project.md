# ALPS Project — Steering Guide

## What is ALPS?

ALPS (Agile Lifecycle & Project Steering) is a **React-based project visibility and management prototype**. It is a handoff bundle from Claude Design — the HTML files are prototypes; the goal is to implement them as a working React application.

The app helps PMs, Tech Leads, developers, and stakeholders track projects through a 3-gate validation process (Business → Product → Tech), manage sprints and cycles, and surface AI-generated suggestions for scope updates and unblock strategies.

---

## Product Features

### Current screens
- **Dashboard** — single-project detail view with ticket status, 3-gate progression, gate change log, and AI suggestions panel. Supports `activeProjectId` prop to show any project from `PROJECTS`; shows "← Back to Portfolio" button when navigated from Portfolio. Contains a "View Progress & Cycles →" button that opens `Progress.html` in a new tab.
- **Portfolio** — multi-project list with summary bar, state filter, and clickable `Project_Card` components
- **Cycles & Sprints** — cycle/sprint cards with Sprint Health indicators, team workload summary, proportional timeline with hover tooltips and today marker. Each sprint card shows its parent project with a "View →" link to navigate to that project's dashboard.
- **Progress.html** — standalone ticket detail page (separate HTML file, not a SPA screen). Shows insight cards, cycle cards, filterable ticket table, and ticket detail panel for a single project.
- **New Request** — stub (not yet implemented)
- **Archive** — stub (not yet implemented)

### 3-Gate model
Every project passes through three sequential gates:
1. **Business Gate** — validates ROI, stakeholder alignment, success metrics
2. **Product Gate** — defines UX scope, acceptance criteria, feature completeness
3. **Tech Gate** — validates feasibility, architecture, performance

Gate statuses: `locked` → `in_progress` → `cleared`

### Role switcher
The app supports four roles that affect what is shown: `pm`, `developer`, `techLead`, `requestor`.

### AI Suggestions
Tickets can have AI-generated suggestions (`pending_approval`, `approved`, `rejected`) for scope updates, acceptance criteria, and unblock strategies. PMs can edit and approve/reject them from the Dashboard.

### Tweaks / Edit Mode
The app supports a live design-token editing mode via `tweaks-panel.jsx`. The host sends `__activate_edit_mode` / `__deactivate_edit_mode` messages; the panel posts `__edit_mode_set_keys` back to persist changes to the `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` block in source files.

---

## Tech Stack

### Runtime
- **React 18** via CDN (no build step, no bundler, no npm)
- **Babel** in-browser transpilation (`<script type="text/babel">`)
- **No TypeScript** — plain JSX only
- **No ES modules** — no `import`/`export` between files
- **No package.json** — no node_modules

### Infrastructure
- Served by **nginx** via Docker (`docker-compose up`)
- Entry point: `project/ALPS Prototype.html`
- nginx config: `nginx.conf` — serves `ALPS Prototype.html` as the index

### How files are loaded
All JSX files are loaded as `<script type="text/babel">` tags in the HTML. They execute in order. Each file exposes its exports via `Object.assign(window, { ... })`.

---

## File Structure

```
project/
├── ALPS Prototype.html   # Entry point — loads all scripts in order
├── Progress.html         # Standalone ticket detail page for a single project (self-contained React app)
├── data.jsx              # All sample data (PEOPLE, PROJECT, PROJECTS, SPRINTS, CYCLES, LINEAR_TICKETS, INITIAL_SUGGESTIONS, etc.)
├── utils.jsx             # Pure utility functions (computeSprintHealth, computeTimelinePosition, computeTodayMarkerPosition, computeWorkload, computePortfolioSummary)
├── primitives.jsx        # Shared UI components (Avatar, Pill, StateBadge, GateTriangles, GateRow, Section, Button, Icon)
├── screen-dashboard.jsx  # DashboardScreen + GateChecklist + GateContent* + SuggestionCard
├── screen-portfolio.jsx  # PortfolioScreen + Summary_Bar + Project_Card
├── screen-cycles.jsx     # CyclesScreen + Sprint_Card + Sprint_Health_Badge + Timeline_Bar + Workload_Summary
├── app.jsx               # App shell (App, Sidebar_Nav, root.render, window.Section/Avatar overrides)
├── tweaks-panel.jsx      # Reusable tweaks shell + form controls (useTweaks, TweaksPanel, TweakSlider, etc.)
├── tweaks.jsx            # TweaksUI component — legacy tweaks panel (role, theme, density, project state)
└── uploads/              # Image assets
```

`Progress.html` is a **separate standalone page** — it has its own React root, its own data constants, and its own header/navigation. It is not loaded by `ALPS Prototype.html` and does not share `window` globals with the main app.

---

## Coding Conventions

### Component exposure
Every component and utility function **must** be exposed on `window`:
```js
// Good
Object.assign(window, { MyComponent, myUtilFn });

// Also fine for single items
window.MyComponent = MyComponent;
```

Never use `export default` or named exports — there is no module system.

### Consuming shared components
Reference other files' exports via `window`:
```jsx
// Correct — primitives.jsx exposes these on window
<window.Avatar person="rina" size={20} />
<window.StateBadge state="in_progress" />
<window.Section kicker="Progress" title="Ticket Status">...</window.Section>
```

### Styling approach
- **Inline styles** for component-level styles (the primary approach)
- **CSS variables** for theming — always use these, never hardcode colors:
  ```
  var(--alps-primary)      # brand blue
  var(--alps-accent)       # cyan accent
  var(--alps-success)      # green
  var(--alps-warning)      # amber
  var(--alps-danger)       # red
  var(--alps-info)         # light blue
  var(--alps-bg)           # page background
  var(--alps-bg-alt)       # card/panel background
  var(--alps-text)         # primary text
  var(--alps-text-muted)   # secondary text
  var(--alps-border)       # border color
  --font-sans              # system font stack
  ```
- **A single `<style>` block** inside `App`'s render for global/structural CSS
- CSS class names use the `alps-` prefix for app styles, `twk-` prefix for tweaks panel styles

### Dark mode
The app defaults to dark mode (`alpsStyles.darkMode = true`). The `alps-app` root gets class `dark` or `light`. All colors must work in both modes via CSS variables.

### React patterns
- Use `React.useState`, `React.useEffect`, `React.useRef`, `React.useCallback` (not destructured imports, since React is a global)
- Exception: `primitives.jsx` destructures from `React` at the top — that's fine within that file
- Avoid class components — functional components only
- Keep state as high as needed; pass setters as props

### Date handling
- All dates are ISO strings: `"YYYY-MM-DD"`
- Parse with `new Date("YYYY-MM-DD")`
- Always guard: `if (isNaN(date.getTime())) return safeDefault;`
- Guard division by zero in time calculations

### Pure utility functions
Core algorithms are pure functions exposed on `window`:
- `window.computeSprintHealth(sprint, today)` → `"On Track" | "At Risk" | "Overloaded"`
- `window.computeTimelinePosition(sprint, cycle)` → `{ left, width }` (percentages)
- `window.computeTodayMarkerPosition(cycle, today)` → number | null
- `window.computeWorkload(sprints, tickets, people)` → sorted workload array
- `window.computePortfolioSummary(projects)` → `{ total, byState }`

---

## Data Layer (`data.jsx`)

### Key globals on `window`
| Variable | Type | Description |
|---|---|---|
| `PEOPLE` | object | Map of person id → `{ id, name, fullName, role, initials }` |
| `PROJECT` | object | Singleton project (ALPS-218) — kept for Dashboard backward compat |
| `PROJECTS` | array | All projects: ALPS-218, ALPS-301, ALPS-302 |
| `SPRINTS` | array | All sprints with `projectId`, `cycle`, `status`, `tickets[]` |
| `CYCLES` | array | Quarterly cycles with `startDate`, `endDate`, `sprints[]` |
| `LINEAR_TICKETS` | object | Map of ticket id → ticket object |
| `GITLAB_ACTIVITY` | array | Commit/MR/branch activity |
| `DISCUSSION_THREAD` | array | Stakeholder discussion entries |
| `TICKET_AI_SUGGESTIONS` | object | AI suggestions per ticket |
| `TICKET_ATTACHMENTS` | object | File attachments per ticket |
| `TICKET_GITLAB_ACTIVITY` | object | GitLab activity per ticket |
| `TICKET_DISCUSSIONS` | object | Discussion threads per ticket |

### Project shape
```js
{
  id, title, summary, requestor, pm, techLead,
  submitted, targetDelivery,
  state,           // "empty" | "in_progress" | "blocked" | "done"
  currentGate,     // 1 | 2 | 3
  gates: { business, product, tech },
  // Each gate: { status, completeness, owner?, dueDate?, clearedOn?, clearedBy?, startedOn?,
  //              checklist: [{ id, label, content, status, aiSuggestion }] }
  // Gate status: "locked" | "in_progress" | "cleared"
  // Checklist item status: "complete" | "warning" | "missing"
  blockers,        // count of blocked tickets
  dependencies,    // string[]
  tags,            // string[]
  changeLog,       // { gate, date, action, by, note }[]
  ticketIds,       // string[] — tickets belonging to this project
  sprintIds,       // string[] — sprints belonging to this project
  completedTickets, totalTickets  // pre-computed for Portfolio_Card
}
```

### Sample projects
- **ALPS-218** — "Recurring Engine — Subscription Billing" — `in_progress`, gate 2 active, 17 tickets
- **ALPS-301** — "Express Payment in Payment Summary" — `in_progress`, gate 2 active, refactor from vanilla HTML + PHP → React + API
- **ALPS-302** — "Favourite Page Optimisation" — `empty` (drafting), gate 1 in progress, refactor from web → Flutter + API

---

## Shared Primitives (`primitives.jsx`)

| Component | Props | Notes |
|---|---|---|
| `Avatar` | `person` (PEOPLE key), `size?` | Renders initials with hashed color |
| `Pill` | `tone?`, `mono?`, `children` | Tones: `neutral`, `info`, `success`, `danger`, `muted` |
| `StateBadge` | `state` | Maps `empty/in_progress/blocked/done` to Pill |
| `GateTriangles` | `gates`, `size?`, `gap?` | Three SVG triangles showing gate status |
| `GateRow` | `gates`, `onSelect?`, `selected?` | Full gate selector row with labels |
| `Section` | `title`, `kicker?`, `right?`, `dense?`, `children` | Card container with header |
| `Button` | `kind?`, `size?`, `icon?`, `onClick`, `disabled?` | Styled button |
| `Icon` | — | Object of SVG icons: `search`, `plus`, `bell`, `inbox`, `archive`, `list`, `audit`, `code`, `sparkle`, `chevron`, `close`, `send`, `branch`, `mr`, `check`, `warn`, `lock`, `link` |

---

## Navigation & App Shell

### Current structure (sidebar — implemented)
The app now uses a **left sidebar** (`<nav className="alps-sidebar">`). The old top header has been removed.

### Target structure (sidebar)
```
.alps-app  (display: flex; flex-direction: row)
├── Sidebar_Nav  (220px, flex-shrink: 0, height: 100vh, position: sticky, top: 0)
│   ├── ALPS wordmark
│   ├── Nav items: Dashboard, Portfolio, Cycles, New Request, Archive
│   └── Role switcher <select>
└── .alps-main  (flex: 1, overflow-y: auto, padding: 24px)
    └── <active screen>
```

### Navigation state in App
```js
const [screen, setScreen] = useState("dashboard");
const [role, setRole] = useState("pm");
const [activeProjectId, setActiveProjectId] = useState(null);
const [fromPortfolio, setFromPortfolio] = useState(false);
```

`fromPortfolio = true` shows a "← Back to Portfolio" button in DashboardScreen.

### Progress.html — standalone ticket detail page

`Progress.html` is a **separate standalone page** (not a screen within the React SPA). It is opened in a new tab when the user clicks **"View Progress & Cycles →"** in the Dashboard's Ticket Status section.

- Self-contained: has its own React root, data constants, and header
- Shows: insight cards, clickable cycle cards, filterable ticket table, slide-in ticket detail panel
- "← Back to Dashboard" button navigates to `ALPS Prototype.html`
- Currently scoped to ALPS-218 data only (not wired to `data.jsx`)

---

## Active Spec

The current feature spec is at `.kiro/specs/portfolio-and-sprints-screens/`. It covers:
- Portfolio Screen + Cycles & Sprints Screen
- Left sidebar navigation
- Multi-project data (ALPS-218, ALPS-301, ALPS-302)
- Sprint Health computation
- Team workload summary
- Proportional cycle timeline

Tasks are in `.kiro/specs/portfolio-and-sprints-screens/tasks.md`.
