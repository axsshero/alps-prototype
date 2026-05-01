# Progress.html Data Integration Bugfix Design

## Overview

Progress.html currently operates as an isolated standalone page with hardcoded data constants that duplicate and diverge from the shared data.jsx file used by the main ALPS application. This creates data inconsistency and prevents Progress.html from functioning as a reusable project detail view. The fix will integrate Progress.html with data.jsx by loading it as a script dependency, mapping SPRINTS to cycle display format, filtering LINEAR_TICKETS by projectId, and handling schema differences between the two data structures. The approach maintains all existing UI behavior while enabling multi-project support and automatic data synchronization.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Progress.html uses its own hardcoded data constants instead of loading from data.jsx
- **Property (P)**: The desired behavior - Progress.html should load data.jsx and use shared data structures (PEOPLE, SPRINTS, LINEAR_TICKETS) filtered by projectId

- **Preservation**: All existing UI interactions, filtering, display logic, and visual presentation must remain unchanged
- **Progress.html**: The standalone HTML file at `project/Progress.html` that displays ticket detail view with insight cards, cycle cards, and filterable ticket table
- **data.jsx**: The shared data file at `project/data.jsx` that contains PEOPLE, SPRINTS, LINEAR_TICKETS, and other data structures exposed on window
- **SPRINTS**: The array in data.jsx with structure `{ id, name, cycle, projectId, status, startDate, endDate, completedTickets, totalTickets }`
- **CYCLES (Progress.html)**: The hardcoded array in Progress.html with structure `{ id, name, startDate, endDate }` using IDs like "S11", "S12"
- **LINEAR_TICKETS**: The object in data.jsx mapping ticket IDs to full ticket objects with extended schema
- **TICKETS (Progress.html)**: The hardcoded array in Progress.html with simplified ticket structure
- **projectId**: The identifier used to filter data for a specific project (e.g., "ALPS-218", "ALPS-301", "ALPS-302")

## Bug Details

### Bug Condition

The bug manifests when Progress.html is loaded and uses its own isolated data constants instead of loading from the shared data.jsx file. This causes data divergence where updates to data.jsx don't reflect in Progress.html, and Progress.html cannot display data for projects other than ALPS-218.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PageLoadEvent for Progress.html
  OUTPUT: boolean
  
  RETURN NOT hasScriptTag(input.document, "data.jsx")
         AND hasLocalDataConstants(input.document, ["PEOPLE", "CYCLES", "TICKETS"])
         AND NOT canSwitchProjects(input.document)
