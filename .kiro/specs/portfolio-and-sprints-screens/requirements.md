# Requirements Document

## Introduction

This feature adds two new screens to the ALPS prototype: a **Portfolio Screen** that lists all projects with their status and progress, and a **Cycles & Sprints Overview Screen** that provides a cross-project view of all cycles and sprints for resource management. Both screens integrate with the existing data layer (`data.jsx`) and navigation shell (`app.jsx`).

The app shell is restructured from a top horizontal navigation bar to a **left sidebar navigation panel**, giving the app a persistent, vertical nav that hosts all primary destinations. Clicking a project in the Portfolio screen navigates to the existing single-project Dashboard. The Cycles & Sprints screen surfaces sprint health, team workload, and cycle timelines to help PMs and Tech Leads manage capacity.

The data layer is extended with two additional sample projects — "Express Payment in Payment Summary" (a React + API-driven migration from vanilla HTML + PHP) and "Favourite Page Optimisation" (a Flutter + API backend migration from web) — to give the Portfolio Screen realistic multi-project content.

## Glossary

- **ALPS**: The project visibility and management prototype application.
- **Portfolio_Screen**: The screen that lists all projects with summary information.
- **Project_Card**: A single row or card in the Portfolio Screen representing one project.
- **Dashboard_Screen**: The existing single-project detail screen already implemented in `app.jsx`.
- **Cycles_Screen**: The new screen showing all cycles and their contained sprints.
- **Sprint_Card**: A visual element representing a single sprint within the Cycles Screen.
- **Sprint_Health**: A computed indicator (On Track / At Risk / Overloaded) derived from sprint completion rate and ticket status.
- **Workload_Summary**: A per-person count of assigned tickets across all active sprints.
- **Gate_Progress**: The visual representation of a project's 3-gate progression (Business, Product, Tech).
- **Cycle**: A quarterly grouping of sprints (e.g., Q2 2026).
- **Sprint**: A time-boxed iteration within a cycle containing a set of tickets.
- **Active_Sprint**: A sprint with status `in_progress`.
- **Ticket**: A Linear ticket referenced by a sprint.
- **Sidebar_Nav**: The persistent left-side navigation panel that replaces the top horizontal header nav, containing all primary navigation items and the role switcher.
- **Refactoring_Project**: A project whose primary goal is migrating an existing implementation to a new technology stack without changing end-user functionality.

---

## Requirements

### Requirement 1: Portfolio Screen — Project List

**User Story:** As a PM or stakeholder, I want to see all projects in a single list view, so that I can quickly assess the status and progress of every project at a glance.

#### Acceptance Criteria

1. THE Portfolio_Screen SHALL display a list of all projects from the data layer, with one Project_Card per project.
2. WHEN the Portfolio_Screen is rendered, THE Project_Card SHALL display the project title, project ID, current state badge, gate progress triangles, ticket completion percentage, target delivery date, and assigned PM and Tech Lead avatars.
3. WHEN a project has one or more blocked tickets, THE Project_Card SHALL display a blocked ticket count indicator.
4. WHEN a project has active dependencies, THE Project_Card SHALL display the dependency names.
5. THE Portfolio_Screen SHALL display a summary bar above the project list showing total project count, count of projects in each state (drafting, in progress, blocked, delivered).
6. WHEN the Portfolio_Screen contains more than one project, THE Portfolio_Screen SHALL allow the user to filter projects by state using a segmented control or filter buttons.
7. IF no projects match the active filter, THEN THE Portfolio_Screen SHALL display an empty state message indicating no projects match the selected filter.

### Requirement 2: Portfolio Screen — Project Navigation

**User Story:** As a PM or developer, I want to click on a project in the Portfolio Screen and be taken to its detailed dashboard, so that I can drill into the full project view without losing context.

#### Acceptance Criteria

