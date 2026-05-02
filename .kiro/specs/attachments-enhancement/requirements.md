# Requirements Document

## Introduction

This document specifies the requirements for adding comprehensive attachment capabilities to the ALPS (Agile Lifecycle & Project Steering) project management prototype. The feature extends the existing ticket-level attachment functionality to support file attachments at multiple entity levels: projects, gates, sprints, and tickets. Additionally, sprints will gain a description field for objectives and goals.

The ALPS application is a React-based prototype (React 18 via CDN, no build step) that helps teams track projects through a 3-gate validation process (Business → Product → Tech), manage sprints and cycles, and surface AI-generated suggestions. The current implementation includes a basic attachment structure (`TICKET_ATTACHMENTS` object) that maps ticket IDs to attachment arrays.

## Glossary

- **ALPS**: Agile Lifecycle & Project Steering — the project management prototype application
- **Attachment_System**: The file attachment management functionality being added to ALPS
- **Project**: A work initiative tracked in ALPS with a unique ID (e.g., ALPS-218)
- **Gate**: One of three validation checkpoints (Business Gate, Product Gate, Tech Gate) that projects pass through
- **Sprint**: A time-boxed development cycle (typically 2 weeks) containing tickets
- **Ticket**: A work item (e.g., LIN-201) assigned to a sprint with status tracking
- **Test_Evidence**: Files uploaded by developers to demonstrate ticket completion (screenshots, test reports, QA sign-offs)
- **Attachment_Metadata**: Information about an uploaded file including id, name, type, size, uploadedBy, uploadedAt, url
- **Data_Layer**: The `data.jsx` file containing all sample data exposed on `window` object
- **User_Role**: One of four roles in ALPS: PM (Product Manager), Tech Lead, Developer, Requestor

## Requirements

### Requirement 1: Project-Level Attachments

**User Story:** As a PM or Tech Lead, I want to attach files to projects, so that I can store business cases, proposals, and architecture documents at the project level.

#### Acceptance Criteria

1. THE Attachment_System SHALL store project attachments in a `PROJECT_ATTACHMENTS` object mapping project IDs to attachment arrays
2. WHEN a user views a project in the Dashboard, THE Attachment_System SHALL display all project-level attachments in a dedicated section
3. THE Attachment_System SHALL support attachment metadata including id, name, type, size, uploadedBy, uploadedAt, and url for each project attachment
4. WHEN a PM or Tech Lead uploads a file to a project, THE Attachment_System SHALL add the attachment to the project's attachment array with complete metadata
5. THE Attachment_System SHALL allow users to view and download project attachments via the url field

### Requirement 2: Gate-Level Attachments

**User Story:** As a PM or Tech Lead, I want to attach files to each of the three gates, so that I can store approval documents, gate review notes, and compliance documentation specific to each gate.

#### Acceptance Criteria

1. THE Attachment_System SHALL store gate attachments in a `GATE_ATTACHMENTS` object mapping composite keys (projectId + gateId) to attachment arrays
2. WHEN a user views a gate checklist in the Dashboard, THE Attachment_System SHALL display all gate-specific attachments within that gate's section
3. THE Attachment_System SHALL support separate attachment lists for Business Gate, Product Gate, and Tech Gate within each project
4. WHEN a PM or Tech Lead uploads a file to a gate, THE Attachment_System SHALL add the attachment to that gate's attachment array with complete metadata
5. THE Attachment_System SHALL maintain attachment isolation between gates (Business Gate attachments SHALL NOT appear in Product Gate or Tech Gate)

### Requirement 3: Sprint Description Field

**User Story:** As a PM or Tech Lead, I want to add a description to each sprint, so that I can document sprint objectives, goals, and focus areas.

#### Acceptance Criteria

1. THE Data_Layer SHALL add a `description` field to each sprint object in the `SPRINTS` array
2. WHEN a user views a sprint card in the Cycles screen, THE Attachment_System SHALL display the sprint description if present
3. THE Data_Layer SHALL support empty description fields (empty string or null) for sprints without documented objectives
4. WHEN a sprint is expanded in the Cycles screen, THE Attachment_System SHALL show the full description text with proper formatting
5. THE Data_Layer SHALL preserve description content across sprint status changes (planned → in_progress → completed)

### Requirement 4: Sprint-Level Attachments

**User Story:** As a PM or Tech Lead, I want to attach files to sprints, so that I can store sprint planning documents, retrospective notes, and sprint-specific artifacts.

#### Acceptance Criteria

