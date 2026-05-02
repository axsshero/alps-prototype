# Implementation Plan: Attachments Enhancement (Prototype)

## Overview

This is a **simplified prototype implementation** focusing on data layer and UI/UX components. All testing tasks, error handling edge cases, and responsive behavior testing are excluded per user request. The goal is a working visual prototype with placeholder upload functionality.

**Key Simplifications:**
- No unit tests, integration tests, or manual testing tasks
- No error handling edge cases
- No responsive behavior testing
- No accessibility testing
- Placeholder upload buttons (non-functional)
- Focus on core data structures and visual components

## Tasks

- [x] 1. Extend data layer with attachment data structures
  - Add `PROJECT_ATTACHMENTS` object mapping project IDs to attachment arrays
  - Add `GATE_ATTACHMENTS` object mapping composite keys (projectId-gateId) to attachment arrays
  - Add `SPRINT_ATTACHMENTS` object mapping sprint IDs to attachment arrays
  - Add `description` field to each sprint object in `SPRINTS` array
  - Populate sample data for ALPS-218 and ALPS-301 projects
  - Export all new data structures via `Object.assign(window, { ... })`
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 10.1, 10.2, 10.3, 10.5, 11.1, 11.2, 11.3_

- [ ] 2. Create reusable attachment components
  - [x] 2.1 Create `project/attachments.jsx` file
    - Set up file structure with React imports
    - Add file to load order in `ALPS Prototype.html` after `primitives.jsx`
    - _Requirements: 14.1_
  
  - [x] 2.2 Implement `Attachment_Item` component
    - Display attachment name, type badge, size, uploader avatar, upload time
    - Add file type color coding (PDF=red, Figma=blue, Markdown=light blue, Excel=green, ZIP=gray, Image=amber)
    - Make attachment name clickable (navigates to url)
    - Support compact mode prop
    - _Requirements: 14.2, 14.3, 14.4_
  
  - [x] 2.3 Implement `Attachment_List` component
    - Accept attachments array prop
    - Render each attachment using `Attachment_Item`
    - Show empty message when no attachments
    - Support compact mode prop
    - _Requirements: 14.1, 14.5_
  
  - [x] 2.4 Implement `Attachment_Upload_Placeholder` component
    - Display "+ Add Attachment" button with dashed border
    - Show alert with placeholder message on click
    - Accept entityType and entityId props
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [x] 2.5 Implement `Sprint_Description` component
    - Display sprint description text with proper formatting
    - Show empty message when description is null/empty
    - Support multi-line text with line breaks
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 2.6 Export all components to window
    - Use `Object.assign(window, { ... })` pattern
    - _Requirements: 14.1_

- [ ] 3. Integrate attachments into Dashboard screen
  - [ ] 3.1 Add project attachments section
    - Place after project header, before ticket status section
    - Use `window.Section` wrapper with "Documentation" kicker
    - Display `Attachment_List` with project attachments
    - Add `Attachment_Upload_Placeholder` for projects
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [x] 3.2 Add gate attachments to gate tabs
    - Modify `GateContentBusiness`, `GateContentProduct`, `GateContentTech` functions
    - Add "Gate Attachments" subsection within each gate's content
    - Display `Attachment_List` in compact mode with gate-specific attachments
    - Add `Attachment_Upload_Placeholder` for gates
    - Use composite key format: `${project.id}-business`, `${project.id}-product`, `${project.id}-tech`
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [x] 4. Integrate attachments into Cycles screen
  - [x] 4.1 Add sprint descriptions to sprint cards
    - Modify `Sprint_Card` component
    - Display `Sprint_Description` after header, before progress bar
    - Only show if sprint has description
    - _Requirements: 7.1, 7.4_
  
  - [x] 4.2 Add sprint attachments to expanded view
    - Add "Sprint Attachments" section in expanded sprint card details
    - Display `Attachment_List` in compact mode with sprint attachments
    - Add `Attachment_Upload_Placeholder` for sprints
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 5. Integrate attachments into Progress.html
  - [x] 5.1 Add attachments.jsx script tag to Progress.html
    - Load after `primitives.jsx`, before main app script
    - _Requirements: 8.1_
  
  - [x] 5.2 Add ticket attachments to detail panel
    - Modify `DetailPanel` component (or equivalent ticket detail view)
    - Add "Test Evidence & Attachments" field after Git Activity
    - Display `Attachment_List` in compact mode with ticket attachments
    - Add `Attachment_Upload_Placeholder` for tickets (only for developers)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.2, 8.3, 8.4, 8.5_

- [ ] 6. Final checkpoint - Visual verification
  - Open ALPS Prototype.html and verify all attachment sections render correctly
  - Check Dashboard: project attachments and gate attachments visible
  - Check Cycles: sprint descriptions and sprint attachments visible
  - Open Progress.html and verify ticket attachments visible
  - Verify upload placeholders show appropriate messages
  - Verify file type badges show correct colors
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This is a **prototype-only** implementation - no backend integration
- Upload buttons are placeholders that show alert messages
- All attachment data is pre-populated in `data.jsx`
- Testing tasks excluded per user request
- Focus is on visual design and component reusability
- Each task references specific requirements for traceability
