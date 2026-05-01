# Bugfix Requirements Document

## Introduction

Progress.html is currently a standalone HTML file with its own hardcoded data constants (PEOPLE, CYCLES, TICKETS) that duplicate and diverge from the shared data.jsx file used by the main ALPS application. This creates data inconsistency where changes to data.jsx don't reflect in Progress.html, and Progress.html cannot display data for projects other than ALPS-218. The bug prevents Progress.html from functioning as a reusable project detail view and causes confusion when data shown in Progress.html doesn't match the main application.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Progress.html is loaded THEN the system uses hardcoded PEOPLE data with only `fullName` and `initials` fields instead of the complete structure from data.jsx (`id`, `name`, `fullName`, `role`, `initials`)

1.2 WHEN Progress.html is loaded THEN the system uses hardcoded CYCLES data with IDs `S11`, `S12`, `S13`, `S14` instead of the SPRINTS structure from data.jsx with proper sprint IDs and project associations

1.3 WHEN Progress.html is loaded THEN the system displays 17 hardcoded tickets for ALPS-218 instead of loading tickets from LINEAR_TICKETS in data.jsx

1.4 WHEN data.jsx is updated with new people, tickets, or sprint information THEN Progress.html does not reflect these changes because it uses its own isolated data constants

1.5 WHEN a user wants to view progress for ALPS-301 or ALPS-302 THEN Progress.html cannot display this data because it is hardcoded to ALPS-218 project data only

1.6 WHEN Progress.html defines ticket properties THEN it uses simplified structures (e.g., missing `techSpecs`, `acceptanceCriteria`, `description` details) that don't match LINEAR_TICKETS schema

1.7 WHEN Progress.html renders cycle cards THEN it uses cycle IDs (`S11`, `S12`, etc.) that don't exist in the SPRINTS array from data.jsx

1.8 WHEN a user clicks "View Progress & Cycles →" from the Dashboard for a specific project THEN Progress.html does not automatically filter to show only that project's tickets because it lacks projectId parameter passing

1.9 WHEN a user views a ticket in Progress.html detail panel THEN the system does not provide any edit capability for the ticket fields

1.10 WHEN Progress.html displays tickets and sprints THEN the system does not properly associate them with their parent project because the hardcoded data lacks projectId references

### Expected Behavior (Correct)

2.1 WHEN Progress.html is loaded THEN the system SHALL load data.jsx as a script dependency and use the shared PEOPLE object with all fields (`id`, `name`, `fullName`, `role`, `initials`)

2.2 WHEN Progress.html is loaded THEN the system SHALL use SPRINTS from data.jsx and map them to cycle display format for the UI

2.3 WHEN Progress.html is loaded THEN the system SHALL filter LINEAR_TICKETS by projectId to display tickets for the selected project

2.4 WHEN data.jsx is updated with new people, tickets, or sprint information THEN Progress.html SHALL automatically reflect these changes on next page load

2.5 WHEN a user wants to view progress for any project (ALPS-218, ALPS-301, ALPS-302) THEN Progress.html SHALL accept a projectId parameter (via URL query string or localStorage) and display that project's data

2.6 WHEN Progress.html defines ticket rendering logic THEN it SHALL use the complete LINEAR_TICKETS schema including `techSpecs`, `acceptanceCriteria`, and full `description` fields

2.7 WHEN Progress.html renders cycle cards THEN it SHALL map SPRINTS data to cycle display format, using sprint IDs and dates from data.jsx

2.8 WHEN a user clicks "View Progress & Cycles →" from the Dashboard for a specific project THEN Progress.html SHALL receive the projectId as a URL parameter and automatically filter to show only that project's tickets and sprints

2.9 WHEN a user views a ticket in the Progress.html detail panel THEN the system SHALL provide edit capability for ticket fields (title, description, status, priority, assignee, due date) with changes persisted to the data layer

2.10 WHEN Progress.html displays tickets and sprints THEN the system SHALL properly associate them with their parent project using projectId from LINEAR_TICKETS and SPRINTS data structures

### Unchanged Behavior (Regression Prevention)

3.1 WHEN Progress.html displays the ticket table THEN the system SHALL CONTINUE TO show columns for Ticket ID, Title, Status, Priority, Gate, Due Date, and Owner

3.2 WHEN a user clicks on a ticket row THEN the system SHALL CONTINUE TO open the detail panel on the right side with full ticket information

3.3 WHEN a user clicks on a cycle card THEN the system SHALL CONTINUE TO filter the ticket table to show only tickets from that cycle

3.4 WHEN Progress.html displays the header THEN the system SHALL CONTINUE TO show the project ID and title

3.5 WHEN a user clicks "← Back to Dashboard" THEN the system SHALL CONTINUE TO navigate to ALPS Prototype.html

3.6 WHEN Progress.html displays insight cards THEN the system SHALL CONTINUE TO show Total Tickets, In Progress, Overdue, and Bottleneck metrics

3.7 WHEN Progress.html applies filters (cycle, status, priority, assignee, search) THEN the system SHALL CONTINUE TO filter the ticket table accordingly

3.8 WHEN Progress.html displays ticket status badges THEN the system SHALL CONTINUE TO use the same color coding (done=green, in_progress=blue, blocked=red, todo=gray)

3.9 WHEN Progress.html displays overdue tickets THEN the system SHALL CONTINUE TO highlight them with red text and warning icon

3.10 WHEN Progress.html displays the detail panel THEN the system SHALL CONTINUE TO show Status, Priority, Assignee, Due Date, Linked Gate, Cycle, Description, and Git Activity sections

3.11 WHEN a user edits a ticket field in the detail panel THEN the system SHALL validate the input and show appropriate error messages for invalid data

3.12 WHEN a user saves ticket edits THEN the system SHALL persist the changes and update the ticket table view to reflect the new values
