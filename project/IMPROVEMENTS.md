# ALPS Improvements — Cycles Dashboard & Progress.html

## Summary

Improved both the Cycles & Sprints dashboard (`screen-cycles.jsx`) and the standalone Progress page (`Progress.html`) with better UX, filtering, and functionality.

---

## Cycles Dashboard Improvements (`screen-cycles.jsx`)

### 1. **Summary Statistics Header**
- Added 4 metric cards showing: Total Sprints, Active Sprints, Completed Sprints, Average Completion %
- Provides at-a-glance overview of delivery health

### 2. **Search & Filtering**
- **Search bar**: Filter sprints by name (real-time)
- **Project filter**: Dropdown to filter sprints by project (ALPS-218, ALPS-301, ALPS-302)
- **Clear filters button**: Appears when filters are active
- Cycles with no matching sprints are hidden when filtering

### 3. **Expandable Sprint Cards**
- **"+ Details" button**: Click to expand/collapse sprint details
- **Expanded view shows**:
  - In Progress count
  - Blocked count (highlighted in red if > 0)
  - Velocity (completed tickets)
  - List of blocked tickets (up to 3, with "X more" indicator)
- Better visibility into sprint health and blockers

### 4. **Enhanced Sprint Card**
- Shows parent project with "View →" link
- Health badge (On Track / At Risk / Overloaded)
- Progress bar with completion percentage
- Status badge (Active / Completed / Upcoming)
- Date range display

### 5. **Improved Visual Hierarchy**
- Better spacing and grouping
- Consistent use of CSS variables for theming
- Hover states on interactive elements
- Empty states when no sprints match filters

---

## Progress.html Improvements

### 1. **Fixed Data Consistency**
- Updated PROJECT.id from "ALI-42" to "ALPS-218" to match main app
- Updated PEOPLE names to match `data.jsx` (e.g., "Rina Hartono" instead of "Rina Patel")
- Added `useEffect` import for future keyboard shortcut support

### 2. **Planned Enhancements** (Ready to implement)
The following improvements are designed but not yet implemented to avoid breaking the existing file:

#### a. **Keyboard Shortcuts**
- `Escape`: Close detail panel
- `Cmd/Ctrl + K`: Focus search
- `Cmd/Ctrl + F`: Toggle overdue filter

#### b. **Additional Filters**
- **Gate filter**: Filter by business/product/tech gate
- **Overdue checkbox**: Show only overdue tickets
- Better filter composition

#### c. **Sortable Columns**
- Click column headers to sort by: Status, Priority, Due Date, Progress
- Toggle ascending/descending order
- Visual indicators (↑/↓) for active sort

#### d. **Export Functionality**
- **Export to CSV button**: Download filtered tickets as CSV
- Includes all ticket fields
- Filename: `{PROJECT_ID}-tickets-{date}.csv`

#### e. **Enhanced Detail Panel**
- Tabs for: Overview, Git Activity, Discussions
- Better organization of ticket information
- More GitLab integration details

---

## Technical Details

### Files Modified
1. `project/screen-cycles.jsx` — Cycles & Sprints dashboard
2. `project/Progress.html` — Standalone ticket detail page

### New State Variables (Cycles Dashboard)
```javascript
const [expandedSprint, setExpandedSprint] = useState(null);
const [filterProject, setFilterProject] = useState("all");
const [searchQuery, setSearchQuery] = useState("");
```

### New Computed Values
```javascript
const totalSprints = filteredSprints.length;
const activeSprints = filteredSprints.filter(s => s.status === "in_progress").length;
const completedSprints = filteredSprints.filter(s => s.status === "completed").length;
const avgCompletion = /* average completion % across all sprints */;
```

### Component Signature Changes
```javascript
// Before
<Sprint_Card sprint={sprint} health={health} onViewProject={handleViewProject} />

// After
<Sprint_Card 
  sprint={sprint} 
  health={health} 
  onViewProject={handleViewProject}
  expanded={expandedSprint === sprint.id}
  onToggleExpand={() => setExpandedSprint(expandedSprint === sprint.id ? null : sprint.id)}
/>
```

---

## Benefits

### For Product Managers
- Quickly identify blocked sprints and bottlenecks
- Filter by project to focus on specific initiatives
- See team workload at a glance

### For Developers
- Expandable sprint details show blocked tickets immediately
- Search functionality to find specific sprints
- Clear visual indicators for sprint health

### For Tech Leads
- Summary metrics provide delivery health overview
- Project filtering helps track multiple initiatives
- Workload summary shows team capacity

---

## Future Enhancements

### Short-term
1. Implement keyboard shortcuts in Progress.html
2. Add sortable columns to ticket table
3. Add CSV export functionality
4. Add gate filter to Progress.html

### Medium-term
1. Add sprint velocity chart (burndown/burnup)
2. Add team capacity planning view
3. Add sprint retrospective notes
4. Wire Progress.html to use data from main app (via URL params or localStorage)

### Long-term
1. Add drag-and-drop ticket reordering
2. Add inline ticket editing
3. Add real-time collaboration indicators
4. Add sprint planning mode with capacity allocation

---

## Testing Checklist

- [x] Search filters sprints correctly
- [x] Project filter shows only matching sprints
- [x] Clear filters button resets all filters
- [x] Sprint cards expand/collapse on click
- [x] Blocked tickets display in expanded view
- [x] Summary stats calculate correctly
- [x] Empty states show when no matches
- [x] "View →" button navigates to project dashboard
- [x] Workload summary updates based on active sprints
- [x] Timeline bar shows correct sprint positions
- [x] Today marker appears in active cycles
- [x] Hover tooltips show sprint details

---

## Notes

- All improvements follow ALPS coding conventions (inline styles, CSS variables, window exposure)
- No breaking changes to existing functionality
- Backward compatible with existing data structures
- Ready for integration with main app navigation
