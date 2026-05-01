# Implementation Plan: Portfolio & Sprints Screens

## Overview

Extend the ALPS prototype with a Portfolio Screen and a Cycles & Sprints Screen, restructure the app shell from a top header to a fixed left sidebar, and add two new sample projects to the data layer. All code is plain JSX loaded via Babel in-browser — no bundler, no TypeScript, no ES modules. Components are exposed on `window`.

## Tasks

- [x] 1. Extend `data.jsx` — add `PROJECTS` array and new projects
  - Add `ticketIds`, `sprintIds`, `completedTickets`, and `totalTickets` fields to the existing `PROJECT` (ALPS-218) object
  - Add `projectId` field to each existing sprint in `SPRINTS` (link to `"ALPS-218"`)
  - Add new project object `ALPS-301` ("Express Payment in Payment Summary") with all required fields: `id`, `title`, `summary`, `requestor`, `pm`, `techLead`, `submitted`, `targetDelivery`, `state`, `currentGate`, `gates`, `blockers`, `dependencies`, `tags`, `changeLog`, `ticketIds`, `sprintIds`, `completedTickets`, `totalTickets`
  - Add new project object `ALPS-302` ("Favourite Page Optimisation") with all required fields
  - Add a `PROJECTS` array containing all three project objects (ALPS-218, ALPS-301, ALPS-302)
  - Add stub tickets `LIN-301`, `LIN-302`, `LIN-303` (for ALPS-301) and `LIN-401` (for ALPS-302) to `LINEAR_TICKETS`
  - Add sprint `sprint-5` (for ALPS-301, cycle Q3 2026) to `SPRINTS`
  - Expose `PROJECTS` on `window` via `Object.assign(window, { PROJECTS })`
  - _Requirements: 7.1, 7.2, 7.3, 7.6_

- [x] 2. Implement pure utility functions (expose on `window`)
  - [x] 2.1 Implement `computePortfolioSummary(projects)`
    - Returns `{ total, byState: { empty, in_progress, blocked, done } }`
    - Use `projects.reduce` to count per state; `total = projects.length`
    - Expose as `window.computePortfolioSummary`
    - _Requirements: 1.5_

  - [x] 2.2 Write property test for `computePortfolioSummary` (P4)
    - **Property 4: Portfolio summary counts are consistent with project array**
    - Assert `result.total === projects.length` and each `byState[s]` equals `projects.filter(p => p.state === s).length` for all states
    - Use `fc.array(arbitraryProject())` generator
    - **Validates: Requirements 1.5**

  - [x] 2.3 Implement `computeSprintHealth(sprint, today)`
    - Follow the algorithm in the design: handle `completed`/`planned` early-return, compute `elapsedPct` and `actualPct`, count blocked tickets via `window.LINEAR_TICKETS[id]?.status === "blocked"`, classify gap
    - Guard against `totalTickets === 0` (set `actualPct = 0`) and `totalMs === 0` (set `elapsedPct = 0`)
    - Returns `"On Track" | "At Risk" | "Overloaded"`
    - Expose as `window.computeSprintHealth`
    - _Requirements: 3.5, 3.6_

  - [ ] 2.4 Write property test for `computeSprintHealth` (P5)
    - **Property 5: Sprint Health classification is exhaustive and correct**
    - Generate `(elapsedPct, actualPct, blockedCount)` triples; construct a minimal sprint object; assert exactly one of the three labels is returned and it matches the classification rules
    - Use `fc.tuple(fc.float({min:0,max:100}), fc.float({min:0,max:100}), fc.nat({max:5}))`
    - **Validates: Requirements 3.5, 3.6**

  - [x] 2.5 Implement `computeTimelinePosition(sprint, cycle)`
    - Parse ISO date strings with `new Date()`; guard `isNaN` → return `{ left: 0, width: 0 }`
    - Clamp sprint start/end to cycle boundary before computing percentages
    - Guard `cycleMs === 0` → return `{ left: 0, width: 0 }`
    - Returns `{ left: number, width: number }` (percentages 0–100)
    - Expose as `window.computeTimelinePosition`
    - _Requirements: 5.2, 5.5_

  - [ ] 2.6 Write property test for `computeTimelinePosition` (P6)
    - **Property 6: Timeline positions are within cycle bounds**
    - Assert `left >= 0`, `width >= 0`, `left + width <= 100` for any sprint/cycle pair
    - Use `arbitrarySprint()` and `arbitraryCycle()` generators; include overflow cases
    - **Validates: Requirements 5.2, 5.5**

  - [x] 2.7 Implement `computeTodayMarkerPosition(cycle, today)`
    - Returns a percentage (0–100) when `today` is within cycle range; returns `null` when outside
    - Formula: `(today - cycleStart) / (cycleEnd - cycleStart) * 100`
    - Guard `isNaN` and `cycleMs === 0`
    - Expose as `window.computeTodayMarkerPosition`
    - _Requirements: 5.3_

  - [ ] 2.8 Write property test for `computeTodayMarkerPosition` (P7)
    - **Property 7: Today marker is proportional to elapsed cycle time**
    - For any cycle where `today` is strictly within `[startDate, endDate]`, assert result is strictly between 0 and 100 and equals the expected formula
    - **Validates: Requirements 5.3**

  - [x] 2.9 Implement `computeWorkload(sprints, tickets, people)`
    - Filter sprints to `status === "in_progress"`; collect all ticket ids; count per assignee; map to `{ personId, name, role, count }`; filter `count >= 1`; sort descending by count
    - Guard missing ticket ids with optional chaining (`tickets[id]?.assignee`)
    - Expose as `window.computeWorkload`
    - _Requirements: 4.1, 4.4, 4.5_

  - [ ] 2.10 Write property test for `computeWorkload` (P8)
    - **Property 8: Workload excludes zero-ticket members and is sorted descending**
    - Assert every entry has `count >= 1` and adjacent pairs satisfy `a.count >= b.count`
    - Use `fc.array(arbitrarySprint())` and `fc.dictionary(...)` generators
    - **Validates: Requirements 4.1, 4.4, 4.5**

