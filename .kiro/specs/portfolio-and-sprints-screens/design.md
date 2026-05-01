# Design Document — Portfolio & Sprints Screens

## Overview

This design adds two new screens to the ALPS prototype — a **Portfolio Screen** and a **Cycles & Sprints Screen** — and restructures the app shell from a top horizontal header to a fixed left sidebar navigation. The work touches three files: `data.jsx` (data layer extension), `app.jsx` (shell restructure + new screens), and optionally a new `screens.jsx` if the component count warrants splitting.

Because the project runs without a build step (React via CDN, Babel in-browser, all JSX loaded as `<script type="text/babel">`), every design decision must stay within those constraints: no ES modules, no TypeScript, no bundler. All components are exposed on `window` and consumed via `window.ComponentName`.

### Key Design Goals

1. **Minimal disruption to existing code** — the Dashboard screen and its sub-components are untouched. The sidebar replaces the `<header>` element; the `<main>` element shifts right.
2. **Pure functions for computed values** — Sprint Health and timeline positioning are stateless pure functions, making them independently testable.
3. **Single source of truth for navigation** — `screen` state lives in `App`, passed down to `Sidebar_Nav` and used to conditionally render screens.
4. **Multi-project data** — `data.jsx` is extended with a `PROJECTS` array; the existing `PROJECT` singleton is kept for backward compatibility with the Dashboard screen.

---

## Architecture

### Component Tree (after restructure)

```
App
├── Sidebar_Nav          (fixed left, 220px)
│   ├── [ALPS logo/name]
│   ├── Nav_Item × 5     (Dashboard, Portfolio, Cycles, New Request, Archive)
│   └── Role_Switcher
└── Main_Content         (flex: 1, overflow-y: auto)
    ├── DashboardScreen  (existing, screen === "dashboard")
    ├── PortfolioScreen  (new,      screen === "portfolio")
    ├── CyclesScreen     (new,      screen === "cycles")
    ├── NewRequestScreen (existing stub)
    └── ArchiveScreen    (existing stub)
```

### Layout Shell

The app root switches from `flex-direction: column` (header on top) to `flex-direction: row` (sidebar on left):

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar_Nav │  Main_Content                        │
│  220px fixed │  flex: 1                             │
│              │  overflow-y: auto                    │
│  [ALPS]      │  padding: 24px                       │
│              │                                      │
│  Dashboard   │  <active screen renders here>        │
│  Portfolio ← │                                      │
│  Cycles      │                                      │
│  New Request │                                      │
│  Archive     │                                      │
│              │                                      │
│  [Role ▾]    │                                      │
└──────────────┴──────────────────────────────────────┘
```

The `<header className="alps-header">` element is removed. The `.alps-app` flex direction changes from `column` to `row`. A new `.alps-sidebar` CSS class (already partially defined in the existing style block) is promoted to the primary nav container.

### Navigation State

```
App state:
  screen: "dashboard" | "portfolio" | "cycles" | "new-request" | "archive"
  role: "pm" | "developer" | "techLead" | "requestor"
  activeProjectId: string   // which project the Dashboard shows
  fromPortfolio: boolean    // true when Dashboard was reached via Portfolio click
