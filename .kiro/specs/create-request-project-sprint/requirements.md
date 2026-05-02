# Requirements: create-request-project-sprint

## Functional Requirements

### FR-1: Create New Request
**Description**: Users can create a new request with project metadata (title, summary, requestor, PM, tech lead, target delivery date).

**Acceptance Criteria**:
- User can access "New Request" screen from sidebar navigation
- Form displays all required fields: title, summary, requestor, PM, tech lead, target delivery date
- Form displays optional fields: tags (max 5), dependencies (max 10)
- Form validates input before submission
- On successful submission, new project is added to window.PROJECTS with state "empty" and currentGate 1
- User is navigated to Dashboard showing the newly created project
- Project ID is generated in format "ALPS-{nextNumber}"

**Related Design Sections**: NewRequestScreen, createProject(), validateProjectInput()

---

### FR-2: Create New Sprint
**Description**: Users can create a new sprint within an existing project with name, description, cycle, and date range.

**Acceptance Criteria**:
- User can access sprint creation form from Dashboard (via "Create Sprint" button)
- Form displays all required fields: name, cycle, start date, end date
- Form displays optional field: description
- Form validates input before submission
- On successful submission, new sprint is added to window.SPRINTS
- Parent project's sprintIds array is updated to include new sprint
- Sprint is created with status "planned"
- User is navigated to Cycles screen showing the newly created sprint
- Sprint ID is generated in format "sprint-{timestamp}"

**Related Design Sections**: NewSprintForm, createSprint(), validateSprintInput()

---

### FR-3: Form Validation
**Description**: All form inputs are validated before submission to prevent invalid data from being stored.

**Acceptance Criteria**:
- Project title: 3-100 characters, non-empty, no leading/trailing whitespace
- Project summary: 10-500 characters, non-empty
- Requestor/PM/Tech Lead: must exist as keys in window.PEOPLE
- Target delivery date: valid ISO date, must be >= today
- Sprint name: 3-50 characters, non-empty, no leading/trailing whitespace
- Sprint description: optional, 0-300 characters if provided
- Sprint cycle: 1-30 characters, non-empty
- Sprint dates: valid ISO dates, end date must be > start date, range 1-90 days
- Tags: array of max 5 items, each 1-20 characters
- Dependencies: array of max 10 items, each 1-100 characters
- Validation errors are displayed at field level only after field is touched
- Submit button is disabled if form has validation errors

**Related Design Sections**: validateProjectInput(), validateSprintInput(), FormField

---

### FR-4: Form State Management
**Description**: Form state is managed consistently across all forms with support for touched fields, errors, and submission state.

**Acceptance Criteria**:
- Form tracks which fields have been touched (interacted with)
- Validation errors are only shown for touched fields
- Form tracks submission state (isSubmitting flag)
- Submit button is disabled during submission
- Form can be reset to initial values
- Form tracks field-level errors
- Form tracks overall submission error

**Related Design Sections**: useFormState(), FormField

---

### FR-5: Navigation Integration
**Description**: New request and sprint creation screens are integrated into the existing sidebar navigation and screen routing.

**Acceptance Criteria**:
- "New Request" nav item is visible in sidebar
- Clicking "New Request" navigates to new-request screen
- After creating a request, user is navigated to Dashboard with new project selected
- After creating a sprint, user is navigated to Cycles screen
- "← Back to Portfolio" button works correctly when navigating from Portfolio to Dashboard
- All navigation state is preserved correctly

**Related Design Sections**: App.jsx, Sidebar_Nav, navigation flow

---

### FR-6: Data Persistence
**Description**: Created projects and sprints are stored in window.PROJECTS and window.SPRINTS arrays.

**Acceptance Criteria**:
- New projects are added to window.PROJECTS array
- New sprints are added to window.SPRINTS array
- Project's sprintIds array is updated when sprint is created
- Project structure matches existing project shape (all required fields present)
- Sprint structure matches existing sprint shape (all required fields present)
- Project changeLog includes creation entry
- Data is accessible from all screens after creation

**Related Design Sections**: Data Model Updates, createProject(), createSprint()

---

### FR-7: Discussion & Collaboration
**Description**: Users can view and manage project/sprint discussions, with optional MS Teams thread integration.

**Acceptance Criteria**:
- Discussion panel displays threaded conversation for each project/sprint
- Users can view existing discussion threads from DISCUSSION_THREAD data
- Projects and sprints can have optional MS Teams thread URL/ID stored in metadata
- "Open in Teams" button appears when Teams thread is linked
- Discussion preview shows latest 3 messages in Dashboard/Cycles screens
- Teams thread link can be added/edited from project/sprint details
- Discussion data persists in window.DISCUSSION_THREAD object