- [x] 3. Checkpoint — verify pure functions before building UI
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Restructure app shell in `app.jsx` — replace header with `Sidebar_Nav`
  - Change `.alps-app` CSS from `flex-direction: column` to `flex-direction: row`
  - Remove the `<header className="alps-header">` element and its inline nav/role-switcher
  - Add `activeProjectId` and `fromPortfolio` to `App` state (both initialised to `null` / `false`)
  - Render `<Sidebar_Nav>` as the first child of `.alps-app`, passing `screen`, `setScreen`, `role`, `setRole`
  - Update `.alps-main` to remove top padding that compensated for the old sticky header
  - Add CSS for `.alps-sidebar` (220px, `flex-shrink: 0`, `height: 100vh`, `position: sticky`, `top: 0`, `overflow-y: auto`)
  - Pass `activeProjectId`, `setActiveProjectId`, `setFromPortfolio`, `fromPortfolio` down to `DashboardScreen` and `PortfolioScreen`
  - _Requirements: 6.1, 6.7_

- [x] 5. Implement `Sidebar_Nav` component
  - Render a `<nav className="alps-sidebar">` with ALPS wordmark at top
  - Render five nav items (Dashboard, Portfolio, Cycles, New Request, Archive) using `Icon.*` from primitives; each calls `setScreen(id)` on click
  - Highlight active item: left border accent + low-opacity accent background; inactive items use `var(--alps-text-muted)`
  - Render `<select>` role switcher at the bottom of the sidebar, bound to `role`/`setRole`
  - Expose as `window.Sidebar_Nav`
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 6. Wire `Sidebar_Nav` into `App` and update screen routing
  - Replace `{screen === "portfolio" && <PortfolioScreen role={role} />}` with the full prop set: `role`, `setScreen`, `setActiveProjectId`, `setFromPortfolio`
  - Add `{screen === "cycles" && <CyclesScreen role={role} />}` to the render block
  - Update `DashboardScreen` call to receive `activeProjectId` and `fromPortfolio`; inside `DashboardScreen`, if `fromPortfolio` is true render a "← Back to Portfolio" button that calls `setScreen("portfolio")` and `setFromPortfolio(false)`; use `window.PROJECTS.find(p => p.id === activeProjectId) || window.PROJECT` as the project source
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 7. Implement `Summary_Bar` component
  - Accept `{ projects }` prop; compute counts inline using `computePortfolioSummary`
  - Render total count and per-state counts (Drafting, In Progress, Blocked, Delivered) as a horizontal row of stat chips
  - Expose as `window.Summary_Bar`
  - _Requirements: 1.5_

