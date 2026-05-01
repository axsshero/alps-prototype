# Implementation Plan

## Overview
This task list implements the bugfix for Progress.html data integration using the bug condition methodology. The workflow follows: Explore → Preserve → Implement → Validate.

---

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Progress.html Data Isolation
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Test concrete failing cases - Progress.html loads without data.jsx, uses hardcoded data, cannot switch projects
  - Test that Progress.html does NOT have `<script src="data.jsx">` tag
  - Test that window.PEOPLE, window.SPRINTS, window.LINEAR_TICKETS are undefined when Progress.html loads
  - Test that Progress.html defines its own local PEOPLE, CYCLES, TICKETS constants
  - Test that Progress.html hardcodes PROJECT.id = "ALPS-218" with no projectId parameter support
  - Test that adding a new ticket to data.jsx does NOT appear in Progress.html after reload
  - Test that Progress.html CYCLES use IDs "S11", "S12", "S13", "S14" instead of "sprint-1", "sprint-2" from SPRINTS
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - window.PEOPLE is undefined in Progress.html context
    - Progress.html has 17 hardcoded tickets, data.jsx LINEAR_TICKETS has different tickets
    - No script tag for data.jsx exists in Progress.html
    - No projectId parameter handling exists
    - Cycle IDs don't match between CYCLES and SPRINTS
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - UI Behavior and Visual Consistency
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for all UI interactions
  - Write property-based tests capturing observed behavior patterns
  - Property-based testing generates many test cases for stronger guarantees
  - **Test Cases**:
    - Observe: Clicking a ticket row opens detail panel on right side → Write property test for this behavior
    - Observe: Clicking a cycle card filters ticket table to that cycle → Write property test
    - Observe: Selecting status filter updates ticket table → Write property test
    - Observe: Search input filters tickets by title/ID → Write property test
    - Observe: "← Back to Dashboard" button navigates to ALPS Prototype.html → Write property test
    - Observe: Insight cards show Total Tickets, In Progress, Overdue, Bottleneck → Write property test
    - Observe: Status badges use colors (done=green, in_progress=blue, blocked=red, todo=gray) → Write property test
    - Observe: Overdue tickets show red text with ⚠ icon → Write property test
    - Observe: Detail panel shows Status, Priority, Assignee, Due Date, Gate, Cycle, Description, Git Activity → Write property test
    - Observe: Avatar component renders initials with hashed color → Write property test
    - Observe: Helper functions (isOverdue, statusColor, statusBg, priorityColor) produce specific outputs → Write property test
    - Take screenshots of unfixed Progress.html for visual regression testing
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [-] 3. Fix for Progress.html data integration

  - [x] 3.1 Add data.jsx script dependency to Progress.html
    - Insert `<script type="text/babel" src="data.jsx"></script>` after Babel script tag
    - Position: After `<script src="...babel.min.js"></script>`, before the inline `<script type="text/babel">` block
    - This loads all data.jsx exports (PEOPLE, PROJECTS, SPRINTS, LINEAR_TICKETS, etc.) onto window
    - Verify script loads before Progress.html React code executes
    - _Bug_Condition: isBugCondition(input) where NOT hasScriptTag(input.document, "data.jsx")_
    - _Expected_Behavior: Progress.html SHALL load data.jsx as script dependency and access window.PEOPLE, window.SPRINTS, window.LINEAR_TICKETS_
    - _Preservation: All existing UI rendering, filtering, and interaction logic must remain unchanged_
    - _Requirements: 2.1_

  - [x] 3.2 Implement projectId selection logic
    - Add projectId determination at top of script (before data constants)
    - Check URL query parameter: `const urlParams = new URLSearchParams(window.location.search); const projectIdFromUrl = urlParams.get('projectId');`
    - Fallback to localStorage: `const projectIdFromStorage = localStorage.getItem('alpsActiveProjectId');`
    - Default to "ALPS-218": `const projectId = projectIdFromUrl || projectIdFromStorage || "ALPS-218";`
    - Load PROJECT from window.PROJECTS: `const PROJECT = window.PROJECTS.find(p => p.id === projectId) || window.PROJECT;`
    - _Bug_Condition: isBugCondition(input) where NOT canSwitchProjects(input.document)_
    - _Expected_Behavior: Progress.html SHALL accept projectId via URL param, localStorage, or default to ALPS-218_
    - _Preservation: Default behavior (ALPS-218) must work exactly as before_
    - _Requirements: 2.5, 2.8_

  - [x] 3.3 Remove hardcoded data constants and use shared data
    - Delete local `const PEOPLE = { ... }` definition
    - Replace with: `const PEOPLE = window.PEOPLE;`
    - Delete local `const CYCLES = [ ... ]` definition
    - Delete local `const TICKETS = [ ... ]` definition
    - Keep PROJECT variable but make it dynamic (from step 3.2)
    - _Bug_Condition: isBugCondition(input) where hasLocalDataConstants(input.document, ["PEOPLE", "CYCLES", "TICKETS"])_
    - _Expected_Behavior: Progress.html SHALL use window.PEOPLE instead of local constants_
    - _Preservation: Avatar component and all PEOPLE references must continue to work_
    - _Requirements: 2.1, 2.4_

  - [x] 3.4 Map SPRINTS to CYCLES display format
    - Filter SPRINTS by projectId: `const projectSprints = window.SPRINTS.filter(s => s.projectId === projectId);`
    - Map to CYCLES format: `const CYCLES = projectSprints.map(sprint => ({ id: sprint.id, name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate }));`
    - This creates a CYCLES array compatible with existing UI code
    - _Bug_Condition: isBugCondition(input) where CYCLES use IDs "S11", "S12" instead of sprint IDs from data.jsx_
    - _Expected_Behavior: Progress.html SHALL map SPRINTS to cycle display format using sprint IDs and dates from data.jsx_
    - _Preservation: Cycle card rendering, filtering, and click behavior must remain unchanged_
    - _Requirements: 2.2, 2.7_

  - [x] 3.5 Filter LINEAR_TICKETS by projectId
    - Convert LINEAR_TICKETS object to array: `const allTickets = Object.values(window.LINEAR_TICKETS);`
    - Filter by projectId: `const projectTickets = allTickets.filter(t => t.projectId === projectId);`
    - Map to TICKETS format with schema adaptation:
      ```javascript
      const TICKETS = projectTickets.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        gate: t.gate || "business", // default if missing
        cycle: t.sprintId, // map sprintId to cycle for filtering
        dueDate: t.dueDate || t.created, // fallback to created date
        description: t.description,
        gitlab: t.gitlabIssue || "—", // map gitlabIssue to gitlab
        progress: t.progress || 0,
        blockedBy: t.blockedBy
      }));
      ```
    - _Bug_Condition: isBugCondition(input) where Progress.html displays hardcoded 17 tickets for ALPS-218 only_
    - _Expected_Behavior: Progress.html SHALL filter LINEAR_TICKETS by projectId and display tickets for selected project_
    - _Preservation: Ticket table rendering, filtering, sorting, and detail panel must remain unchanged_
    - _Requirements: 2.3, 2.6, 2.10_

  - [x] 3.6 Update cycle filtering logic to work with sprint IDs
    - In filtered tickets logic, change comparison from `t.cycle === cycle.id` to `t.cycle === cycle.id`
    - Since we mapped `sprintId` to `cycle` in step 3.5, this should work directly
    - Verify cycle card click filtering works with new sprint-based IDs
    - Update cycle name display in detail panel: `const cycleName = CYCLES.find(c => c.id === t.cycle)?.name || t.cycle;`
    - _Bug_Condition: isBugCondition(input) where cycle filtering uses mismatched IDs_
    - _Expected_Behavior: Cycle filtering SHALL work with sprint IDs from data.jsx_
    - _Preservation: Cycle card click behavior and ticket filtering must remain unchanged_
    - _Requirements: 2.7, 3.3_

  - [x] 3.7 Update Dashboard button to pass projectId parameter
    - Open `project/screen-dashboard.jsx`
    - Find the "View Progress & Cycles →" button in the Ticket Status section
    - Change `onClick={() => window.open("Progress.html", "_blank")}` to:
      ```javascript
      onClick={() => window.open(`Progress.html?projectId=${project.id}`, "_blank")}
      ```
    - This passes the current project's ID as a URL parameter
    - _Bug_Condition: isBugCondition(input) where Dashboard button opens Progress.html without projectId_
    - _Expected_Behavior: Dashboard button SHALL pass projectId as URL parameter when opening Progress.html_
    - _Preservation: Button appearance, position, and click behavior must remain unchanged_
    - _Requirements: 2.8_

  - [x] 3.8 Implement ticket editing capability in detail panel
    - Add state for edit mode: `const [isEditing, setIsEditing] = useState(false);`
    - Add state for edited values: `const [editedTicket, setEditedTicket] = useState(null);`
    - Add "Edit" button to detail panel header (next to close button):
      ```javascript
      {!isEditing && (
        <button onClick={() => { setIsEditing(true); setEditedTicket({...t}); }} style={{ padding: "4px 10px", background: "var(--alps-primary)", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
          Edit
        </button>
      )}
      ```
    - Convert read-only fields to editable inputs when `isEditing === true`:
      - Title: `<input type="text" value={editedTicket.title} onChange={...} />`
      - Description: `<textarea value={editedTicket.description} onChange={...} />`
      - Status: `<select value={editedTicket.status} onChange={...}><option>todo</option><option>in_progress</option><option>blocked</option><option>done</option></select>`
      - Priority: `<select value={editedTicket.priority} onChange={...}><option>low</option><option>medium</option><option>high</option><option>critical</option></select>`
      - Assignee: `<select value={editedTicket.assignee} onChange={...}>{Object.keys(PEOPLE).map(k => <option key={k} value={k}>{PEOPLE[k].fullName}</option>)}</select>`
      - Due Date: `<input type="date" value={editedTicket.dueDate} onChange={...} />`
    - Add "Save" and "Cancel" buttons in edit mode
    - _Bug_Condition: isBugCondition(input) where detail panel has no edit capability_
    - _Expected_Behavior: Detail panel SHALL provide edit controls for ticket fields when in edit mode_
    - _Preservation: Read-only detail panel display must remain unchanged when not editing_
    - _Requirements: 2.9_

  - [x] 3.9 Add form validation for ticket editing
    - Validate required fields before save:
      - Title must not be empty: `if (!editedTicket.title.trim()) { alert("Title is required"); return; }`
      - Status must be valid: `if (!["todo", "in_progress", "blocked", "done"].includes(editedTicket.status)) { alert("Invalid status"); return; }`
      - Priority must be valid: `if (!["low", "medium", "high", "critical"].includes(editedTicket.priority)) { alert("Invalid priority"); return; }`
      - Due date must be valid ISO date: `if (editedTicket.dueDate && isNaN(new Date(editedTicket.dueDate).getTime())) { alert("Invalid date format"); return; }`
    - Show inline error messages for invalid fields (red border + error text)
    - Disable Save button when validation fails
    - _Bug_Condition: isBugCondition(input) where ticket editing has no validation_
    - _Expected_Behavior: System SHALL validate ticket edits and show error messages for invalid data_
    - _Preservation: N/A (new functionality)_
    - _Requirements: 3.11_

  - [ ] 3.10 Implement save functionality for ticket edits
    - Add save handler:
      ```javascript
      const handleSave = () => {
        // Validation (from step 3.9)
        if (!editedTicket.title.trim()) { alert("Title is required"); return; }
        
        // Update LINEAR_TICKETS in memory
        const ticketKey = editedTicket.id;
        if (window.LINEAR_TICKETS[ticketKey]) {
          window.LINEAR_TICKETS[ticketKey] = {
            ...window.LINEAR_TICKETS[ticketKey],
            title: editedTicket.title,
            description: editedTicket.description,
            status: editedTicket.status,
            priority: editedTicket.priority,
            assignee: editedTicket.assignee,
            dueDate: editedTicket.dueDate
          };
        }
        
        // Update local TICKETS array
        const ticketIndex = TICKETS.findIndex(t => t.id === editedTicket.id);
        if (ticketIndex !== -1) {
          TICKETS[ticketIndex] = { ...TICKETS[ticketIndex], ...editedTicket };
        }
        
        // Exit edit mode and refresh UI
        setIsEditing(false);
        setSelectedId(null); // Close panel
        setSelectedId(editedTicket.id); // Reopen with updated data
      };
      ```
    - Add cancel handler: `const handleCancel = () => { setIsEditing(false); setEditedTicket(null); };`
    - Wire up Save button: `<button onClick={handleSave}>Save</button>`
    - Wire up Cancel button: `<button onClick={handleCancel}>Cancel</button>`
    - _Bug_Condition: isBugCondition(input) where ticket edits are not persisted_
    - _Expected_Behavior: System SHALL persist ticket changes to data layer and update ticket table view_
    - _Preservation: Ticket table must refresh to show updated values after save_
    - _Requirements: 2.9, 3.12_

  - [ ] 3.11 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Progress.html Data Integration
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify that:
      - Progress.html HAS `<script src="data.jsx">` tag
      - window.PEOPLE, window.SPRINTS, window.LINEAR_TICKETS are defined
      - Progress.html does NOT define local PEOPLE, CYCLES, TICKETS constants
      - Progress.html accepts projectId parameter and loads correct project data
      - Adding a new ticket to data.jsx DOES appear in Progress.html after reload
      - CYCLES are mapped from SPRINTS with correct IDs
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.10_

  - [ ] 3.12 Verify preservation tests still pass
    - **Property 2: Preservation** - UI Behavior and Visual Consistency
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify all UI interactions still work:
      - Clicking ticket row opens detail panel
      - Clicking cycle card filters tickets
      - Status filter updates ticket table
      - Search filters tickets by title/ID
      - Back button navigates to Dashboard
      - Insight cards show correct metrics
      - Status badges use correct colors
      - Overdue tickets show red text with ⚠
      - Detail panel shows all fields
      - Avatar component renders correctly
      - Helper functions produce same outputs
    - Compare screenshots with unfixed version (< 2% pixel difference allowed)
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run all exploration tests (should pass on fixed code)
  - Run all preservation tests (should still pass)
  - Run any unit tests for helper functions
  - Test manual scenarios:
    - Open Progress.html with no parameters → shows ALPS-218 data
    - Open Progress.html?projectId=ALPS-301 → shows ALPS-301 data
    - Open Progress.html?projectId=ALPS-302 → shows ALPS-302 data (or empty state if no tickets)
    - Click "View Progress & Cycles →" from Dashboard → opens with correct projectId
    - Edit a ticket in detail panel → changes persist and table updates
    - Add a new ticket to data.jsx → appears in Progress.html after reload
  - Verify no console errors in browser
  - Verify all existing UI interactions work as before
  - Ask the user if questions arise

