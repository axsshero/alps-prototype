// ============================================================
// Pure utility functions for ALPS — Portfolio & Sprints Screens
// ============================================================

// Helper: clamp a value between min and max
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Helper: parse a date value that may be a Date object or ISO string
function parseDate(value) {
  if (value instanceof Date) return value;
  return new Date(value);
}

// ─── Task 2.1 ─────────────────────────────────────────────────────────────────
// computePortfolioSummary(projects)
// Returns { total, byState: { empty, in_progress, blocked, done } }
// Requirements: 1.5

function computePortfolioSummary(projects) {
  const total = projects.length;
  const byState = projects.reduce((acc, p) => {
    acc[p.state] = (acc[p.state] || 0) + 1;
    return acc;
  }, {});
  // Ensure all states are present (default 0)
  return {
    total,
    byState: {
      empty:       byState.empty       || 0,
      in_progress: byState.in_progress || 0,
      blocked:     byState.blocked     || 0,
      done:        byState.done        || 0,
    },
  };
}

// ─── Task 2.3 ─────────────────────────────────────────────────────────────────
// computeSprintHealth(sprint, today)
// Returns "On Track" | "At Risk" | "Overloaded"
// Requirements: 3.5, 3.6

function computeSprintHealth(sprint, today) {
  // Early returns for terminal/not-started statuses
  if (sprint.status === "completed") return "On Track";
  if (sprint.status === "planned")   return "On Track";

  const startDate = new Date(sprint.startDate);
  const endDate   = new Date(sprint.endDate);

  // Guard invalid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "On Track";

  const todayMs  = parseDate(today).getTime();
  const totalMs  = endDate.getTime() - startDate.getTime();

  let elapsedPct;
  if (totalMs === 0) {
    elapsedPct = 0;
  } else {
    elapsedPct = clamp((todayMs - startDate.getTime()) / totalMs, 0, 1) * 100;
  }

  const actualPct = sprint.totalTickets === 0
    ? 0
    : (sprint.completedTickets / sprint.totalTickets) * 100;

  // Count blocked tickets for this sprint using the new filter pattern
  const blockedCount = Object.values(window.LINEAR_TICKETS || {}).filter(
    t => t.sprintId === sprint.id && t.status === "blocked"
  ).length;

  const gap = elapsedPct - actualPct;

  if (blockedCount > 0 || gap >= 20) return "Overloaded";
  if (gap > 0 && gap < 20)           return "At Risk";
  return "On Track";
}

// ─── Task 2.5 ─────────────────────────────────────────────────────────────────
// computeTimelinePosition(sprint, cycle)
// Returns { left: number, width: number } as percentages 0–100
// Requirements: 5.2, 5.5

function computeTimelinePosition(sprint, cycle) {
  const sprintStartRaw = new Date(sprint.startDate);
  const sprintEndRaw   = new Date(sprint.endDate);
  const cycleStart     = new Date(cycle.startDate);
  const cycleEnd       = new Date(cycle.endDate);

  // Guard invalid dates
  if (
    isNaN(sprintStartRaw.getTime()) ||
    isNaN(sprintEndRaw.getTime())   ||
    isNaN(cycleStart.getTime())     ||
    isNaN(cycleEnd.getTime())
  ) {
    return { left: 0, width: 0 };
  }

  const cycleMs = cycleEnd.getTime() - cycleStart.getTime();
  if (cycleMs === 0) return { left: 0, width: 0 };

  // Clamp sprint start/end to cycle boundary
  const sprintStart = Math.max(sprintStartRaw.getTime(), cycleStart.getTime());
  const sprintEnd   = Math.min(sprintEndRaw.getTime(),   cycleEnd.getTime());

  if (sprintEnd <= sprintStart) return { left: 0, width: 0 };

  let left  = (sprintStart - cycleStart.getTime()) / cycleMs * 100;
  let width = (sprintEnd   - sprintStart)           / cycleMs * 100;

  // Clamp both to valid range
  left  = Math.max(0, Math.min(100, left));
  width = Math.max(0, Math.min(100 - left, width));

  return { left, width };
}

// ─── Task 2.7 ─────────────────────────────────────────────────────────────────
// computeTodayMarkerPosition(cycle, today)
// Returns a number (0–100) when today is within cycle range; null when outside
// Requirements: 5.3

function computeTodayMarkerPosition(cycle, today) {
  const cycleStart = new Date(cycle.startDate);
  const cycleEnd   = new Date(cycle.endDate);

  // Guard invalid dates
  if (isNaN(cycleStart.getTime()) || isNaN(cycleEnd.getTime())) return null;

  const cycleMs = cycleEnd.getTime() - cycleStart.getTime();
  if (cycleMs === 0) return null;

  // today can be a Date object or ISO string
  const todayMs = parseDate(today).getTime();
  if (isNaN(todayMs)) return null;

  // Return null when today is outside the cycle range
  if (todayMs < cycleStart.getTime() || todayMs > cycleEnd.getTime()) return null;

  return (todayMs - cycleStart.getTime()) / cycleMs * 100;
}

// ─── Task 2.9 ─────────────────────────────────────────────────────────────────
// computeWorkload(sprints, tickets, people)
// Returns Array<{ personId, name, role, count }> sorted descending by count, filtered to count >= 1
// Requirements: 4.1, 4.4, 4.5

function computeWorkload(sprints, tickets, people) {
  // 1. Filter to active (in_progress) sprints only
  const activeSprints = sprints.filter(s => s.status === "in_progress");

  // 2. Collect all tickets from active sprints using the new filter pattern
  const activeSprintIds = new Set(activeSprints.map(s => s.id));
  const activeTickets = Object.values(tickets).filter(t => activeSprintIds.has(t.sprintId));

  // 3 & 4. Count tickets per assignee
  const countMap = {};
  activeTickets.forEach(ticket => {
    const assignee = ticket.assignee;
    if (assignee) {
      countMap[assignee] = (countMap[assignee] || 0) + 1;
    }
  });

  // 5. Map personId → { personId, name, role, count }
  const workload = Object.keys(countMap).map(personId => ({
    personId,
    name:  people[personId]?.name || personId,
    role:  people[personId]?.role || "",
    count: countMap[personId],
  }));

  // 6. Filter to count >= 1 (already guaranteed by construction, but explicit)
  const filtered = workload.filter(entry => entry.count >= 1);

  // 7. Sort descending by count
  filtered.sort((a, b) => b.count - a.count);

  return filtered;
}

// ─── Expose on window ─────────────────────────────────────────────────────────

Object.assign(window, {
  computePortfolioSummary,
  computeSprintHealth,
  computeTimelinePosition,
  computeTodayMarkerPosition,
  computeWorkload,
});
