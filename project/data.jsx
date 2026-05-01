// ============================================================
// Enhanced Sample data — Single project with sprints, cycles, tickets
// ============================================================

const PEOPLE = {
  asha: { id: "asha", name: "Asha Pillai", fullName: "Asha Pillai", role: "Requestor — Marketing", initials: "AP" },
  rina: { id: "rina", name: "Rina Hartono", fullName: "Rina Hartono", role: "Product Manager", initials: "RH" },
  mateo: { id: "mateo", name: "Mateo Cabrera", fullName: "Mateo Cabrera", role: "Tech Lead — Platform", initials: "MC" },
  jun: { id: "jun", name: "Jun Park", fullName: "Jun Park", role: "Developer — Backend", initials: "JP" },
  lena: { id: "lena", name: "Lena Okafor", fullName: "Lena Okafor", role: "Developer — Frontend", initials: "LO" },
  sven: { id: "sven", name: "Sven Aaltonen", fullName: "Sven Aaltonen", role: "Engineering Manager", initials: "SA" },
  priya: { id: "priya", name: "Priya Raman", fullName: "Priya Raman", role: "Stakeholder — Ops", initials: "PR" },
};

// Single project: Recurring Engine
const PROJECT = {
  id: "ALPS-218",
  title: "Recurring Engine — Subscription Billing",
  summary: "Move from manual monthly invoicing to a scheduled, retry-aware billing engine. Reduces ops effort and surfaces failed payments in real time.",
  requestor: "asha",
  pm: "rina",
  techLead: "mateo",
  submitted: "2026-04-08",
  targetDelivery: "2026-07-15",
  state: "in_progress",
  currentGate: 2,
  gates: {
    business: {
      status: "cleared",
      clearedOn: "2026-04-12",
      clearedBy: "rina",
      completeness: 100,
      criteria: [
        "Validates ROI: Reduce ops effort by 60%",
        "Success metrics: Invoice failure rate < 1.2%, revenue consistency +5%",
        "Aligns with Q3 product roadmap",
        "Key stakeholders aligned: Marketing, Finance, Ops",
      ],
    },
    product: {
      status: "in_progress",
      startedOn: "2026-04-15",
      completeness: 72,
      criteria: [
        "Admin dashboard for retry configuration & monitoring",
        "Customer portal: subscription management & payment methods",
        "Failed payment recovery flow with email notifications",
        "Dunning rules engine: per-product policies",
        "Webhook notifications to CRM/Analytics for integration",
      ],
    },
    tech: {
      status: "locked",
      completeness: 0,
      criteria: [],
    },
  },
  blockers: 0,
  dependencies: ["Payments API v3", "Customer 360"],
  tags: ["billing", "platform", "Q3"],
  changeLog: [
    { gate: "business", date: "2026-04-12", action: "cleared", by: "rina", note: "ROI validated, stakeholder alignment confirmed" },
    { gate: "product", date: "2026-04-20", action: "criteria_updated", by: "rina", note: "Added webhook requirement based on ops feedback" },
    { gate: "product", date: "2026-04-15", action: "started", by: "rina", note: "Design review passed, implementation begins" },
  ],
};

// Sprints / Cycles
const SPRINTS = [
  {
    id: "sprint-1",
    name: "Sprint 1 — Foundation",
    cycle: "Q2 2026",
    status: "completed",
    startDate: "2026-04-01",
    endDate: "2026-04-14",
    tickets: ["LIN-201", "LIN-202", "LIN-203", "LIN-204"],
    completedTickets: 4,
    totalTickets: 4,
  },
  {
    id: "sprint-2",
    name: "Sprint 2 — Core Logic",
    cycle: "Q2 2026",
    status: "in_progress",
    startDate: "2026-04-15",
    endDate: "2026-04-28",
    tickets: ["LIN-205", "LIN-206", "LIN-207", "LIN-208", "LIN-209", "LIN-210"],
    completedTickets: 3,
    totalTickets: 6,
  },
  {
    id: "sprint-3",
    name: "Sprint 3 — Retry & Edge Cases",
    cycle: "Q3 2026",
    status: "planned",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    tickets: ["LIN-211", "LIN-212", "LIN-213", "LIN-214"],
    completedTickets: 0,
    totalTickets: 4,
  },
  {
    id: "sprint-4",
    name: "Sprint 4 — Integration & Testing",
    cycle: "Q3 2026",
    status: "planned",
    startDate: "2026-05-15",
    endDate: "2026-05-28",
    tickets: ["LIN-215", "LIN-216", "LIN-217"],
    completedTickets: 0,
    totalTickets: 3,
  },
];