```

`fromPortfolio` drives the back-navigation control in `DashboardScreen`. When `true`, a "← Back to Portfolio" button is shown at the top of the dashboard; clicking it sets `screen = "portfolio"` and `fromPortfolio = false`.

---

## Components and Interfaces

### `Sidebar_Nav`

```jsx
Sidebar_Nav({ screen, setScreen, role, setRole })
```

Renders the fixed left panel. Contains:
- ALPS wordmark at top (static text or small SVG logo)
- Five `Nav_Item` buttons, each calling `setScreen(id)` on click
- Role switcher `<select>` at the bottom

Active item is highlighted using a distinct background (`var(--alps-accent)` at low opacity + left border accent). Inactive items use `var(--alps-text-muted)`.

Nav items:
| id | label | icon |
|---|---|---|
| `dashboard` | Dashboard | `Icon.list` |
| `portfolio` | Portfolio | `Icon.inbox` |
| `cycles` | Cycles | `Icon.audit` |
| `new-request` | New Request | `Icon.plus` |
| `archive` | Archive | `Icon.archive` |

### `PortfolioScreen`

```jsx
PortfolioScreen({ role, setScreen, setActiveProjectId, setFromPortfolio })
```

Props needed to navigate into a project's dashboard.

Internal state:
- `filter: "all" | "empty" | "in_progress" | "blocked" | "done"` — active state filter

Renders:
1. **Summary_Bar** — counts derived from `window.PROJECTS`
2. **Filter_Control** — segmented control (shown only when `PROJECTS.length > 1`)
3. **Project list** — `Project_Card` per filtered project, or empty state message

### `Summary_Bar`

```jsx
Summary_Bar({ projects })
```

Pure display component. Receives the full projects array and renders:
- Total count
- Count per state: Drafting, In Progress, Blocked, Delivered

Counts are computed inline: `projects.filter(p => p.state === s).length`.

### `Project_Card`

```jsx
Project_Card({ project, onClick })
```

Displays one project row. Reads ticket data from `window.LINEAR_TICKETS` filtered to tickets belonging to this project (via `project.ticketIds` array on the project object — see Data Models).

Rendered fields:
- Project title + ID (as `Pill` with `mono` flag)
- `StateBadge` for current state
- `GateTriangles` for gate progress
- Ticket completion % — `completedTickets / totalTickets * 100`, shown as `"X%"` and a mini progress bar
- Target delivery date
- PM avatar + Tech Lead avatar (using `Avatar` from primitives)
- Blocked ticket count badge (only when `blockedCount > 0`)
- Dependency names as small pills (only when `dependencies.length > 0`)

Clicking anywhere on the card calls `onClick(project.id)`.

### `CyclesScreen`

```jsx
CyclesScreen({ role, setScreen, setActiveProjectId, setFromPortfolio })
```

Navigation props are required to support "View →" links on sprint cards. Internal state:
- `hoveredSprint: string | null` — sprint id for tooltip

Renders:
1. **Workload_Summary** panel (right column, sticky)
2. **Cycle groups** — one per entry in `window.CYCLES`, each containing:
   - Cycle header (name, dates, status badge)
   - `Timeline_Bar` for the cycle
   - `Sprint_Card` per sprint in that cycle

### `Sprint_Card`

```jsx
Sprint_Card({ sprint, health, onViewProject })
```

`health` is pre-computed by the parent using `computeSprintHealth`. `onViewProject` is an optional callback `(projectId: string) => void` — when provided, a "View →" button is rendered that navigates to that project's dashboard.

Renders:
- Sprint name + status badge
- **Project attribution row** — project ID pill, project title (truncated), and "View →" button (only when `sprint.projectId` resolves to a known project in `window.PROJECTS`)
- Date range (`startDate` → `endDate`)
- Progress bar: `completedTickets / totalTickets`
- `Sprint_Health_Badge` showing health label + color

### `Sprint_Health_Badge`

```jsx
Sprint_Health_Badge({ health })
// health: "On Track" | "At Risk" | "Overloaded"
```

Color mapping:
- On Track → `var(--alps-success)` green
- At Risk → `var(--alps-warning)` amber
- Overloaded → `var(--alps-danger)` red

### `Timeline_Bar`

```jsx
Timeline_Bar({ cycle, sprints, today })
```

`today` is a `Date` object (or ISO string) passed in from the parent so the component is pure/testable. Renders a `position: relative` container div. Each sprint becomes an absolutely positioned child div. The today marker is an absolutely positioned vertical line.

Hover state for tooltips is managed in the parent `CyclesScreen` via `hoveredSprint` state; `Timeline_Bar` calls `onSprintHover(sprintId)` / `onSprintLeave()` callbacks.

### `Workload_Summary`

```jsx
Workload_Summary({ workload })
// workload: Array<{ personId, name, role, count }>
// already sorted descending by count, already filtered to count >= 1
```

Renders a list of rows. Each row: `Avatar` + name + role + count badge. If `count > 3`, renders a warning icon (`Icon.warn`) next to the count.

---

## Data Models

### Extended `data.jsx` — `PROJECTS` array

The existing `PROJECT` singleton is kept unchanged for backward compatibility. A new `PROJECTS` array is added containing all three projects. Each project object shape:

```js
{
  id: "ALPS-218",                    // string, unique
  title: "Recurring Engine…",        // string
  summary: "…",                      // string
  requestor: "asha",                 // PEOPLE key
  pm: "rina",                        // PEOPLE key
  techLead: "mateo",                 // PEOPLE key
  submitted: "2026-04-08",           // ISO date string
  targetDelivery: "2026-07-15",      // ISO date string
  state: "in_progress",              // "empty" | "in_progress" | "blocked" | "done"
  currentGate: 2,                    // 1 | 2 | 3
  gates: {
    business: { status, clearedOn?, clearedBy?, completeness, owner?, dueDate?, checklist[] },
    product:  { status, startedOn?, completeness, owner?, dueDate?, checklist[] },
    tech:     { status, completeness, owner?, dueDate?, checklist[] },
  },
  blockers: 0,                       // count of blocked tickets
  dependencies: ["Payments API v3"], // string[]
  tags: ["billing", "platform"],     // string[]
  changeLog: [...],                  // ChangeLog[]
  ticketIds: ["LIN-201", …],         // string[] — tickets belonging to this project
  sprintIds: ["sprint-1", …],        // string[] — sprints belonging to this project
  completedTickets: 4,               // number — pre-computed for Portfolio_Card
  totalTickets: 17,                  // number — pre-computed for Portfolio_Card
}
```

Each gate's `checklist` is an array of items with this shape:

```js
{
  id: "b1",                          // string, unique within gate
  label: "Business Case",            // string — display label
  content: "…",                      // string — editable content (empty string = not filled)
  status: "complete",                // "complete" | "warning" | "missing"
  aiSuggestion: "…" | null,          // AI-generated suggestion text, or null
}
```

The `owner` and `dueDate` fields on each gate are optional metadata displayed in the gate header. The `checklist` array replaces the earlier `criteria: string[]` design — all three projects (ALPS-218, ALPS-301, ALPS-302) use the full checklist shape.

### New Project: "Express Payment in Payment Summary" (ALPS-301)

```js
{
  id: "ALPS-301",
  title: "Express Payment in Payment Summary",
  summary: "Refactor the payment summary page from vanilla HTML + PHP to a React component architecture with an API-driven backend.",
  requestor: "priya", pm: "rina", techLead: "mateo",
  submitted: "2026-05-01", targetDelivery: "2026-08-30",
  state: "in_progress", currentGate: 2,
  gates: {
    business: { status: "cleared", clearedOn: "2026-05-08", clearedBy: "rina", completeness: 100,
                owner: "rina", dueDate: "May 8", checklist: [ /* 4 complete items */ ] },
    product:  { status: "in_progress", startedOn: "2026-05-10", completeness: 45,
                owner: "rina", dueDate: "Jun 5",  checklist: [ /* 2 complete, 2 warning/missing with AI suggestions */ ] },
    tech:     { status: "locked", completeness: 0,
                owner: "mateo", dueDate: "Jul 1", checklist: [ /* 4 missing items with AI suggestions */ ] },
  },
  blockers: 1, dependencies: ["Payments API v3", "Design System v2"],
  tags: ["payments", "refactor", "react"],
  ticketIds: ["LIN-301", "LIN-302", "LIN-303"], sprintIds: ["sprint-5"],
  completedTickets: 1, totalTickets: 3,
}
```

### New Project: "Favourite Page Optimisation" (ALPS-302)

```js
{
  id: "ALPS-302",
  title: "Favourite Page Optimisation",
  summary: "Migrate the Favourites feature from the web platform to a Flutter application with an API backend.",
  requestor: "sven", pm: "rina", techLead: "jun",
  submitted: "2026-05-15", targetDelivery: "2026-09-30",
  state: "empty", currentGate: 1,
  gates: {
    business: { status: "in_progress", startedOn: "2026-05-16", completeness: 30,
                owner: "rina", dueDate: "Jun 10", checklist: [ /* 1 complete, 3 warning/missing with AI suggestions */ ] },
    product:  { status: "locked", completeness: 0,
                owner: "rina", dueDate: "Jul 15", checklist: [ /* 4 missing items with AI suggestions */ ] },
    tech:     { status: "locked", completeness: 0,
                owner: "jun",  dueDate: "Aug 1",  checklist: [ /* 4 missing items with AI suggestions */ ] },
  },
  blockers: 0, dependencies: ["Flutter SDK 3.x", "Favourites API"],
  tags: ["flutter", "mobile", "refactor"],
  ticketIds: ["LIN-401"], sprintIds: [],
  completedTickets: 0, totalTickets: 1,
}
```

### Sprint shape (unchanged, with `projectId` added)

```js
{
  id: "sprint-1",
  name: "Sprint 1 — Foundation",
  cycle: "Q2 2026",
  projectId: "ALPS-218",             // NEW — links sprint to project
  status: "completed",               // "completed" | "in_progress" | "planned"
  startDate: "2026-04-01",
  endDate: "2026-04-14",
  tickets: ["LIN-201", …],           // ticket ids in this sprint
  completedTickets: 4,
  totalTickets: 4,
}
```

### Workload entry (computed, not stored)

```js
{ personId: "jun", name: "Jun Park", role: "Developer — Backend", count: 3 }
```

---

## Key Algorithms

### `computeSprintHealth(sprint, today)`

Pure function. Returns `"On Track" | "At Risk" | "Overloaded"`.

```
Inputs:
  sprint.startDate   ISO date string
  sprint.endDate     ISO date string
  sprint.completedTickets  number
  sprint.totalTickets      number
  sprint.tickets     string[]  (to look up blocked status)
  today              Date