---

## Notes

- **Bug Condition**: Progress.html uses hardcoded data instead of loading from data.jsx, preventing multi-project support and causing data divergence
- **Expected Behavior**: Progress.html loads data.jsx, accepts projectId parameter, filters data by project, and maintains all existing UI behavior
- **Preservation**: All UI interactions, filtering, display logic, colors, and visual presentation must remain unchanged for non-buggy inputs (user interactions after data is loaded)

## Testing Approach

1. **Exploration Phase**: Write tests that FAIL on unfixed code to confirm the bug exists
2. **Preservation Phase**: Write tests that PASS on unfixed code to capture baseline behavior
3. **Implementation Phase**: Apply the fix and verify exploration tests now pass
4. **Validation Phase**: Verify preservation tests still pass (no regressions)

## Schema Mapping

| Progress.html (old) | data.jsx (new) | Mapping |
|---------------------|----------------|---------|
| `PEOPLE[key].fullName` | `window.PEOPLE[key].fullName` | Direct |
| `PEOPLE[key].initials` | `window.PEOPLE[key].initials` | Direct |
| `CYCLES[].id` | `SPRINTS[].id` | Map sprint ID to cycle ID |
| `CYCLES[].name` | `SPRINTS[].name` | Direct |
| `TICKETS[].cycle` | `LINEAR_TICKETS[].sprintId` | Map sprintId to cycle |
| `TICKETS[].gitlab` | `LINEAR_TICKETS[].gitlabIssue` | Rename field |
| `PROJECT.id` | `PROJECTS[].id` | Filter by projectId |
