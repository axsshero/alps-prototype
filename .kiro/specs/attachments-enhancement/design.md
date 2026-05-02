# Design Document: Attachments Enhancement

## Overview

This design extends the ALPS prototype with comprehensive attachment capabilities across all entity levels (projects, gates, sprints, tickets) and adds sprint description fields. The implementation follows ALPS architectural patterns: React 18 via CDN, no build step, inline styles with CSS variables, and global exposure via `window` object.

### Goals

1. **Multi-level attachments**: Support file attachments at project, gate, sprint, and ticket levels
2. **Sprint descriptions**: Add objective/goal documentation to sprints
3. **Consistent UX**: Reusable components with uniform attachment display across all screens
4. **Data layer integration**: Extend `data.jsx` with new attachment data structures
5. **UI placeholders**: Provide clear upload interfaces (non-functional for prototype)

### Non-Goals

- Actual file upload implementation (backend/storage)
- File preview/rendering capabilities
- Attachment versioning or history
- Permission-based attachment visibility (all roles see all attachments per requirements)

---

## Architecture

### High-Level Component Structure

```
Attachment System
├── Data Layer (data.jsx)
│   ├── PROJECT_ATTACHMENTS: { [projectId]: Attachment[] }
│   ├── GATE_ATTACHMENTS: { [projectId-gateId]: Attachment[] }
│   ├── SPRINT_ATTACHMENTS: { [sprintId]: Attachment[] }
│   └── TICKET_ATTACHMENTS: { [ticketId]: Attachment[] } (existing, enhanced)
│
├── Reusable Components (new file: attachments.jsx)
│   ├── Attachment_List: Display attachment arrays
│   ├── Attachment_Item: Single attachment with metadata
│   ├── Attachment_Upload_Placeholder: Upload UI stub
│   └── Sprint_Description: Sprint objective display
│
└── Integration Points
    ├── Dashboard (screen-dashboard.jsx)
    │   ├── Project attachments section
    │   └── Gate-specific attachments in gate tabs
    ├── Cycles (screen-cycles.jsx)
    │   ├── Sprint descriptions in cards
    │   └── Sprint attachments in expanded view
    └── Progress.html
        └── Ticket attachments in detail panel
```

### File Organization

**New file**: `project/attachments.jsx`
- Contains all attachment-related components
- Exposes components via `Object.assign(window, { ... })`
- Loaded in `ALPS Prototype.html` after `primitives.jsx`, before screen files

**Modified files**:
- `project/data.jsx`: Add attachment data structures and sprint descriptions
- `project/screen-dashboard.jsx`: Integrate project and gate attachments
- `project/screen-cycles.jsx`: Integrate sprint descriptions and attachments
- `project/Progress.html`: Integrate ticket attachments in detail panel
- `project/ALPS Prototype.html`: Add `<script>` tag for `attachments.jsx`

---

## Data Models

### Attachment Object Shape

All attachments follow a consistent structure:

```javascript
{
  id: string,              // Unique identifier (e.g., "att-proj-1")
  name: string,            // File name with extension (e.g., "business-case.pdf")
  type: string,            // File type label (e.g., "PDF", "Figma", "Markdown", "ZIP", "Excel")
  size: string,            // Human-readable size (e.g., "2.4 MB", "45 KB") or "—" for links
  uploadedBy: string,      // Person ID from PEOPLE object (e.g., "rina")
  uploadedAt: string,      // Relative time string (e.g., "2 days ago", "1 hour ago")
  url: string              // Link to file (placeholder "#" for prototype)
}
```

### Data Layer Additions (data.jsx)