- [x] 8. Implement `Project_Card` component
  - Accept `{ project, onClick }` props
  - Render: project title + ID pill (mono), `StateBadge`, `GateTriangles`, ticket completion % with mini progress bar (`project.completedTickets / project.totalTickets`; guard `totalTickets === 0` → show `"0%"`), target delivery date, `Avatar` for `pm` and `techLead`
  - Conditionally render blocked count badge only when `project.blockers > 0`
  - Conditionally render dependency pills only when `project.dependencies.length > 0`
  - Entire card is clickable: `onClick(project.id)` on click
  - Expose as `window.Project_Card`
  - _Requirements: 1.2, 1.3, 1.4_

  - [ ] 8.1 Write property test for `Project_Card` — all required fields present (P2)
    - **Property 2: Project_Card displays all required fields**
    - Render `Project_Card` with an arbitrary valid project; assert title, ID, state badge, gate triangles, ticket %, delivery date, PM avatar, and TL avatar are all present in the output
    - Use `arbitraryProject()` generator
    - **Validates: Requirements 1.2**

  - [ ] 8.2 Write property test for `Project_Card` — blocked indicator iff blockers > 0 (P3)
    - **Property 3: Blocked indicator appears iff blockers > 0**
    - Assert blocked badge is present when `project.blockers > 0` and absent when `project.blockers === 0`
    - Use `arbitraryProject()` with varying `blockers` field
    - **Validates: Requirements 1.3**

- [x] 9. Implement `PortfolioScreen` component
  - Internal state: `filter` (`"all" | "empty" | "in_progress" | "blocked" | "done"`, default `"all"`)
  - Render `Summary_Bar` with `window.PROJECTS`
  - Render filter segmented control only when `window.PROJECTS.length > 1`; each button sets `filter`; active filter button is visually distinguished
  - Compute `filteredProjects = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.state === filter)`
  - Render one `Project_Card` per filtered project; `onClick` calls `setActiveProjectId(id)`, `setFromPortfolio(true)`, `setScreen("dashboard")`
  - Render empty state message ("No projects match the selected filter.") when `filteredProjects.length === 0`
  - Handle `window.PROJECTS` undefined/empty: render "No projects found." message
  - Expose as `window.PortfolioScreen`
  - _Requirements: 1.1, 1.6, 1.7, 2.1, 2.2_

  - [ ] 9.1 Write property test for `PortfolioScreen` — one card per project (P1)
    - **Property 1: Portfolio renders one card per project**
    - Temporarily override `window.PROJECTS` with an arbitrary non-empty array; render `PortfolioScreen` with filter `"all"`; assert the number of rendered `Project_Card` elements equals `PROJECTS.length`
    - Use `fc.array(arbitraryProject(), { minLength: 1 })` generator
    - **Validates: Requirements 1.1**

- [x] 10. Checkpoint — verify Portfolio screen renders correctly end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement `Sprint_Health_Badge` component
  - Accept `{ health }` prop (`"On Track" | "At Risk" | "Overloaded"`)
  - Map health to color: On Track → `var(--alps-success)`, At Risk → `var(--alps-warning)`, Overloaded → `var(--alps-danger)`
  - Render as a small colored pill/badge with the health label
  - Expose as `window.Sprint_Health_Badge`
  - _Requirements: 3.5, 3.6_