1. THE Attachment_System SHALL store sprint attachments in a `SPRINT_ATTACHMENTS` object mapping sprint IDs to attachment arrays
2. WHEN a user views an expanded sprint card in the Cycles screen, THE Attachment_System SHALL display all sprint-level attachments
3. THE Attachment_System SHALL support attachment metadata including id, name, type, size, uploadedBy, uploadedAt, and url for each sprint attachment
4. WHEN a PM or Tech Lead uploads a file to a sprint, THE Attachment_System SHALL add the attachment to the sprint's attachment array with complete metadata
5. THE Attachment_System SHALL allow users to view and download sprint attachments via the url field

### Requirement 5: Ticket Test Evidence Attachments

**User Story:** As a Developer, I want to update the feature details, and upload test evidence for tickets, so that I can demonstrate completion with screenshots, test reports, and QA sign-offs.

#### Acceptance Criteria

1. THE Attachment_System SHALL extend the existing `TICKET_ATTACHMENTS` object to support test evidence uploads, feature description 
2. WHEN a Developer views a ticket in Progress.html, THE Attachment_System SHALL display an upload interface for test evidence
3. THE Attachment_System SHALL support attachment metadata including id, name, type, size, uploadedBy, uploadedAt, and url for each test evidence file
4. WHEN a Developer uploads test evidence to a ticket, THE Attachment_System SHALL add the attachment to the ticket's attachment array with complete metadata
5. THE Attachment_System SHALL allow all user roles to view and download ticket test evidence via the url field
6. WHEN a person click on the ticket, the ticket should open in a popup and with option open in a new tab in full page

### Requirement 6: Attachment Display in Dashboard

**User Story:** As a PM, I want to see all project and gate attachments in the Dashboard screen, so that I can quickly access relevant documentation while reviewing project status.

#### Acceptance Criteria

1. WHEN a user views the Dashboard screen, THE Attachment_System SHALL display project-level attachments in a dedicated section below the project header
2. WHEN a user views a gate checklist, THE Attachment_System SHALL display gate-specific attachments within that gate's tab content
3. THE Attachment_System SHALL show attachment metadata (name, type, size, uploadedBy, uploadedAt) for each displayed attachment
4. THE Attachment_System SHALL provide visual indicators for attachment types (PDF, Figma, Markdown, ZIP, Excel, etc.)
5. THE Attachment_System SHALL support clickable attachment names that navigate to the url field

### Requirement 7: Attachment Display in Cycles Screen

**User Story:** As a Tech Lead, I want to see sprint descriptions and attachments in the Cycles screen, so that I can review sprint objectives and access sprint planning documents.

#### Acceptance Criteria

1. WHEN a user views a sprint card in the Cycles screen, THE Attachment_System SHALL display the sprint description if present
2. WHEN a user expands a sprint card, THE Attachment_System SHALL display all sprint-level attachments in the expanded details section
3. THE Attachment_System SHALL show attachment metadata (name, type, size, uploadedBy, uploadedAt) for each sprint attachment
4. THE Attachment_System SHALL provide visual indicators for attachment types
5. THE Attachment_System SHALL support clickable attachment names that navigate to the url field

### Requirement 8: Attachment Display in Progress.html

**User Story:** As a Developer, I want to see and upload test evidence in Progress.html, so that I can document ticket completion with supporting files.

#### Acceptance Criteria

1. WHEN a user views a ticket detail panel in Progress.html, THE Attachment_System SHALL display all ticket attachments including test evidence
2. WHEN a Developer is viewing a ticket, THE Attachment_System SHALL provide an upload interface for adding test evidence
3. THE Attachment_System SHALL show attachment metadata (name, type, size, uploadedBy, uploadedAt) for each ticket attachment
4. THE Attachment_System SHALL provide visual indicators for attachment types
5. THE Attachment_System SHALL support clickable attachment names that navigate to the url field

### Requirement 9: Attachment Metadata Consistency

**User Story:** As a system architect, I want consistent attachment metadata across all entity types, so that the attachment system is maintainable and predictable.

#### Acceptance Criteria

1. THE Attachment_System SHALL use a consistent attachment object shape for all entity types (projects, gates, sprints, tickets)
2. THE Attachment_System SHALL require the following fields for all attachments: id, name, type, size, uploadedBy, uploadedAt, url
3. THE Attachment_System SHALL use person IDs from the `PEOPLE` object for the uploadedBy field
4. THE Attachment_System SHALL use relative time strings (e.g., "2 days ago", "1 hour ago") for the uploadedAt field
5. THE Attachment_System SHALL use file extensions or MIME types for the type field (e.g., "PDF", "Figma", "Markdown", "ZIP", "Excel")