```javascript
// Project-level attachments
const PROJECT_ATTACHMENTS = {
  "ALPS-218": [
    {
      id: "att-proj-218-1",
      name: "business-case-recurring-billing.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploadedBy: "rina",
      uploadedAt: "3 weeks ago",
      url: "#"
    },
    {
      id: "att-proj-218-2",
      name: "architecture-diagram.figma",
      type: "Figma",
      size: "—",
      uploadedBy: "mateo",
      uploadedAt: "2 weeks ago",
      url: "#"
    },
    {
      id: "att-proj-218-3",
      name: "stakeholder-approval-email.pdf",
      type: "PDF",
      size: "340 KB",
      uploadedBy: "asha",
      uploadedAt: "1 week ago",
      url: "#"
    }
  ],
  "ALPS-301": [
    {
      id: "att-proj-301-1",
      name: "php-to-react-migration-plan.md",
      type: "Markdown",
      size: "28 KB",
      uploadedBy: "mateo",
      uploadedAt: "5 days ago",
      url: "#"
    },
    {
      id: "att-proj-301-2",
      name: "payment-flow-wireframes.figma",
      type: "Figma",
      size: "—",
      uploadedBy: "lena",
      uploadedAt: "3 days ago",
      url: "#"
    }
  ]
};

// Gate-level attachments (composite key: projectId-gateId)
const GATE_ATTACHMENTS = {
  "ALPS-218-business": [
    {
      id: "att-gate-218-b1",
      name: "roi-analysis-spreadsheet.xlsx",
      type: "Excel",
      size: "512 KB",
      uploadedBy: "rina",
      uploadedAt: "3 weeks ago",
      url: "#"
    },
    {
      id: "att-gate-218-b2",
      name: "stakeholder-sign-off.pdf",
      type: "PDF",
      size: "890 KB",
      uploadedBy: "asha",
      uploadedAt: "2 weeks ago",
      url: "#"
    }
  ],
  "ALPS-218-product": [
    {
      id: "att-gate-218-p1",
      name: "user-flow-diagram.png",
      type: "Image",
      size: "1.2 MB",
      uploadedBy: "rina",
      uploadedAt: "1 week ago",
      url: "#"
    },
    {
      id: "att-gate-218-p2",
      name: "acceptance-criteria-v2.md",
      type: "Markdown",
      size: "18 KB",
      uploadedBy: "rina",
      uploadedAt: "4 days ago",
      url: "#"
    }
  ],
  "ALPS-301-business": [
    {
      id: "att-gate-301-b1",
      name: "conversion-rate-analysis.pdf",
      type: "PDF",
      size: "2.1 MB",
      uploadedBy: "priya",
      uploadedAt: "1 week ago",
      url: "#"
    }
  ]
};

// Sprint-level attachments
const SPRINT_ATTACHMENTS = {
  "sprint-2": [
    {
      id: "att-sprint-2-1",
      name: "sprint-2-planning-notes.md",
      type: "Markdown",
      size: "12 KB",
      uploadedBy: "mateo",
      uploadedAt: "2 weeks ago",
      url: "#"
    },
    {
      id: "att-sprint-2-2",
      name: "retrospective-action-items.pdf",
      type: "PDF",
      size: "450 KB",
      uploadedBy: "rina",
      uploadedAt: "1 week ago",
      url: "#"
    }
  ],
  "sprint-3": [
    {
      id: "att-sprint-3-1",
      name: "edge-case-scenarios.xlsx",
      type: "Excel",
      size: "780 KB",
      uploadedBy: "jun",
      uploadedAt: "3 days ago",
      url: "#"
    }
  ]
};

// Ticket attachments (existing structure, already populated)
// TICKET_ATTACHMENTS remains unchanged

// Sprint descriptions (add to existing SPRINTS array)
const SPRINTS = [
  {
    id: "sprint-1",
    name: "Sprint 1 — Foundation",
    description: "Establish core infrastructure for billing system: database schema, service skeleton, authentication framework. Focus on architectural foundations that enable rapid feature development in subsequent sprints.",
    // ... existing fields
  },
  {
    id: "sprint-2",
    name: "Sprint 2 — Core Logic",
    description: "Implement retry logic with exponential backoff, build billing dashboard UI, and establish webhook fan-out architecture. Primary goal: deliver end-to-end payment retry flow with real-time status visibility.",
    // ... existing fields
  },
  {
    id: "sprint-3",
    name: "Sprint 3 — Retry & Edge Cases",
    description: "Handle edge cases: partial refunds during retry, subscription cancellations mid-retry, cascading failure prevention. Includes load testing to validate system resilience under high concurrency.",
    // ... existing fields
  },
  // ... other sprints
];

// Export all to window
Object.assign(window, {
  // ... existing exports
  PROJECT_ATTACHMENTS,
  GATE_ATTACHMENTS,
  SPRINT_ATTACHMENTS,
  // TICKET_ATTACHMENTS already exported
});
```

---

## Components and Interfaces

### Component: Attachment_List