- [x] 12. Implement `Sprint_Card` component
  - Accept `{ sprint, health }` props; `health` is pre-computed by parent via `computeSprintHealth`
  - Render: sprint name, date range (`startDate → endDate`), status badge, progress bar (`completedTickets / totalTickets`), `Sprint_Health_Badge`
  - When `sprint.status === "planned"`, render an "Upcoming" label and show `startDate`
  - When `sprint.status === "completed"`, render a "Completed" label and show `endDate` with final completion rate
  - Expose as `window.Sprint_Card`
  - _Requirements: 3.4, 3.5, 3.7, 3.8_

- [x] 13. Implement `Timeline_Bar` component
  - Accept `{ cycle, sprints, today, hoveredSprint, onSprintHover, onSprintLeave }` props
  - Render a `position: relative` container div representing the full cycle width
  - For each sprint, call `computeTimelinePosition(sprint, cycle)` and render an absolutely positioned child div with `left` and `width` as percentages
  - Call `computeTodayMarkerPosition(cycle, today)` and render a vertical line marker only when the result is non-null
  - On sprint segment `onMouseEnter`, call `onSprintHover(sprint.id)`; on `onMouseLeave`, call `onSprintLeave()`
  - When `hoveredSprint === sprint.id`, render a tooltip showing sprint name, date range, and completion %
  - Expose as `window.Timeline_Bar`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 14. Implement `Workload_Summary` component
  - Accept `{ workload }` prop — array of `{ personId, name, role, count }`, already sorted and filtered by `computeWorkload`
  - Render each entry as a row: `Avatar` + name + role + count badge
  - When `count > 3`, render `Icon.warn` next to the count badge
  - Expose as `window.Workload_Summary`
  - _Requirements: 4.2, 4.3_

  - [ ] 14.1 Write property test for `Workload_Summary` — warning threshold (P9)
    - **Property 9: Workload warning threshold is correct**
    - Render `Workload_Summary` with an arbitrary workload entry; assert warning icon is present iff `count > 3`
    - Use `arbitraryWorkloadEntry()` with varying `count` field
    - **Validates: Requirements 4.3**

- [x] 15. Implement `CyclesScreen` component
  - Internal state: `hoveredSprint` (string | null)
  - Compute `today = new Date()`
  - Compute workload via `computeWorkload(window.SPRINTS, window.LINEAR_TICKETS, window.PEOPLE)` and render `Workload_Summary`
  - Render one group per entry in `window.CYCLES`; each group shows cycle name, dates, status badge
  - For each cycle, filter `window.SPRINTS` to sprints whose `cycle` field matches the cycle name; render one `Sprint_Card` per sprint (pre-compute `health` via `computeSprintHealth(sprint, today)`)
  - Render `Timeline_Bar` for each cycle, passing `hoveredSprint`, `onSprintHover`, `onSprintLeave`
  - Handle `window.CYCLES` undefined/empty: render "No cycles found." message
  - Expose as `window.CyclesScreen`
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_

- [x] 16. Final checkpoint — wire everything together and verify
  - Ensure `App` renders `Sidebar_Nav`, `PortfolioScreen`, and `CyclesScreen` correctly with no console errors
  - Verify `.alps-sidebar` is present in the DOM and `.alps-header` is absent
  - Verify `window.PROJECTS` is an array with length >= 3 and each project has `id`, `title`, `state`, `gates`, `pm`, `techLead`, `targetDelivery`
  - Verify clicking a `Project_Card` navigates to `DashboardScreen` and shows the back button
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All components must be exposed on `window` (e.g., `window.Sidebar_Nav = Sidebar_Nav`) — no ES module exports
- The existing `DashboardScreen` and `window.PROJECT` singleton must remain functional throughout; backward compatibility is required
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) loaded via CDN; tag each test with `// Feature: portfolio-and-sprints-screens, Property N: <property text>`
- Pure functions (`computeSprintHealth`, `computeTimelinePosition`, `computeTodayMarkerPosition`, `computeWorkload`, `computePortfolioSummary`) should be implemented and tested before building UI components that depend on them
- Date strings are ISO format (`YYYY-MM-DD`); use `new Date("YYYY-MM-DD")` and guard with `isNaN(date.getTime())`