**Related Design Sections**: DiscussionPanel, MS Teams Integration

---

## Non-Functional Requirements

### NFR-1: Performance
**Description**: Form operations complete instantly without noticeable delay.

**Acceptance Criteria**:
- Form validation completes in < 50ms
- Project creation completes in < 10ms
- Sprint creation completes in < 10ms
- Form renders without jank or layout shift
- No unnecessary re-renders of form fields

**Related Design Sections**: Performance Considerations

---

### NFR-2: Security
**Description**: All user inputs are validated and sanitized to prevent injection attacks and invalid data.

**Acceptance Criteria**:
- All text inputs are validated for length and content
- Person references (requestor, PM, tech lead) are validated against window.PEOPLE
- Dates are validated to be within reasonable range (not > 10 years in future)
- No sensitive data is stored in form state
- XSS prevention: text fields are sanitized before storage
- No SQL injection risk (no backend calls in prototype)

**Related Design Sections**: Security Considerations, validation functions

---

### NFR-3: Accessibility
**Description**: Forms are accessible to users with assistive technologies.

**Acceptance Criteria**:
- All form fields have associated labels
- Form fields have appropriate ARIA attributes (aria-label, aria-describedby, aria-invalid)
- Error messages are associated with fields via aria-describedby
- Form can be navigated with keyboard only
- Focus is managed correctly (focus moves to first error field on submit)
- Color is not the only indicator of error state (also use text and icons)
- Date inputs use native date picker when available

**Related Design Sections**: FormField component

---

### NFR-4: Usability
**Description**: Forms are intuitive and provide clear feedback to users.

**Acceptance Criteria**:
- Form labels are clear and descriptive
- Placeholder text provides helpful hints
- Required fields are clearly marked
- Error messages are specific and actionable
- Success feedback is provided after creation
- Loading state is shown during submission
- Form can be reset to clear all fields

**Related Design Sections**: FormField, NewRequestScreen, NewSprintForm

---

### NFR-5: Consistency
**Description**: Forms follow existing ALPS design patterns and conventions.

**Acceptance Criteria**:
- Form styling uses CSS variables (--alps-primary, --alps-text, etc.)
- Form components use existing primitives (Button, Section, Avatar)
- Form layout matches existing screens (padding, spacing, typography)
- Error styling matches existing error patterns
- Form behavior matches existing form patterns in the app

**Related Design Sections**: Styling approach, shared primitives

---

## Acceptance Criteria Summary

### Project Creation Workflow
- [ ] User can navigate to "New Request" screen from sidebar
- [ ] Form displays all required and optional fields
- [ ] Form validates all inputs before submission
- [ ] On submit, new project is created with correct structure
- [ ] User is navigated to Dashboard showing new project
- [ ] Project appears in Portfolio screen

### Sprint Creation Workflow
- [ ] User can access sprint creation form from Dashboard
- [ ] Form displays all required and optional fields
- [ ] Form validates all inputs before submission
- [ ] On submit, new sprint is created with correct structure
- [ ] Parent project's sprintIds is updated
- [ ] User is navigated to Cycles screen showing new sprint
- [ ] Sprint appears in Cycles screen with correct project link

### Form Validation
- [ ] All validation rules are enforced
- [ ] Errors are shown only for touched fields
- [ ] Submit button is disabled when form has errors
- [ ] Error messages are specific and actionable

### Data Integrity
- [ ] Created projects have unique IDs
- [ ] Created sprints have unique IDs
- [ ] Project structure matches existing projects
- [ ] Sprint structure matches existing sprints
- [ ] No data is lost or corrupted during creation

### Integration
- [ ] New screens are integrated into sidebar navigation
- [ ] Navigation state is preserved correctly
- [ ] Created data is accessible from all screens
- [ ] No breaking changes to existing screens

---

## Traceability Matrix

| Requirement | Design Section | Task |
|---|---|---|
| FR-1: Create New Request | NewRequestScreen, createProject() | 3.2.2, 3.3.1 |
| FR-2: Create New Sprint | NewSprintForm, createSprint() | 3.2.3, 3.3.2 |
| FR-3: Form Validation | validateProjectInput(), validateSprintInput() | 3.1.1, 3.1.2 |
| FR-4: Form State Management | useFormState(), FormField | 3.1.5, 3.2.1 |
| FR-5: Navigation Integration | App.jsx, Sidebar_Nav | 3.3.1, 3.3.3 |
| FR-6: Data Persistence | createProject(), createSprint() | 3.1.3, 3.1.4 |
| FR-7: Discussion & Collaboration | DiscussionPanel, MS Teams Integration | 3.4.1-3.4.5 |