**Purpose**: Display a list of attachments with consistent formatting

**Props**:
```javascript
{
  attachments: Attachment[],  // Array of attachment objects
  emptyMessage?: string,      // Custom message when empty (default: "No attachments")
  compact?: boolean           // Compact mode for smaller spaces (default: false)
}
```

**Behavior**:
- Renders each attachment using `Attachment_Item`
- Shows `emptyMessage` when `attachments` is empty or null
- Handles missing/malformed attachment data gracefully

**Visual Design**:
- Standard mode: Grid layout with full metadata
- Compact mode: List layout with condensed metadata
- Uses `var(--alps-bg)` for item backgrounds
- Uses `var(--alps-border)` for borders

**Example Usage**:
```jsx
<window.Attachment_List
  attachments={window.PROJECT_ATTACHMENTS["ALPS-218"]}
  emptyMessage="No project attachments yet"
/>
```

---

### Component: Attachment_Item

**Purpose**: Display a single attachment with metadata and file type indicator

**Props**:
```javascript
{
  attachment: Attachment,  // Single attachment object
  compact?: boolean        // Compact display mode (default: false)
}
```

**Behavior**:
- Clickable name that navigates to `attachment.url`
- Shows file type icon/badge based on `attachment.type`
- Displays uploader avatar using `window.Avatar`
- Shows relative upload time

**Visual Design**:
- File type badge with color coding:
  - PDF: `var(--alps-danger)` (red)
  - Figma: `var(--alps-primary)` (blue)
  - Markdown: `var(--alps-info)` (light blue)
  - Excel: `var(--alps-success)` (green)
  - ZIP: `var(--alps-text-muted)` (gray)
  - Image: `var(--alps-warning)` (amber)
  - Default: `var(--alps-text-muted)`
- Hover state: border color changes to `var(--alps-accent)`
- Font: `var(--font-sans)` for name, `var(--font-mono)` for size

**Layout** (standard mode):
```
┌─────────────────────────────────────────────┐
│ [PDF] business-case.pdf          2.4 MB     │
│ [Avatar] Rina Hartono · 2 days ago          │
└─────────────────────────────────────────────┘
```

**Layout** (compact mode):
```
┌─────────────────────────────────────────────┐
│ [PDF] business-case.pdf · 2.4 MB · 2d ago  │
└─────────────────────────────────────────────┘
```

---

### Component: Attachment_Upload_Placeholder

**Purpose**: Provide visual indication of upload capability (non-functional for prototype)

**Props**:
```javascript
{
  entityType: string,  // "project" | "gate" | "sprint" | "ticket"
  entityId: string     // ID of the entity (for future implementation)
}
```

**Behavior**:
- Displays "+ Add Attachment" button
- On click: shows alert with placeholder message
- Message: "File upload will be available in production. For now, attachments are pre-populated in the data layer."

**Visual Design**:
- Dashed border button style
- Uses `var(--alps-border)` for border
- Uses `var(--alps-text-muted)` for text
- Hover: border and text change to `var(--alps-accent)`
- Icon: `window.Icon.plus`

**Example**:
```jsx
<window.Attachment_Upload_Placeholder
  entityType="project"
  entityId="ALPS-218"
/>
```

---

### Component: Sprint_Description

**Purpose**: Display sprint objectives and goals with proper formatting

**Props**:
```javascript
{
  description: string | null,  // Sprint description text
  emptyMessage?: string        // Custom message when empty (default: "No description")
}
```

**Behavior**:
- Renders description with line breaks preserved
- Shows `emptyMessage` when description is null/empty
- Supports multi-paragraph text

**Visual Design**:
- Background: `var(--alps-bg-alt)`
- Border: `1px solid var(--alps-border)`
- Border-left: `3px solid var(--alps-info)` (accent bar)
- Padding: `12px 14px`
- Font size: `12px`
- Line height: `1.5`
- Color: `var(--alps-text)`
- Empty state color: `var(--alps-text-muted)`

**Example**:
```jsx
<window.Sprint_Description
  description={sprint.description}
  emptyMessage="No sprint objectives defined"
/>
```

---

## Integration Points

### Dashboard Screen (screen-dashboard.jsx)

#### Project Attachments Section

**Location**: After project header, before ticket status section