1. WHEN a user clicks a Project_Card, THE ALPS SHALL navigate to the Dashboard_Screen for the selected project.
2. WHEN the Dashboard_Screen is active after navigation from the Portfolio_Screen, THE ALPS SHALL display a back navigation control that returns the user to the Portfolio_Screen.
3. THE Portfolio_Screen SHALL be accessible from the Sidebar_Nav alongside the existing Dashboard, New Request, and Archive navigation items.

### Requirement 3: Cycles & Sprints Overview Screen — Cycle and Sprint Display

**User Story:** As a PM or Tech Lead, I want to see all cycles and their sprints in one place, so that I can understand the overall delivery timeline and plan resources across quarters.

#### Acceptance Criteria

1. THE Cycles_Screen SHALL display all cycles from the data layer, grouped by cycle name (e.g., Q2 2026, Q3 2026).
2. WHEN a cycle is rendered, THE Cycles_Screen SHALL display the cycle name, start date, end date, and status.
3. WHEN a cycle is rendered, THE Cycles_Screen SHALL display all sprints belonging to that cycle as Sprint_Cards.
4. WHEN a Sprint_Card is rendered, THE Sprint_Card SHALL display the sprint name, date range, status, and a progress bar showing completed tickets out of total tickets.
5. WHEN a Sprint_Card is rendered, THE Sprint_Card SHALL display the Sprint_Health indicator computed from the sprint's completion rate and blocked ticket count.
6. THE Sprint_Health indicator SHALL be "On Track" WHEN the sprint completion rate is at or above the expected rate given elapsed time, "At Risk" WHEN the completion rate is below expected rate by less than 20 percentage points, and "Overloaded" WHEN the sprint has one or more blocked tickets or the completion rate is more than 20 percentage points below expected.
7. WHEN a sprint has status `planned`, THE Sprint_Card SHALL display the sprint as upcoming with its start date.
8. WHEN a sprint has status `completed`, THE Sprint_Card SHALL display the sprint as completed with its end date and final completion rate.
9. WHEN a Sprint_Card is rendered and the sprint has a `projectId`, THE Sprint_Card SHALL display the associated project ID and title, and provide a navigation control to open that project's Dashboard_Screen.

### Requirement 4: Cycles & Sprints Overview Screen — Team Workload Summary

**User Story:** As a Tech Lead or Engineering Manager, I want to see how many tickets each team member owns across active sprints, so that I can identify overloaded individuals and rebalance work.

#### Acceptance Criteria

1. THE Cycles_Screen SHALL display a Workload_Summary panel listing each team member who has at least one ticket assigned in any sprint.
2. WHEN the Workload_Summary is rendered, THE Cycles_Screen SHALL display each person's avatar, name, role, and total assigned ticket count across all active sprints.
3. WHEN a team member has more than 3 tickets assigned in active sprints, THE Workload_Summary SHALL highlight that person's entry with a visual warning indicator.
4. THE Workload_Summary SHALL list team members in descending order of assigned ticket count.
5. WHEN a team member has zero tickets in active sprints, THE Workload_Summary SHALL omit that person from the list.

### Requirement 5: Cycles & Sprints Overview Screen — Cycle Timeline

**User Story:** As a PM, I want to see a visual timeline of cycles and sprints, so that I can understand how sprints are distributed across the quarter and identify scheduling gaps.

#### Acceptance Criteria

1. THE Cycles_Screen SHALL display a horizontal timeline bar for each cycle showing the cycle's start and end dates as the full width of the bar.
2. WHEN the timeline is rendered, THE Cycles_Screen SHALL display each sprint as a proportionally sized segment within its cycle's timeline bar, positioned according to the sprint's start and end dates relative to the cycle.
3. WHEN today's date falls within a cycle's date range, THE Cycles_Screen SHALL display a vertical "today" marker on the timeline at the proportional position corresponding to the current date.
4. WHEN a sprint segment is hovered, THE Cycles_Screen SHALL display a tooltip showing the sprint name, date range, and completion percentage.
5. IF a sprint's date range falls outside its parent cycle's date range, THEN THE Cycles_Screen SHALL display the sprint segment clamped to the cycle boundary and indicate the overflow visually.