Algorithm:
  1. If sprint.status === "completed" → return "On Track"
  2. If sprint.status === "planned"   → return "On Track"  (not started yet)
  3. Compute elapsedMs  = today - parseDate(sprint.startDate)
  4. Compute totalMs    = parseDate(sprint.endDate) - parseDate(sprint.startDate)
  5. elapsedPct = clamp(elapsedMs / totalMs, 0, 1) * 100
  6. actualPct  = (sprint.completedTickets / sprint.totalTickets) * 100
                  (0 if totalTickets === 0)
  7. blockedCount = sprint.tickets.filter(id =>
       window.LINEAR_TICKETS[id]?.status === "blocked").length
  8. gap = elapsedPct - actualPct
  9. IF blockedCount > 0 OR gap >= 20  → "Overloaded"
     ELSE IF gap > 0 AND gap < 20      → "At Risk"
     ELSE                              → "On Track"
```

The function is exported as `window.computeSprintHealth` so it can be called from both `Sprint_Card` and tests.

### `computeTimelinePosition(sprint, cycle)`

Pure function. Returns `{ left: number, width: number }` as percentages (0–100).

```
Inputs:
  sprint.startDate, sprint.endDate
  cycle.startDate, cycle.endDate

Algorithm:
  cycleMs    = parseDate(cycle.endDate) - parseDate(cycle.startDate)
  sprintStart = clamp(parseDate(sprint.startDate), parseDate(cycle.startDate), parseDate(cycle.endDate))
  sprintEnd   = clamp(parseDate(sprint.endDate),   parseDate(cycle.startDate), parseDate(cycle.endDate))
  left  = (sprintStart - parseDate(cycle.startDate)) / cycleMs * 100
  width = (sprintEnd - sprintStart) / cycleMs * 100
  return { left: clamp(left, 0, 100), width: clamp(width, 0, 100 - left) }