// Linear Tickets (referenced from GitLab)
const LINEAR_TICKETS = {
  "LIN-201": { 
    id: "LIN-201", title: "Design payment retry state machine", status: "done", assignee: "rina", priority: "high", created: "2026-03-28", gitlabIssue: "#542", progress: 100, description: "Define state transitions for payment retry logic",
    techSpecs: [
      { label: "Stack", value: "TypeScript + State Machine XState library" },
      { label: "Database", value: "PostgreSQL with retry_states table" },
      { label: "States", value: "pending → retrying → success | exhausted | failed" },
      { label: "Deliverables", value: "State diagram + implementation guide" },
    ],
    acceptanceCriteria: ["State diagram documented", "XState machine implemented", "All transitions tested", "Design review approved"],
  },
  "LIN-202": { 
    id: "LIN-202", title: "Set up database schema for billing", status: "done", assignee: "jun", priority: "high", created: "2026-03-29", gitlabIssue: "#543", progress: 100, description: "Create tables for invoices, transactions, retry logs",
    techSpecs: [
      { label: "Database", value: "PostgreSQL 14+" },
      { label: "Tables", value: "invoices, transactions, retry_attempts, dunning_logs" },
      { label: "Indexes", value: "customer_id, status, created_at for performance" },
      { label: "Migrations", value: "Alembic for schema version control" },
    ],
    acceptanceCriteria: ["All tables created", "Indexes optimized", "Migrations tested", "Data model reviewed by tech lead"],
  },
  "LIN-203": { 
    id: "LIN-203", title: "Create billing service skeleton", status: "done", assignee: "jun", priority: "high", created: "2026-04-01", gitlabIssue: "#544", progress: 100, description: "Set up API endpoints and service structure",
    techSpecs: [
      { label: "Framework", value: "FastAPI + Python 3.11" },
      { label: "Base Path", value: "/api/v1/billing" },
      { label: "Endpoints", value: "GET /invoices, POST /retry, PATCH /dunning-rules" },
      { label: "Auth", value: "OAuth 2.0 + JWT bearer tokens" },
    ],
    acceptanceCriteria: ["Service scaffolding complete", "Auth middleware integrated", "Logging configured", "Health check endpoint working"],
  },
  "LIN-204": { 
    id: "LIN-204", title: "Auth & permissions for billing admin", status: "done", assignee: "lena", priority: "medium", created: "2026-04-05", gitlabIssue: "#545", progress: 100, description: "RBAC for billing dashboard access",
    techSpecs: [
      { label: "Auth", value: "OAuth 2.0 with roles (admin, viewer, editor)" },
      { label: "Permissions", value: "view_invoices, edit_dunning_rules, export_reports" },
      { label: "Audit", value: "Log all admin actions to audit_log table" },
    ],
    acceptanceCriteria: ["RBAC implemented", "All roles tested", "Audit logging working", "Permissions documented"],
  },
  "LIN-205": { 
    id: "LIN-205", title: "Implement retry logic with exponential backoff", status: "in_progress", assignee: "jun", priority: "high", created: "2026-04-10", gitlabIssue: "#546", progress: 75, description: "1s, 2s, 4s, 8s, 16s max with jitter",
    techSpecs: [
      { label: "Algorithm", value: "Exponential backoff: 2^attempt + jitter (±10%)" },
      { label: "Max Wait", value: "16 seconds between retries" },
      { label: "Max Attempts", value: "5 retries over 72 hours" },
      { label: "Queue", value: "Celery with Redis backend for job scheduling" },
    ],
    acceptanceCriteria: ["Backoff calculation correct", "Jitter applied", "Max attempts enforced", "Timing verified in tests"],
  },
  "LIN-206": { 
    id: "LIN-206", title: "Build billing dashboard UI", status: "in_progress", assignee: "lena", priority: "high", created: "2026-04-11", gitlabIssue: "#547", progress: 60, description: "Invoice list, detail view, export capabilities",
    techSpecs: [
      { label: "Frontend", value: "React 18 + TypeScript" },
      { label: "State", value: "React Query for server state, Zustand for UI state" },
      { label: "Tables", value: "TanStack Table v8 with sorting, filtering, pagination" },
      { label: "Export", value: "CSV/PDF via client-side libraries" },
    ],
    acceptanceCriteria: ["Invoice list with pagination (50 items/page)", "Sort by date/amount/status", "Export to CSV/PDF", "Responsive on mobile", "Loading & error states"],
  },
  "LIN-207": { 
    id: "LIN-207", title: "Email notifications for failed payments", status: "done", assignee: "lena", priority: "medium", created: "2026-04-12", gitlabIssue: "#548", progress: 100, description: "Transactional emails with retry count",
    techSpecs: [
      { label: "Service", value: "SendGrid / Brevo" },
      { label: "Templates", value: "Handlebars + MJML for responsive emails" },
      { label: "Personalization", value: "Customer name, amount, retry count, next attempt time" },
      { label: "Tracking", value: "Open/click tracking, unsubscribe link" },
    ],
    acceptanceCriteria: ["Email templates created", "Variables passed correctly", "Tracking enabled", "Unsubscribe compliant"],
  },
  "LIN-208": { 
    id: "LIN-208", title: "Webhook fan-out to CRM/Analytics", status: "blocked", assignee: "jun", priority: "high", created: "2026-04-14", gitlabIssue: "#549", progress: 20, blockedBy: "Payments API v3 delay", description: "Emit events for downstream systems",
    techSpecs: [
      { label: "Events", value: "payment.failed, payment.succeeded, subscription.at_risk" },
      { label: "Delivery", value: "HTTP webhooks with HMAC-SHA256 signature" },
      { label: "Retry", value: "Exponential backoff, 72hr TTL, dead-letter queue" },
      { label: "Consumers", value: "Salesforce CRM, Mixpanel analytics, Slack" },
    ],
    acceptanceCriteria: ["Webhook endpoints created", "Signatures verified", "Retry logic tested", "Consumer integrations working"],
  },
  "LIN-209": { 
    id: "LIN-209", title: "Dunning rules configuration", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-18", gitlabIssue: "#550", progress: 0, description: "Admin UI for per-product dunning policies",
    techSpecs: [
      { label: "Data Model", value: "dunning_rules with max_attempts, retry_window, on_exhaustion" },
      { label: "UI", value: "React form builder with rule templates" },
      { label: "Scenarios", value: "SaaS (auto-cancel after 10), Subscription (72hr window)" },
      { label: "Preview", value: "Dry-run to show retry schedule before save" },
    ],
    acceptanceCriteria: ["Rules CRUD API", "Admin UI with form validation", "Rule templates for common scenarios", "Preview/dry-run feature", "Audit trail of changes"],
  },
  "LIN-210": { 
    id: "LIN-210", title: "Customer portal: subscription management", status: "todo", assignee: "lena", priority: "high", created: "2026-04-20", gitlabIssue: "#551", progress: 0, description: "View subscriptions, update payment methods, cancel",
    techSpecs: [
      { label: "Frontend", value: "Next.js 14 + TypeScript" },
      { label: "Auth", value: "JWT from main auth service" },
      { label: "Payment Input", value: "Stripe Elements for PCI compliance" },
      { label: "Styling", value: "Tailwind CSS, responsive mobile-first" },
    ],
    acceptanceCriteria: ["List active subscriptions", "Update payment method securely", "View recovery status timeline", "Cancel subscription", "Mobile responsive", "Loading & error states"],
  },
  "LIN-211": { 
    id: "LIN-211", title: "Handle partial refunds during retry", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-22", gitlabIssue: "#552", progress: 0, description: "Edge case: refund issued mid-retry cycle",
    techSpecs: [
      { label: "Logic", value: "Detect refund webhook, pause retry state machine" },
      { label: "Reconciliation", value: "Compare invoice vs actual transaction amounts" },
      { label: "Notification", value: "Emit event for CRM/ops team" },
    ],
    acceptanceCriteria: ["Refund detection working", "Retry paused correctly", "Reconciliation tests pass", "Event emission verified"],
  },
  "LIN-212": { 
    id: "LIN-212", title: "Subscription cancellation mid-retry", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-23", gitlabIssue: "#553", progress: 0, description: "Handle state when user cancels during retry",
    techSpecs: [
      { label: "Trigger", value: "Listen to subscription.cancelled event" },
      { label: "Action", value: "Transition state machine to 'cancelled', skip pending retries" },
      { label: "Cleanup", value: "Mark retry_attempts as 'cancelled'" },
    ],
    acceptanceCriteria: ["Cancellation detected", "Retries halted", "State cleaned up", "Tests verify edge cases"],
  },
  "LIN-213": { 
    id: "LIN-213", title: "Cascading failure handling", status: "todo", assignee: "jun", priority: "high", created: "2026-04-24", gitlabIssue: "#554", progress: 0, description: "Prevent one failure from cascading to other systems",
    techSpecs: [
      { label: "Pattern", value: "Circuit breaker for downstream calls" },
      { label: "Fallback", value: "Graceful degradation, queue for async retry" },
      { label: "Isolation", value: "Each webhook consumer isolated with timeout" },
      { label: "Monitoring", value: "Alert on circuit breaker trips" },
    ],
    acceptanceCriteria: ["Circuit breaker implemented", "Timeouts enforced", "Fallbacks working", "Monitoring alerts firing"],
  },
  "LIN-214": { 
    id: "LIN-214", title: "Load testing & performance tuning", status: "todo", assignee: "mateo", priority: "high", created: "2026-04-25", gitlabIssue: "#555", progress: 0, description: "Test 1000s of concurrent retries",
    techSpecs: [
      { label: "Tool", value: "Locust / K6 for load testing" },
      { label: "Scenario", value: "10k concurrent retries, 100 req/sec sustained" },
      { label: "Targets", value: "p99 latency < 500ms, db connection pooling" },
      { label: "Profiling", value: "Flame graphs, database slow query logs" },
    ],
    acceptanceCriteria: ["Load test suite created", "Baseline metrics recorded", "Bottlenecks identified", "Performance targets met"],
  },
  "LIN-215": { 
    id: "LIN-215", title: "E2E tests for full billing flow", status: "todo", assignee: "lena", priority: "high", created: "2026-04-26", gitlabIssue: "#556", progress: 0, description: "Integration tests across all components",
    techSpecs: [
      { label: "Framework", value: "Playwright / Cypress for browser automation" },
      { label: "Coverage", value: "Happy path + 5 failure scenarios" },
      { label: "Test Data", value: "Seed database with test customers/invoices" },
      { label: "CI", value: "Run on every PR, report coverage" },
    ],
    acceptanceCriteria: ["E2E tests for 5+ scenarios", "Coverage > 80%", "CI integration", "Runs under 10 minutes"],
  },
  "LIN-216": { 
    id: "LIN-216", title: "Integration with Payments API v3", status: "todo", assignee: "jun", priority: "critical", created: "2026-04-27", gitlabIssue: "#557", progress: 0, description: "Connect to new payments provider API",
    techSpecs: [
      { label: "Provider", value: "Stripe Billing API v3 / Braintree" },
      { label: "SDK", value: "Official provider SDK with type definitions" },
      { label: "Methods", value: "charge, refund, retrieve_invoice, retry_payment" },
      { label: "Error Handling", value: "Idempotency keys, retry on network errors" },
    ],
    acceptanceCriteria: ["SDK integrated", "All required methods working", "Idempotency tested", "Error handling verified", "Secrets managed securely"],
  },
  "LIN-217": { 
    id: "LIN-217", title: "Production readiness review", status: "todo", assignee: "mateo", priority: "high", created: "2026-04-28", gitlabIssue: "#558", progress: 0, description: "Security, performance, monitoring audit",
    techSpecs: [
      { label: "Security", value: "OWASP Top 10 review, penetration test" },
      { label: "Monitoring", value: "Datadog dashboards, PagerDuty alerts" },
      { label: "Logging", value: "Structured logging to ELK stack" },
      { label: "Documentation", value: "Runbooks, incident response guides" },
    ],
    acceptanceCriteria: ["Security audit passed", "Monitoring dashboards live", "Logging working", "Runbooks documented", "Team trained"],
  },
};