END FUNCTION
```

### Examples

- **Example 1**: User opens Progress.html → sees 17 hardcoded tickets for ALPS-218 → developer adds new ticket LIN-218 to data.jsx → Progress.html still shows only 17 tickets (data divergence)
- **Example 2**: User wants to view progress for ALPS-301 → opens Progress.html → sees ALPS-218 data instead because projectId is hardcoded
- **Example 3**: Developer updates PEOPLE in data.jsx to add `role` field → Progress.html still uses old structure with only `fullName` and `initials`
- **Example 4**: SPRINTS in data.jsx uses IDs "sprint-1", "sprint-2" → Progress.html CYCLES uses IDs "S11", "S12" → no mapping exists between the two
- **Edge case**: Progress.html tries to display cycle "S11" → no corresponding sprint exists in SPRINTS array → cycle card shows incorrect or missing data

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- The ticket table must continue to display columns: Ticket ID, Title, Status, Priority, Gate, Due Date, Owner
- Clicking a ticket row must continue to open the detail panel on the right side
- Clicking a cycle card must continue to filter the ticket table to show only tickets from that cycle
- The header must continue to show project ID and title
- The "← Back to Dashboard" button must continue to navigate to ALPS Prototype.html
- Insight cards must continue to show Total Tickets, In Progress, Overdue, and Bottleneck metrics
- Filters (cycle, status, priority, assignee, search) must continue to filter the ticket table
- Status badges must continue to use the same color coding (done=green, in_progress=blue, blocked=red, todo=gray)
- Overdue tickets must continue to be highlighted with red text and warning icon
- The detail panel must continue to show Status, Priority, Assignee, Due Date, Linked Gate, Cycle, Description, and Git Activity sections
- All helper functions (isOverdue, statusColor, statusBg, priorityColor) must continue to work with the same logic
- The Avatar component must continue to render initials with hashed color

**Scope:**
All inputs that do NOT involve data loading (user interactions, filtering, clicking, scrolling) should be completely unaffected by this fix. This includes:
- Mouse clicks on cycle cards, ticket rows, filter dropdowns
- Keyboard input in the search box
- Visual rendering of components (colors, spacing, typography)
- Responsive layout behavior

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Missing Script Dependency**: Progress.html does not include a `<script type="text/babel" src="data.jsx"></script>` tag before its own React code, so it cannot access window.PEOPLE, window.SPRINTS, or window.LINEAR_TICKETS

2. **Hardcoded Data Constants**: Progress.html defines its own PEOPLE, CYCLES, TICKETS, and PROJECT constants that shadow the shared data structures from data.jsx

3. **Schema Mismatch**: Progress.html uses a simplified ticket structure (missing techSpecs, acceptanceCriteria, gitlabIssue fields) and a different cycle structure (CYCLES vs SPRINTS with different ID formats)

4. **No Project Selection Logic**: Progress.html hardcodes PROJECT.id = "ALPS-218" with no mechanism to accept a projectId parameter via URL query string or localStorage

5. **Cycle ID Mapping Gap**: Progress.html CYCLES use IDs like "S11", "S12" while data.jsx SPRINTS use IDs like "sprint-1", "sprint-2" with no mapping logic to connect them

6. **Missing ProjectId Parameter Passing**: The Dashboard's "View Progress & Cycles →" button opens Progress.html without passing the current projectId as a URL parameter, so Progress.html cannot auto-filter to the correct project

7. **No Ticket Editing Capability**: Progress.html detail panel displays ticket information in read-only mode with no edit controls or save functionality

8. **Missing Project Association**: Hardcoded tickets and cycles in Progress.html lack projectId references, preventing proper filtering and association with parent projects

## Correctness Properties

Property 1: Bug Condition - Data Integration

_For any_ page load of Progress.html where data.jsx is loaded as a script dependency and a projectId is provided (via URL query param, localStorage, or default), the page SHALL use PEOPLE from window.PEOPLE, filter LINEAR_TICKETS by projectId, map SPRINTS to cycle display format, and render all UI components with the shared data.

**Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 2.10**

Property 2: Preservation - UI Behavior

_For any_ user interaction that does NOT involve initial data loading or ticket editing (clicking tickets, filtering, searching, opening detail panel in read mode), the fixed Progress.html SHALL produce exactly the same visual output and behavior as the original Progress.html, preserving all existing UI interactions, color coding, layout, and helper function logic.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12**

Property 3: Ticket Editing

_For any_ ticket edit operation where a user modifies ticket fields (title, description, status, priority, assignee, due date) in the detail panel, the system SHALL validate the input, persist the changes to the data layer, and update the ticket table view to reflect the new values.

**Validates: Requirements 2.9, 3.11, 3.12**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `project/Progress.html`

**Specific Changes**:

1. **Add Script Dependency**: Insert `<script type="text/babel" src="data.jsx"></script>` before the existing `<script type="text/babel">` block that contains the React code
   - Position: After Babel script tag, before the inline React script
   - This loads all data.jsx exports onto window before Progress.html code executes

2. **Remove Hardcoded Data Constants**: Delete the local definitions of PEOPLE, CYCLES, TICKETS, and PROJECT
   - Remove lines defining `const PEOPLE = { ... }`
   - Remove lines defining `const CYCLES = [ ... ]`
   - Remove lines defining `const TICKETS = [ ... ]`
   - Keep `const PROJECT = { ... }` but modify it to be dynamically loaded

3. **Add Project Selection Logic**: Implement projectId determination at the top of the script
   - Check URL query parameter: `new URLSearchParams(window.location.search).get('projectId')`
   - Fallback to localStorage: `localStorage.getItem('alpsActiveProjectId')`
   - Default to "ALPS-218" if neither is present
   - Load PROJECT from window.PROJECTS array: `window.PROJECTS.find(p => p.id === projectId)`

4. **Map SPRINTS to CYCLES Format**: Create a mapping function to convert SPRINTS to the cycle display format
   - Filter SPRINTS by projectId: `window.SPRINTS.filter(s => s.projectId === projectId)`
   - Map to CYCLES format: `{ id: sprint.id, name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate }`
   - Store in a `CYCLES` variable for use in the UI

5. **Filter LINEAR_TICKETS by Project**: Create a TICKETS array from LINEAR_TICKETS filtered by projectId
   - Convert LINEAR_TICKETS object to array: `Object.values(window.LINEAR_TICKETS)`
   - Filter by projectId: `.filter(t => t.projectId === projectId)`
   - Map to simplified structure if needed, or adapt UI to use full schema

6. **Update PEOPLE Reference**: Change PEOPLE references to use window.PEOPLE
   - Replace `const PEOPLE = { ... }` with `const PEOPLE = window.PEOPLE`
   - Update Avatar component to handle extended schema (id, name, fullName, role, initials)

7. **Handle Schema Differences**: Adapt ticket rendering to handle LINEAR_TICKETS schema
   - Map `sprintId` to `cycle` for filtering logic
   - Handle optional fields: `techSpecs`, `acceptanceCriteria`, `gitlabIssue`
   - Map `gitlabIssue` to `gitlab` for display (or vice versa)
   - Ensure `blockedBy` field is preserved for blocked tickets

8. **Update Cycle Filtering Logic**: Modify cycle filter to work with sprint IDs
   - Change filter comparison from `t.cycle === cycle.id` to `t.sprintId === cycle.id`
   - Or add a mapping layer to convert between cycle IDs and sprint IDs

9. **Add ProjectId URL Parameter Passing**: Update Dashboard's "View Progress & Cycles →" button
   - Modify the button in screen-dashboard.jsx to pass projectId as URL parameter
   - Change href from `"Progress.html"` to `"Progress.html?projectId=" + activeProjectId`
   - Ensure Progress.html reads this parameter on load

10. **Implement Ticket Editing in Detail Panel**: Add edit mode to the DetailPanel component
   - Add "Edit" button to detail panel header
   - Convert read-only fields to editable inputs when in edit mode
   - Add form validation for required fields (title, status, priority)
   - Add "Save" and "Cancel" buttons in edit mode
   - Implement save handler to update LINEAR_TICKETS in memory (or persist to backend if available)
   - Update ticket table view after successful save

11. **Ensure Project Association**: Verify all data structures include projectId
   - Confirm LINEAR_TICKETS entries have projectId field
   - Confirm SPRINTS entries have projectId field
   - Use projectId for all filtering operations

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that attempt to load Progress.html and verify it uses data.jsx. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Script Dependency Test**: Open Progress.html in browser, check if window.PEOPLE, window.SPRINTS, window.LINEAR_TICKETS are defined (will fail on unfixed code - these will be undefined)
2. **Data Divergence Test**: Add a new ticket to data.jsx, reload Progress.html, verify the new ticket appears (will fail on unfixed code - ticket won't appear)
3. **Multi-Project Test**: Try to load Progress.html with projectId=ALPS-301 via URL parameter, verify ALPS-301 data is shown (will fail on unfixed code - still shows ALPS-218)
4. **Schema Compatibility Test**: Check if Progress.html can render tickets with techSpecs and acceptanceCriteria fields from LINEAR_TICKETS (may fail on unfixed code - fields are missing)

**Expected Counterexamples**:
- window.PEOPLE, window.SPRINTS, window.LINEAR_TICKETS are undefined when Progress.html loads
- Possible causes: missing script tag, incorrect load order, script not executing

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL projectId IN ["ALPS-218", "ALPS-301", "ALPS-302"] DO
  result := loadProgressHtml(projectId)
  ASSERT result.usesSharedData = true
  ASSERT result.tickets = filterTicketsByProject(LINEAR_TICKETS, projectId)
  ASSERT result.cycles = mapSprintsToCycles(SPRINTS, projectId)
  ASSERT result.people = window.PEOPLE
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL userInteraction IN [clickTicket, filterByStatus, searchTickets, clickCycle, openDetailPanel] DO
  ASSERT renderOutput_original(userInteraction) = renderOutput_fixed(userInteraction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for all UI interactions, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Ticket Table Rendering**: Observe that clicking a ticket row opens the detail panel on unfixed code, then write test to verify this continues after fix
2. **Filter Behavior**: Observe that selecting a status filter updates the ticket table on unfixed code, then write test to verify this continues after fix
3. **Cycle Card Interaction**: Observe that clicking a cycle card filters tickets on unfixed code, then write test to verify this continues after fix
4. **Visual Consistency**: Take screenshots of unfixed Progress.html, compare pixel-by-pixel with fixed version to ensure visual parity

### Unit Tests

- Test projectId determination logic (URL param, localStorage, default)
- Test SPRINTS to CYCLES mapping function with various sprint configurations
- Test LINEAR_TICKETS filtering by projectId
- Test schema adaptation for tickets (sprintId → cycle, gitlabIssue → gitlab)
- Test Avatar component with extended PEOPLE schema (id, name, fullName, role, initials)
- Test helper functions (isOverdue, statusColor, statusBg, priorityColor) with new data structure
- Test ticket edit validation logic (required fields, valid status values, date formats)
- Test ticket save handler (updates LINEAR_TICKETS, refreshes UI)
- Test Dashboard button URL generation with projectId parameter

### Property-Based Tests

- Generate random projectIds and verify Progress.html loads correct data for each
- Generate random ticket configurations and verify filtering logic works correctly
- Generate random user interactions (clicks, filters, searches) and verify UI behavior is preserved
- Generate random SPRINTS arrays and verify mapping to CYCLES format is correct

### Integration Tests

- Test full page load flow: load Progress.html → verify data.jsx loaded → verify correct project data displayed
- Test project switching: load Progress.html with projectId=ALPS-218 → switch to ALPS-301 → verify data updates
- Test data synchronization: update data.jsx → reload Progress.html → verify changes reflected
- Test backward compatibility: verify Progress.html works with ALPS-218 data (default project)
- Test edge cases: empty project (no tickets), project with no sprints, project with blocked tickets
- Test Dashboard navigation: click "View Progress & Cycles →" from Dashboard → verify Progress.html opens with correct projectId parameter
- Test ticket editing flow: open detail panel → click Edit → modify fields → click Save → verify changes persist and table updates
- Test edit validation: attempt to save ticket with invalid data → verify error messages shown and save prevented