```

Overflow is handled by clamping both endpoints to the cycle boundary before computing percentages. A sprint that starts before the cycle start will have `left = 0`; one that ends after the cycle end will have its width truncated.

### `computeWorkload(sprints, tickets, people)`

Pure function. Returns `Array<{ personId, name, role, count }>` sorted descending by count, filtered to count >= 1.

```
Algorithm:
  1. Filter sprints to status === "in_progress" (active sprints only)
  2. Collect all ticket ids from active sprints
  3. For each ticket id, look up assignee in tickets map
  4. Count tickets per assignee
  5. Map personId → { personId, name, role, count } using people map
  6. Filter to count >= 1
  7. Sort descending by count
```

### `computePortfolioSummary(projects)`

Pure function. Returns `{ total, byState: { empty, in_progress, blocked, done } }`.

```
Algorithm:
  total = projects.length
  byState = projects.reduce((acc, p) => {
    acc[p.state] = (acc[p.state] || 0) + 1;
    return acc;
  }, {})
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Portfolio renders one card per project

*For any* non-empty `PROJECTS` array, the rendered `PortfolioScreen` contains exactly `PROJECTS.length` Project_Card elements.

**Validates: Requirements 1.1**

### Property 2: Project_Card displays all required fields

*For any* valid project object, the rendered `Project_Card` contains the project title, project ID, a state badge, gate triangles, ticket completion percentage, target delivery date, PM avatar, and Tech Lead avatar.

**Validates: Requirements 1.2**

### Property 3: Blocked indicator appears iff blockers > 0

*For any* project object, the `Project_Card` shows a blocked ticket count indicator if and only if `project.blockers > 0`. When `blockers === 0`, no blocked indicator is rendered.