**Implementation**:
```jsx
{/* Project Attachments */}
<window.Section kicker="Documentation" title="Project Attachments">
  <div style={{ display: "grid", gap: "12px" }}>
    <window.Attachment_List
      attachments={window.PROJECT_ATTACHMENTS[project.id] || []}
      emptyMessage="No project attachments"
    />
    <window.Attachment_Upload_Placeholder
      entityType="project"
      entityId={project.id}
    />
  </div>
</window.Section>
```

#### Gate Attachments

**Location**: Within each gate tab content (GateContentBusiness, GateContentProduct, GateContentTech)

**Implementation** (example for Business Gate):
```jsx
function GateContentBusiness({ project, onUpdateItem, onAcceptAI }) {
  const gate = project.gates.business;
  const gateKey = `${project.id}-business`;
  
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {/* Existing checklist */}
      <GateChecklist gateId="business" gate={gate} onUpdateItem={onUpdateItem} onAcceptAI={onAcceptAI} />
      
      {/* Gate attachments */}
      <div style={{ marginTop: "8px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
          Gate Attachments
        </div>
        <window.Attachment_List
          attachments={window.GATE_ATTACHMENTS[gateKey] || []}
          emptyMessage="No gate attachments"
          compact={true}
        />
        <div style={{ marginTop: "8px" }}>
          <window.Attachment_Upload_Placeholder
            entityType="gate"
            entityId={gateKey}
          />
        </div>
      </div>
    </div>
  );
}
```

---

### Cycles Screen (screen-cycles.jsx)

#### Sprint Description in Sprint_Card

**Location**: Within Sprint_Card component, after header and before progress bar

**Implementation**:
```jsx
function Sprint_Card({ sprint, health, onViewProject, expanded, onToggleExpand }) {
  // ... existing code
  
  return (
    <div style={{ /* existing styles */ }}>
      {/* Existing header */}
      
      {/* Sprint description */}
      {sprint.description && (
        <div style={{ marginTop: "8px" }}>
          <window.Sprint_Description description={sprint.description} />
        </div>
      )}
      
      {/* Existing progress bar and other content */}
      
      {/* Sprint attachments in expanded view */}
      {expanded && (
        <div style={{ marginTop: "12px", padding: "12px", background: "var(--alps-bg-alt)", borderRadius: "4px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
            Sprint Attachments
          </div>
          <window.Attachment_List
            attachments={window.SPRINT_ATTACHMENTS[sprint.id] || []}
            emptyMessage="No sprint attachments"
            compact={true}
          />
          <div style={{ marginTop: "8px" }}>
            <window.Attachment_Upload_Placeholder
              entityType="sprint"
              entityId={sprint.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Progress.html

#### Ticket Attachments in Detail Panel

**Location**: Within DetailPanel component, after "Git Activity" field

**Implementation**:
```jsx
function DetailPanel({ ticket: t, onClose }) {
  // ... existing code
  
  return (
    <div style={{ /* existing styles */ }}>
      {/* Existing fields */}
      
      {/* Ticket attachments */}
      <Field label="Test Evidence & Attachments">
        <div style={{ display: "grid", gap: "8px" }}>
          <window.Attachment_List
            attachments={window.TICKET_ATTACHMENTS[t.id] || []}
            emptyMessage="No attachments"
            compact={true}
          />
          {!isEditing && (
            <window.Attachment_Upload_Placeholder
              entityType="ticket"
              entityId={t.id}
            />
          )}
        </div>
      </Field>
      
      {/* Existing dependencies field */}
    </div>
  );
}
```

**Note**: Progress.html needs to load `attachments.jsx` via `<script type="text/babel" src="attachments.jsx"></script>` after React/Babel but before the main app script.

---

## UI/UX Design Specifications

### Color Palette for File Types

| File Type | Color Variable | Hex (Dark Mode) | Use Case |
|-----------|---------------|-----------------|----------|
| PDF | `var(--alps-danger)` | #ef4444 | Documents, reports |
| Figma | `var(--alps-primary)` | #2563eb | Design files |
| Markdown | `var(--alps-info)` | #3b82f6 | Documentation |
| Excel | `var(--alps-success)` | #10b981 | Spreadsheets |
| ZIP | `var(--alps-text-muted)` | #9ca3af | Archives |
| Image | `var(--alps-warning)` | #f59e0b | Screenshots, diagrams |
| Default | `var(--alps-text-muted)` | #9ca3af | Unknown types |

### Typography

- **Attachment name**: `font-size: 12px`, `font-weight: 600`, `color: var(--alps-text)`
- **File size**: `font-size: 11px`, `font-family: var(--font-mono)`, `color: var(--alps-text-muted)`
- **Uploader name**: `font-size: 11px`, `color: var(--alps-text-muted)`
- **Upload time**: `font-size: 10px`, `color: var(--alps-text-muted)`
- **Section headers**: `font-size: 11px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.06em`, `color: var(--alps-text-muted)`

### Spacing

- **Attachment list gap**: `12px` (standard), `8px` (compact)
- **Item padding**: `12px 14px` (standard), `8px 10px` (compact)
- **Section margin**: `16px` between sections
- **Border radius**: `4px` for items, `6px` for containers

### Interactive States

**Attachment Item**:
- Default: `border: 1px solid var(--alps-border)`
- Hover: `border-color: var(--alps-accent)`, `cursor: pointer`
- Active: `background: rgba(8, 145, 178, 0.08)`

**Upload Placeholder**:
- Default: `border: 1px dashed var(--alps-border)`, `color: var(--alps-text-muted)`
- Hover: `border-color: var(--alps-accent)`, `color: var(--alps-accent)`
- Active: `background: rgba(8, 145, 178, 0.05)`

### Responsive Behavior

- **Desktop (> 1024px)**: Standard layout with full metadata
- **Tablet (768px - 1024px)**: Compact mode automatically applied
- **Mobile (< 768px)**: Compact mode with stacked layout

---

## Error Handling

### Missing Data

**Scenario**: Attachment data structure is missing or malformed

**Handling**:
```javascript
// Safe access pattern
const attachments = window.PROJECT_ATTACHMENTS?.[projectId] || [];