### Requirement 10: Data Layer Integration

**User Story:** As a developer, I want attachment data structures integrated into data.jsx, so that attachments are available globally via the window object like other ALPS data.

#### Acceptance Criteria

1. THE Data_Layer SHALL define `PROJECT_ATTACHMENTS` as a global object on window mapping project IDs to attachment arrays
2. THE Data_Layer SHALL define `GATE_ATTACHMENTS` as a global object on window mapping composite keys (projectId-gateId) to attachment arrays
3. THE Data_Layer SHALL define `SPRINT_ATTACHMENTS` as a global object on window mapping sprint IDs to attachment arrays
4. THE Data_Layer SHALL maintain the existing `TICKET_ATTACHMENTS` object structure for backward compatibility
5. THE Data_Layer SHALL expose all attachment objects via `Object.assign(window, { ... })` at the end of data.jsx

### Requirement 11: Sample Data Population

**User Story:** As a developer, I want realistic sample attachment data, so that I can test and demonstrate the attachment functionality across all entity types.

#### Acceptance Criteria

1. THE Data_Layer SHALL include sample project attachments for at least 2 projects (ALPS-218, ALPS-301)
2. THE Data_Layer SHALL include sample gate attachments for at least 2 gates across different projects
3. THE Data_Layer SHALL include sample sprint attachments for at least 2 sprints
4. THE Data_Layer SHALL maintain existing sample ticket attachments (LIN-205, LIN-206, LIN-207, LIN-210)
5. THE Data_Layer SHALL use realistic file names, types, sizes, and timestamps in sample attachment data

### Requirement 12: Role-Based Attachment Visibility

**User Story:** As a user, I want to see attachments relevant to my role, so that I can focus on the documentation that matters to my responsibilities.

#### Acceptance Criteria

1. THE Attachment_System SHALL display project attachments to all user roles (PM, Tech Lead, Developer, Requestor)
2. THE Attachment_System SHALL display gate attachments to all user roles (PM, Tech Lead, Developer, Requestor)
3. THE Attachment_System SHALL display sprint attachments to all user roles (PM, Tech Lead, Developer, Requestor)
4. THE Attachment_System SHALL display ticket test evidence to all user roles (PM, Tech Lead, Developer, Requestor)
5. THE Attachment_System SHALL maintain consistent attachment display regardless of the active role in the role switcher

### Requirement 13: Attachment Upload Interface (UI Placeholder)

**User Story:** As a PM, Tech Lead, or Developer, I want a clear indication of where to upload attachments, so that I understand the attachment capability exists even if full upload is not yet implemented.

#### Acceptance Criteria

1. WHEN a user views a project, gate, sprint, or ticket, THE Attachment_System SHALL display an "Add Attachment" button or placeholder
2. THE Attachment_System SHALL use consistent visual styling for attachment upload interfaces across all entity types
3. WHEN a user clicks an "Add Attachment" button, THE Attachment_System SHALL display a placeholder message indicating upload functionality is coming
4. THE Attachment_System SHALL use the existing ALPS design system (CSS variables, inline styles) for attachment UI components
5. THE Attachment_System SHALL maintain visual consistency with existing ALPS UI patterns (Section components, buttons, icons)

### Requirement 14: Attachment List Display Component

**User Story:** As a developer, I want a reusable attachment list component, so that attachment display is consistent across Dashboard, Cycles, and Progress screens.

#### Acceptance Criteria

1. THE Attachment_System SHALL provide an `Attachment_List` component that accepts an attachments array prop
2. THE Attachment_List component SHALL display attachment metadata (name, type, size, uploadedBy, uploadedAt) for each attachment
3. THE Attachment_List component SHALL use visual indicators (icons or badges) for different attachment types
4. THE Attachment_List component SHALL support clickable attachment names that navigate to the url field
5. THE Attachment_List component SHALL handle empty attachment arrays gracefully (display "No attachments" message)

### Requirement 15: Sprint Description Display Component

**User Story:** As a developer, I want a reusable sprint description component, so that sprint objectives are displayed consistently in the Cycles screen.

#### Acceptance Criteria

1. THE Attachment_System SHALL provide a `Sprint_Description` component that accepts a description string prop
2. THE Sprint_Description component SHALL display the description text with proper line breaks and formatting
3. THE Sprint_Description component SHALL handle empty or null descriptions gracefully (display "No description" message)
4. THE Sprint_Description component SHALL use consistent typography and spacing with existing ALPS UI components
5. THE Sprint_Description component SHALL support multi-line descriptions with text wrapping