**Validates: Requirements 1.3**

### Property 4: Portfolio summary counts are consistent with project array

*For any* `PROJECTS` array, the counts displayed in the `Summary_Bar` (total, per-state) equal the counts computed directly from the array. Specifically: `computePortfolioSummary(projects).total === projects.length` and each state count equals `projects.filter(p => p.state === s).length`.

**Validates: Requirements 1.5**

### Property 5: Sprint Health classification is exhaustive and correct

*For any* combination of `(elapsedPct, actualPct, blockedCount)` where all values are non-negative, `computeSprintHealth` returns exactly one of `"On Track"`, `"At Risk"`, or `"Overloaded"`, and the returned value satisfies the classification rules:
- `"Overloaded"` iff `blockedCount > 0` OR `(elapsedPct - actualPct) >= 20`
- `"At Risk"` iff `blockedCount === 0` AND `0 < (elapsedPct - actualPct) < 20`
- `"On Track"` iff `blockedCount === 0` AND `actualPct >= elapsedPct`

**Validates: Requirements 3.5, 3.6**

### Property 6: Timeline positions are within cycle bounds

*For any* sprint and its parent cycle, `computeTimelinePosition(sprint, cycle)` returns `{ left, width }` such that `left >= 0`, `width >= 0`, and `left + width <= 100`. Sprints that overflow the cycle boundary are clamped, not clipped to negative values or values exceeding 100.

**Validates: Requirements 5.2, 5.5**

### Property 7: Today marker is proportional to elapsed cycle time

*For any* cycle where `today` falls strictly within `[cycle.startDate, cycle.endDate]`, the today marker position returned by `computeTodayMarkerPosition(cycle, today)` is strictly between 0 and 100, and equals `(today - cycleStart) / (cycleEnd - cycleStart) * 100`.

**Validates: Requirements 5.3**

### Property 8: Workload summary excludes zero-ticket members and is sorted descending

*For any* set of active sprints and tickets, `computeWorkload` returns a list where every entry has `count >= 1` (no zero-ticket members) and the list is sorted in non-increasing order of `count` (i.e., for every adjacent pair `[a, b]`, `a.count >= b.count`).

**Validates: Requirements 4.1, 4.4, 4.5**

### Property 9: Workload warning threshold is correct

*For any* workload entry, the warning indicator is shown if and only if `count > 3`. Entries with `count <= 3` must not show the warning indicator.

**Validates: Requirements 4.3**

---

## Error Handling

### Missing data

- If `window.PROJECTS` is undefined or empty, `PortfolioScreen` renders an empty state message ("No projects found") rather than crashing.
- If `window.CYCLES` is undefined or empty, `CyclesScreen` renders an empty state message.
- If a sprint references a ticket id not present in `window.LINEAR_TICKETS`, that ticket is silently skipped in workload and health computations (defensive lookup: `tickets[id]?.status`).
- If a project references a `pm` or `techLead` key not in `window.PEOPLE`, `Avatar` already handles this gracefully (renders "?" initials).

### Date parsing

- All date strings are ISO format (`YYYY-MM-DD`). `new Date("YYYY-MM-DD")` is used throughout. If a date string is malformed, `new Date(...)` returns `Invalid Date`; timeline and health functions guard against this with `isNaN(date.getTime())` checks and fall back to safe defaults (e.g., `left = 0, width = 0` for timeline; `"On Track"` for health).

### Division by zero

- `computeSprintHealth`: if `totalTickets === 0`, `actualPct = 0`. If `totalMs === 0` (same start and end date), `elapsedPct = 0`.
- `computeTimelinePosition`: if `cycleMs === 0`, returns `{ left: 0, width: 0 }`.
- `Project_Card` ticket completion: if `totalTickets === 0`, displays `"0%"`.

### Navigation edge cases

- If `screen` is set to `"dashboard"` directly from the sidebar (not via Portfolio click), `fromPortfolio` is `false` and no back button is shown. This is the existing behavior.
- If `activeProjectId` is not found in `PROJECTS`, `DashboardScreen` falls back to `window.PROJECT` (the existing singleton) for backward compatibility.
- When navigating to a project's dashboard from the Cycles screen via a sprint card's "View →" button, `fromPortfolio` is set to `false` — no back-to-portfolio button is shown, since the user arrived from Cycles, not Portfolio.

### Progress.html — standalone ticket detail page