// Component validation
if (!attachment || !attachment.name) {
  return null; // Skip rendering invalid items
}
```

### Missing Person Data

**Scenario**: `uploadedBy` references a person ID not in `PEOPLE`

**Handling**:
```javascript
const uploader = window.PEOPLE[attachment.uploadedBy] || { 
  fullName: "Unknown User", 
  initials: "?" 
};
```

### Broken URLs

**Scenario**: Attachment URL is invalid or missing

**Handling**:
- Always provide `url: "#"` as fallback in data layer
- Component prevents navigation if `url === "#"` (shows alert instead)

---

## Testing Strategy

### Unit Tests (Future Implementation)

**Attachment_List**:
- Renders correct number of items
- Shows empty message when array is empty
- Handles null/undefined gracefully
- Applies compact mode correctly

**Attachment_Item**:
- Displays all metadata fields
- Shows correct file type badge color
- Renders uploader avatar
- Handles missing data gracefully

**Sprint_Description**:
- Renders multi-line text correctly
- Shows empty message when null
- Preserves line breaks

### Integration Tests (Future Implementation)

**Dashboard Integration**:
- Project attachments appear in correct section
- Gate attachments isolated per gate
- Upload placeholder shows correct entity type

**Cycles Integration**:
- Sprint descriptions display in cards
- Sprint attachments appear in expanded view
- Attachments filtered by sprint ID

**Progress.html Integration**:
- Ticket attachments load correctly
- Upload placeholder appears for developers
- Attachments persist across panel open/close

### Manual Testing Checklist

- [ ] Project attachments visible in Dashboard
- [ ] Gate attachments isolated per gate tab
- [ ] Sprint descriptions display in Cycles screen
- [ ] Sprint attachments appear when card expanded
- [ ] Ticket attachments visible in Progress.html detail panel
- [ ] Upload placeholders show appropriate messages
- [ ] File type badges show correct colors
- [ ] Uploader avatars render correctly
- [ ] Empty states show appropriate messages
- [ ] All attachments clickable (navigate to `#`)
- [ ] Responsive behavior works on mobile/tablet
- [ ] Dark mode colors render correctly

---

## Implementation Notes

### Load Order

Critical: `attachments.jsx` must load after `primitives.jsx` (for Avatar, Icon) and before screen files.