// Attachments per ticket
const TICKET_ATTACHMENTS = {
  "LIN-206": [
    { id: "att-1", name: "dashboard-wireframes.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "lena", uploadedAt: "2 days ago", url: "#" },
    { id: "att-2", name: "invoice-ui-mockup.figma", type: "Figma", size: "—", uploadedBy: "lena", uploadedAt: "1 day ago", url: "#" },
    { id: "att-3", name: "accessibility-audit.pdf", type: "PDF", size: "1.1 MB", uploadedBy: "mateo", uploadedAt: "6 hours ago", url: "#" },
  ],
  "LIN-205": [
    { id: "att-1", name: "retry-algorithm-spec.md", type: "Markdown", size: "45 KB", uploadedBy: "jun", uploadedAt: "3 days ago", url: "#" },
    { id: "att-2", name: "backoff-calculation-tests.py", type: "Python", size: "12 KB", uploadedBy: "jun", uploadedAt: "1 day ago", url: "#" },
  ],
  "LIN-207": [
    { id: "att-1", name: "email-templates.zip", type: "ZIP", size: "340 KB", uploadedBy: "lena", uploadedAt: "4 days ago", url: "#" },
    { id: "att-2", name: "email-performance-metrics.xlsx", type: "Excel", size: "256 KB", uploadedBy: "lena", uploadedAt: "2 hours ago", url: "#" },
  ],
  "LIN-210": [
    { id: "att-1", name: "customer-portal-design.figma", type: "Figma", size: "—", uploadedBy: "lena", uploadedAt: "5 days ago", url: "#" },
  ],
};

// GitLab activity per ticket
const TICKET_GITLAB_ACTIVITY = {
  "LIN-206": [
    { id: 1, type: "commit", ref: "feat/dashboard-ui", author: "lena", at: "1 hour ago", message: "Add invoice list table component" },
    { id: 2, type: "mr", ref: "!342", author: "lena", at: "2 hours ago", message: "Draft: Dashboard UI scaffolding (WIP)" },
    { id: 3, type: "commit", ref: "feat/dashboard-ui", author: "lena", at: "3 hours ago", message: "Setup dashboard layout and routing" },
  ],
  "LIN-205": [
    { id: 1, type: "commit", ref: "feat/retry-logic", author: "jun", at: "30 min ago", message: "Implement exponential backoff with jitter" },
    { id: 2, type: "commit", ref: "feat/retry-logic", author: "jun", at: "1 hour ago", message: "Add state machine for retry transitions" },
    { id: 3, type: "mr", ref: "!341", author: "jun", at: "2 hours ago", message: "WIP: Retry logic implementation" },
  ],
  "LIN-208": [
    { id: 1, type: "comment", author: "jun", at: "4 hours ago", message: "Waiting on Payments API v3 docs. Should arrive by EOD tomorrow." },
  ],
};

// Discussion threads per ticket
const TICKET_DISCUSSIONS = {
  "LIN-206": [
    { id: 1, author: "lena", time: "2 hours ago", text: "Started working on the dashboard today. Basic table layout is done." },
    { id: 2, author: "rina", time: "1.5 hours ago", text: "Great! Does it handle pagination for large invoice lists?" },
    { id: 3, author: "lena", time: "1 hour ago", text: "Not yet — working on that next. Thinking 50 invoices per page." },
    { id: 4, author: "mateo", time: "45 min ago", text: "Make sure to handle loading states and error cases too." },
    { id: 5, author: "lena", time: "20 min ago", text: "Will add those. Also added export to CSV feature as a bonus." },
  ],
  "LIN-205": [
    { id: 1, author: "jun", time: "1 hour ago", text: "Exponential backoff is live. Testing with edge cases now." },
    { id: 2, author: "mateo", time: "50 min ago", text: "What's the max retry limit?" },
    { id: 3, author: "jun", time: "40 min ago", text: "5 retries total, max wait of 16 seconds before giving up." },
    { id: 4, author: "rina", time: "30 min ago", text: "Perfect. That aligns with our dunning strategy." },
  ],
  "LIN-208": [
    { id: 1, author: "jun", time: "6 hours ago", text: "Blocked on Payments API v3 release. Expected next week." },
    { id: 2, author: "rina", time: "5 hours ago", text: "Can we start with a mock to unblock the webhook logic?" },
    { id: 3, author: "jun", time: "4 hours ago", text: "Good idea. I'll stub it out so we can test the flow." },
  ],
};

// AI suggestions per ticket (auto-consolidated from activity + discussion)
const TICKET_AI_SUGGESTIONS = {
  "LIN-206": {
    id: "sug-206",
    ticketId: "LIN-206",
    status: "pending_approval",
    type: "scope_update",
    targetGate: "product",
    suggestion: "Update ticket scope: Add pagination (50 items/page), export to CSV, loading + error states",
    rationale: "Lena mentioned these features in discussion; consolidating from 5 comments + GitLab commits",
    suggestedBy: "claude",
    createdAt: "1 hour ago",
  },
  "LIN-205": {
    id: "sug-205",
    ticketId: "LIN-205",
    status: "approved",
    type: "acceptance_criteria",
    targetGate: "tech",
    suggestion: "Update acceptance criteria: Max 5 retries, exponential backoff (1s → 16s), jitter enabled",
    rationale: "Jun confirmed implementation matches spec",
    suggestedBy: "claude",
    createdAt: "30 min ago",
    appliedTo: "tech_gate_criteria",
  },
  "LIN-208": {
    id: "sug-208",
    ticketId: "LIN-208",
    status: "pending_approval",
    type: "unblock_strategy",
    targetGate: "tech",
    suggestion: "Unblock: Create mock Payments API v3 endpoints. Jun stubs them while waiting for real API.",
    rationale: "Team consensus in discussion thread; viable workaround for blocked state",
    suggestedBy: "claude",
    createdAt: "45 min ago",
  },
};

// Export all data structures to window (Icon, Avatar, Section come from primitives.jsx)
Object.assign(window, {
  PROJECT,
  PEOPLE,
  SPRINTS,
  CYCLES,
  GITLAB_ACTIVITY,
  LINEAR_TICKETS,
  TICKET_GITLAB_ACTIVITY,
  TICKET_DISCUSSIONS,
  TICKET_AI_SUGGESTIONS,
  TICKET_ATTACHMENTS,
  DISCUSSION_THREAD,
});


// Comprehensive GitLab Activity with realistic commits
const GITLAB_ACTIVITY = [
  { id: "g1", type: "branch", ref: "feat/billing-retry-logic", who: "jun", at: "2026-04-25 08:30", status: "active" },
  { id: "g2", type: "commit", ref: "a7c3f2e — Add exponential backoff calculator", who: "jun", at: "2026-04-26 10:15", message: "Implements retry delay: 1s, 2s, 4s, 8s, 16s max" },
  { id: "g3", type: "commit", ref: "b91d8a4 — Add retry state tracking to db", who: "jun", at: "2026-04-26 14:22", message: "Track attempt count and last retry timestamp" },
  { id: "g4", type: "mr", ref: "!501 — Billing retry logic + tests", who: "jun", at: "2026-04-27 09:05", status: "review", checks: { ci: "pass", security: "pass", coverage: "87%" } },
  { id: "g5", type: "branch", ref: "feat/dashboard-ui", who: "lena", at: "2026-04-24 11:00", status: "active" },
  { id: "g6", type: "commit", ref: "c4e2a91 — Dashboard layout & invoice list", who: "lena", at: "2026-04-25 16:45", message: "Added sortable table, filters, real-time status" },
  { id: "g7", type: "mr", ref: "!502 — Billing dashboard + responsive design", who: "lena", at: "2026-04-27 14:30", status: "review", checks: { ci: "pass", security: "pass", coverage: "92%" } },
  { id: "g8", type: "commit", ref: "d6b5c12 — Fix: notification email template", who: "lena", at: "2026-04-27 17:20", message: "Added Handlebars templating, dynamic vars" },
  { id: "g9", type: "branch", ref: "fix/webhook-retry-timeout", who: "jun", at: "2026-04-28 09:10", status: "active" },
  { id: "g10", type: "commit", ref: "e8f1a33 — Webhook retry with circuit breaker", who: "jun", at: "2026-04-28 11:50", message: "Prevents cascade failures, 30s timeout, 3 retries" },
  { id: "g11", type: "mr", ref: "!503 — Webhook resilience improvements", who: "jun", at: "2026-04-28 15:00", status: "draft", checks: { ci: "running", security: "pending", coverage: "—" } },
];

// Discussion Thread — Stakeholder / Developer conversation
const DISCUSSION_THREAD = [
  {
    id: "d1",
    author: "priya",
    role: "Stakeholder",
    text: "Question on implementation: if a payment fails 5 times, do we auto-cancel the subscription or keep retrying indefinitely?",
    at: "2026-04-20 09:30",
    replies: [],
  },
  {
    id: "d2",
    author: "jun",
    role: "Developer",
    text: "Good point. Currently designed to retry up to 5 times over 72 hours, then flag for manual review. Auto-cancellation is risky — some failures are transient (network blip). Let's keep the manual review for now.",
    at: "2026-04-20 10:15",
    replies: [],
  },
  {
    id: "d3",
    author: "rina",
    role: "Product Manager",
    text: "Agree with Jun. But we should add a configurable threshold per product. SaaS products might want auto-cancel after 10 failures, while recurring services might want longer retry windows. @Mateo, is this feasible in the current arch?",
    at: "2026-04-20 11:05",
    replies: [],
  },
  {
    id: "d4",
    author: "mateo",
    role: "Tech Lead",
    text: "Yes, totally feasible. We can add a `retry_policy` config per product with fields: max_attempts, retry_window, on_exhaustion (manual_review | auto_cancel | notify_only). I'll add to sprint 3.",
    at: "2026-04-20 11:45",
    replies: [],
  },
  {
    id: "d5",
    author: "asha",
    role: "Requestor",
    text: "Perfect. This also unblocks the GTM team — we can tell enterprise customers we support their dunning rules without custom code. When does sprint 3 start?",
    at: "2026-04-20 14:20",
    replies: [],
  },
  {
    id: "d6",
    author: "mateo",
    role: "Tech Lead",
    text: "Sprint 3 kicks off May 1st. We'll have LIN-211, LIN-212 (edge cases) + the new retry_policy work done by mid-May. Should be solid for beta in June.",
    at: "2026-04-20 15:00",
    replies: [],
  },
  {
    id: "d7",
    author: "priya",
    role: "Stakeholder",
    text: "Great. One more thing: can we add a webhook notification when a subscription is about to expire due to repeated failures? Our ops team needs 24hr warning.",
    at: "2026-04-21 08:45",
    replies: [],
  },
  {
    id: "d8",
    author: "lena",
    role: "Developer",
    text: "Already in LIN-208 (webhook fan-out). We're sending events to both CRM and analytics. Ops can subscribe to the `subscription.at_risk` event and trigger their workflow. I'll add docs on the webhook schema.",
    at: "2026-04-21 09:30",
    replies: [],
  },
  {
    id: "d9",
    author: "asha",
    role: "Requestor",
    text: "Excellent. This is exactly what marketing needs to retain high-value customers. Team is excited about the timeline. 🚀",
    at: "2026-04-21 10:15",
    replies: [],
  },
];

// Cycles / Releases
const CYCLES = [
  {
    id: "cycle-q2",
    name: "Q2 2026",
    status: "in_progress",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    sprints: ["sprint-1", "sprint-2"],
  },
  {
    id: "cycle-q3",
    name: "Q3 2026",
    status: "planned",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    sprints: ["sprint-3", "sprint-4"],
  },
];

Object.assign(window, {
  PEOPLE,
  PROJECT,
  SPRINTS,
  LINEAR_TICKETS,
  GITLAB_ACTIVITY,
  DISCUSSION_THREAD,
  CYCLES,
});