`Progress.html` is a **separate standalone HTML page** (not a React screen within the main app) that provides a detailed ticket-level view for a single project. It is self-contained with its own data, React root, and header.

- Accessed by clicking **"View Progress & Cycles →"** in the Dashboard's Ticket Status section — this opens `Progress.html` in a new browser tab (`window.open("Progress.html", "_blank")`).
- Contains: quick insight cards (total, in-progress, overdue, bottleneck), clickable cycle cards that filter the ticket table, a filterable/searchable ticket table, and a slide-in detail panel per ticket.
- Has its own "← Back to Dashboard" button that navigates back to `ALPS Prototype.html`.
- Data in `Progress.html` is currently self-contained (not shared with `data.jsx`) — it uses its own `TICKETS`, `CYCLES`, and `PEOPLE` constants scoped to ALPS-218.

---

## Testing Strategy

### Unit Tests (example-based)

These cover specific scenarios, conditional rendering, and integration points:

- `Sidebar_Nav` renders all 5 nav items
- Active nav item has distinct styling when `screen` matches
- Role switcher preserves value across screen changes
- `Project_Card` renders blocked indicator only when `blockers > 0`
- `Project_Card` renders dependency pills only when `dependencies.length > 0`
- `Sprint_Card` renders "upcoming" label for `status === "planned"`
- `Sprint_Card` renders "completed" label and end date for `status === "completed"`
- `PortfolioScreen` renders empty state when filter matches no projects
- `CyclesScreen` renders today marker only when today is within cycle range
- Tooltip appears on sprint segment hover

### Property-Based Tests

Property-based testing is appropriate here because the core algorithms (`computeSprintHealth`, `computeTimelinePosition`, `computeWorkload`, `computePortfolioSummary`) are pure functions with well-defined input spaces and universal correctness properties.

**Library**: [fast-check](https://github.com/dubzzz/fast-check) (loaded via CDN for in-browser testing, or via npm for a test runner).

**Minimum iterations**: 100 per property test.

**Tag format**: `// Feature: portfolio-and-sprints-screens, Property N: <property text>`

Each property from the Correctness Properties section maps to one property-based test:

| Property | Function under test | Generators |
|---|---|---|
| P1 | `PortfolioScreen` render | `fc.array(arbitraryProject(), { minLength: 1 })` |
| P2 | `Project_Card` render | `arbitraryProject()` |
| P3 | `Project_Card` blocked indicator | `arbitraryProject()` with varying `blockers` |
| P4 | `computePortfolioSummary` | `fc.array(arbitraryProject())` |
| P5 | `computeSprintHealth` | `fc.tuple(fc.float({min:0,max:100}), fc.float({min:0,max:100}), fc.nat({max:5}))` |
| P6 | `computeTimelinePosition` | `arbitrarySprint()`, `arbitraryCycle()` |
| P7 | `computeTodayMarkerPosition` | `arbitraryCycle()`, date within cycle range |
| P8 | `computeWorkload` | `fc.array(arbitrarySprint())`, `fc.dictionary(...)` |
| P9 | `Workload_Summary` warning | `arbitraryWorkloadEntry()` with varying `count` |

**Property reflection** — after reviewing all properties:
- P1 (card count) and P2 (card fields) are complementary, not redundant — P1 tests quantity, P2 tests content.
- P3 (blocked indicator) is a specific case of P2 but tests conditional logic not covered by P2's field presence check — kept separate.
- P8 (zero-ticket exclusion + sort order) combines requirements 4.1, 4.4, and 4.5 into one property since they all concern the output of `computeWorkload` — this is the consolidated form.
- P6 and P7 both test timeline math but on different functions — kept separate.

No redundancies identified after reflection. All 9 properties provide unique validation value.

### Integration / Smoke Tests

- Render `App` and verify `.alps-sidebar` is present and `.alps-header` is absent (Req 6.1)
- Verify `window.PROJECTS` is an array with length >= 3 (Req 7.1, 7.6)
- Verify each project in `PROJECTS` has required fields: `id`, `title`, `state`, `gates`, `pm`, `techLead`, `targetDelivery` (Req 7.2–7.5)

### CSS Layout Verification

The sidebar layout (`display: flex; flex-direction: row` on `.alps-app`) is verified visually. The sidebar is `220px` wide with `flex-shrink: 0`; the main content area has `flex: 1` and `overflow-y: auto`. This is not unit-testable but is covered by visual review during implementation.