**ALPS Prototype.html**:
```html
<script type="text/babel" src="data.jsx"></script>
<script type="text/babel" src="utils.jsx"></script>
<script type="text/babel" src="primitives.jsx"></script>
<script type="text/babel" src="attachments.jsx"></script>  <!-- NEW -->
<script type="text/babel" src="screen-dashboard.jsx"></script>
<script type="text/babel" src="screen-portfolio.jsx"></script>
<script type="text/babel" src="screen-cycles.jsx"></script>
<script type="text/babel" src="app.jsx"></script>
```

**Progress.html**:
```html
<script type="text/babel" src="data.jsx"></script>
<script type="text/babel" src="primitives.jsx"></script>
<script type="text/babel" src="attachments.jsx"></script>  <!-- NEW -->
<script type="text/babel">
  // Main Progress.html app code
</script>
```

### Window Exposure Pattern

All components must be exposed on `window`:

```javascript
// attachments.jsx
function Attachment_List({ attachments, emptyMessage, compact }) {
  // implementation
}

function Attachment_Item({ attachment, compact }) {
  // implementation
}

function Attachment_Upload_Placeholder({ entityType, entityId }) {
  // implementation
}

function Sprint_Description({ description, emptyMessage }) {
  // implementation
}

// Expose all components
Object.assign(window, {
  Attachment_List,
  Attachment_Item,
  Attachment_Upload_Placeholder,
  Sprint_Description,
});
```

### Backward Compatibility

- `TICKET_ATTACHMENTS` structure remains unchanged
- Existing ticket attachment references continue to work
- `PROJECT` singleton preserved for Dashboard backward compat
- All new data structures are additive (no breaking changes)

---

## Future Enhancements

### Phase 2 (Post-Prototype)

1. **Actual Upload**: Integrate with backend storage (S3, Azure Blob)
2. **File Preview**: Inline preview for images, PDFs
3. **Attachment Search**: Full-text search across all attachments
4. **Versioning**: Track attachment history and versions
5. **Permissions**: Role-based attachment visibility
6. **Bulk Operations**: Multi-select, bulk download, bulk delete
7. **Drag & Drop**: Drag files directly onto upload areas
8. **Progress Indicators**: Upload progress bars
9. **File Validation**: Size limits, type restrictions
10. **Attachment Comments**: Discussion threads per attachment

### Phase 3 (Advanced Features)

1. **Attachment Analytics**: Track views, downloads
2. **Smart Suggestions**: AI-suggested attachments based on context
3. **External Links**: Link to Google Drive, Dropbox, Confluence
4. **Attachment Templates**: Pre-defined attachment sets per gate
5. **Audit Trail**: Track all attachment operations
6. **Attachment Notifications**: Notify team when attachments added
7. **Attachment Expiry**: Auto-archive old attachments
8. **Attachment Tagging**: Categorize attachments with tags

---

## Appendix: Sample Data

### Complete Sample Attachment Data

See **Data Models** section above for full sample data structures including:
- `PROJECT_ATTACHMENTS` for ALPS-218 and ALPS-301
- `GATE_ATTACHMENTS` for business and product gates
- `SPRINT_ATTACHMENTS` for sprint-2 and sprint-3
- Sprint descriptions for all sprints

### File Type Distribution

| Type | Count | Percentage |
|------|-------|------------|
| PDF | 8 | 40% |
| Markdown | 4 | 20% |
| Figma | 3 | 15% |
| Excel | 3 | 15% |
| Image | 1 | 5% |
| ZIP | 1 | 5% |

### Attachment Size Distribution

| Size Range | Count | Percentage |
|------------|-------|------------|
| < 100 KB | 6 | 30% |
| 100 KB - 1 MB | 8 | 40% |
| 1 MB - 5 MB | 6 | 30% |
| > 5 MB | 0 | 0% |

---

## Summary

This design provides a comprehensive attachment system for ALPS that:

1. **Extends data layer** with four attachment types (project, gate, sprint, ticket)
2. **Provides reusable components** for consistent UX across all screens
3. **Integrates seamlessly** with existing Dashboard, Cycles, and Progress screens
4. **Follows ALPS patterns**: React via CDN, inline styles, window exposure
5. **Maintains backward compatibility** with existing code
6. **Supports future enhancement** with clear extension points

The implementation is prototype-ready with placeholder upload functionality, realistic sample data, and production-quality component design that can be enhanced with real backend integration in future phases.