### Requirement 6: Navigation Integration — Left Sidebar

**User Story:** As any user, I want the Portfolio and Cycles screens to be accessible from a persistent left sidebar, so that I can switch between views at any time without losing my place.

#### Acceptance Criteria

1. THE ALPS SHALL replace the top horizontal navigation header with a Sidebar_Nav rendered as a fixed left panel.
2. THE Sidebar_Nav SHALL contain navigation items for Dashboard, Portfolio, Cycles, New Request, and Archive, each rendered as a vertically stacked button or link.
3. WHEN a navigation item is active, THE Sidebar_Nav SHALL visually distinguish the active item from inactive items using the existing active navigation style.
4. WHEN the user switches between screens using the Sidebar_Nav, THE ALPS SHALL preserve the previously selected role in the role switcher.
5. THE Sidebar_Nav SHALL display the ALPS application name or logo at the top of the panel.
6. THE Sidebar_Nav SHALL display the role switcher control within the panel, below the navigation items.
7. WHILE the Sidebar_Nav is rendered, THE ALPS main content area SHALL occupy the remaining horizontal space to the right of the sidebar.

### Requirement 7: Sample Data — Multi-Project Portfolio

**User Story:** As a developer or designer working on the prototype, I want the data layer to contain multiple realistic projects, so that the Portfolio Screen can be demonstrated and tested with a representative set of data.

#### Acceptance Criteria

1. THE data layer (`data.jsx`) SHALL contain at least three projects, including the existing "Recurring Engine — Subscription Billing" project.
2. THE data layer SHALL include a Refactoring_Project named "Express Payment in Payment Summary" representing a migration from vanilla HTML and PHP to a React component architecture with an API-driven backend.
3. THE data layer SHALL include a Refactoring_Project named "Favourite Page Optimisation" representing a migration from a web-based implementation to a Flutter application with an API backend.
4. WHEN the "Express Payment in Payment Summary" project is rendered in the Portfolio_Screen, THE Project_Card SHALL display its state, gate progress, assigned team members, and target delivery date.
5. WHEN the "Favourite Page Optimisation" project is rendered in the Portfolio_Screen, THE Project_Card SHALL display its state, gate progress, assigned team members, and target delivery date.
6. THE data layer SHALL expose all projects as an array (e.g., `PROJECTS`) so that the Portfolio_Screen can iterate over them without hardcoding individual project references.

### Requirement 8: Ticket Progress Detail — Standalone Page

**User Story:** As a PM or Tech Lead, I want to drill into a detailed ticket-level view for a project, so that I can see all tickets across cycles with filtering, overdue indicators, and individual ticket details without leaving the context of the project.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL display a "View Progress & Cycles →" button in the Ticket Status section that opens the Progress detail page.
2. WHEN the "View Progress & Cycles →" button is clicked, THE ALPS SHALL open `Progress.html` in a new browser tab, preserving the current dashboard state.
3. THE Progress page SHALL display summary insight cards showing total ticket count, in-progress count, overdue count, and the gate with the most blocked tickets.
4. THE Progress page SHALL display all cycles as clickable cards; clicking a cycle card SHALL filter the ticket table to show only tickets in that cycle.
5. THE Progress page SHALL display all tickets in a table with columns for ticket ID, title, status, priority, gate, due date, and assignee.
6. THE Progress page SHALL allow filtering tickets by cycle, status, priority, and assignee, and searching by ticket ID or title.
7. WHEN a ticket row is clicked, THE Progress page SHALL display a detail panel showing the ticket's full description, git activity, progress, and blocked-by information.
8. THE Progress page SHALL display a "← Back to Dashboard" button that navigates back to `ALPS Prototype.html`.
