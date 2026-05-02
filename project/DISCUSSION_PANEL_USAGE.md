# DiscussionPanel Component Usage

## Overview

The `DiscussionPanel` component displays threaded discussions for projects and sprints with optional MS Teams integration.

## Component Signature

```javascript
function DiscussionPanel({ entityId, entityType, teamsThreadUrl, onTeamsThreadChange })
```

## Props

- **entityId** (string): Project or sprint ID (e.g., "ALPS-218" or "sprint-1")
- **entityType** (string): Either "project" or "sprint"
- **teamsThreadUrl** (string, optional): MS Teams thread URL
- **onTeamsThreadChange** (function, optional): Callback when Teams thread URL is updated

## Data Structure

The component reads discussion threads from `window.DISCUSSION_THREAD` using the key format: `"{entityType}-{entityId}"`.

### Example Data Structure

```javascript
window.DISCUSSION_THREAD = {
  "project-ALPS-218": [
    {
      id: "d1",
      author: "asha",                    // PEOPLE key
      timestamp: "2026-04-20T09:30:00",  // ISO date string
      message: "Question on implementation...",
      replies: [
        {
          id: "d1-r1",
          author: "jun",
          timestamp: "2026-04-20T10:15:00",
          message: "Good point. Currently designed to...",
          replies: []  // Can be nested further
        }
      ]
    }
  ],
  "sprint-sprint-1": [
    // Similar structure for sprint discussions
  ]
}
```

## Usage Examples

### Basic Usage - Display Project Discussion

```jsx
<window.DiscussionPanel
  entityId="ALPS-218"
  entityType="project"
/>
```

### With Teams Thread URL

```jsx
<window.DiscussionPanel
  entityId="ALPS-218"
  entityType="project"
  teamsThreadUrl="https://teams.microsoft.com/l/channel/..."
  onTeamsThreadChange={(newUrl) => {
    // Handle Teams URL update
    console.log("Teams thread URL updated:", newUrl);
  }}
/>
```

### Display Sprint Discussion

```jsx
<window.DiscussionPanel
  entityId="sprint-1"
  entityType="sprint"
/>
```

## Features

### 1. Threaded Discussions
- Displays messages with author, timestamp, and content
- Supports nested replies with visual indentation
- Expandable/collapsible reply threads

### 2. Author Information
- Shows author avatar using `window.Avatar` component
- Displays author full name from `window.PEOPLE`
- Handles unknown authors gracefully

### 3. Timestamps
- Displays relative timestamps (e.g., "2h ago", "3 days ago")
- Supports ISO date strings
- Gracefully handles invalid dates

### 4. Teams Integration
- "Open in Teams" button when Teams thread URL is provided
- Edit button to update Teams thread URL
- Link Teams thread button when no URL is set
- Input field for pasting Teams thread URL

### 5. Styling
- Uses CSS variables for theming (--alps-primary, --alps-accent, etc.)
- Responsive design with proper spacing and indentation
- Visual distinction between main messages and replies
- Hover effects on interactive elements

## Integration Points

### In Dashboard Screen

Add to the left column after the Gate Change Log section:

```jsx
<window.Section kicker="Discussion" title="Project Discussion">
  <window.DiscussionPanel
    entityId={project.id}
    entityType="project"
    teamsThreadUrl={project.teamsThreadUrl}
    onTeamsThreadChange={(url) => {
      // Update project metadata
      setProject(prev => ({ ...prev, teamsThreadUrl: url }));
    }}
  />
</window.Section>
```

### In Cycles Screen

Add to sprint cards to show discussion preview:

```jsx
<window.DiscussionPanel
  entityId={sprint.id}
  entityType="sprint"
  teamsThreadUrl={sprint.teamsThreadUrl}
/>
```

## Data Requirements

The component requires:

1. **window.PEOPLE** - Map of person IDs to person objects with `fullName` property
2. **window.DISCUSSION_THREAD** - Object with discussion threads keyed by "{entityType}-{entityId}"

## Styling

The component uses the following CSS variables:

- `--alps-bg` - Background color
- `--alps-bg-alt` - Alternate background
- `--alps-text` - Primary text color
- `--alps-text-muted` - Secondary text color
- `--alps-border` - Border color
- `--alps-accent` - Accent color (for buttons and highlights)
- `--alps-info` - Info color (for input fields)
- `--font-sans` - Font family

## Accessibility

- Keyboard navigable buttons
- Proper semantic HTML structure
- ARIA labels for interactive elements
- Color contrast compliant with WCAG standards

## Testing

Run the test suite:

```bash
npm test -- project/discussion-panel.test.js
```

Tests verify:
- Data structure validation
- Message and reply structure
- Author references
- Timestamp handling
- Teams thread integration
- Empty state handling
- Component props interface

## Notes

- The component is stateless and controlled via props
- Discussion data is read-only from `window.DISCUSSION_THREAD`
- Teams thread URL updates are handled via callback
- Component handles missing data gracefully
- All timestamps should be ISO format strings
