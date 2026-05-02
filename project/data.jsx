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
      owner: "rina",
      dueDate: "Apr 10",
      checklist: [
        { id: "b1", label: "Business Case", content: "Clear ROI: $2M annual revenue uplift, 15% margin improvement through automated recovery.", status: "complete", aiSuggestion: null },
        { id: "b2", label: "Success Metrics", content: "Payment success rate > 99.5%, churn reduction by 20%, dunning recovery rate > 35%.", status: "complete", aiSuggestion: null },
        { id: "b3", label: "Stakeholders", content: "CFO (James Okafor), VP Product (Priya Menon), Head of Growth (Dana Vasquez).", status: "complete", aiSuggestion: null },
        { id: "b4", label: "GTM / Rollout Plan", content: "Phased: Beta (10% users, Apr 28) → Stage (50%, May 10) → GA (100%, May 24).", status: "complete", aiSuggestion: null },
      ],
    },
    product: {
      status: "in_progress",
      startedOn: "2026-04-15",
      completeness: 70,
      owner: "rina",
      dueDate: "Apr 25",
      checklist: [
        { id: "p1", label: "User Flow", content: "Customer initiates payment → Retry logic (exp backoff) → Success/failure notification → Dunning email sequence.", status: "complete", aiSuggestion: null },
        { id: "p2", label: "Feature Breakdown", content: "Payment retry (exp backoff), dunning email sequence, billing dashboard UI, webhook fan-out.", status: "complete", aiSuggestion: null },
        { id: "p3", label: "Acceptance Criteria", content: "", status: "warning", aiSuggestion: "Add criteria: handle mid-dunning upgrades, SLA for retry timing (< 2h between retries), customer notification within 5 min of failure." },
        { id: "p4", label: "Edge Cases", content: "Customer cancels mid-process, timezone handling for dunning windows, partial refund during active retry.", status: "warning", aiSuggestion: null },
      ],
    },
    tech: {
      status: "locked",
      completeness: 20,
      owner: "mateo",
      dueDate: "May 5",
      checklist: [
        { id: "t1", label: "Technical Approach", content: "", status: "missing", aiSuggestion: "Consider queue-based retry (SQS/BullMQ), idempotent API design with idempotency keys, circuit breaker for payment provider." },
        { id: "t2", label: "Dependencies", content: "Payment gateway API (Stripe v3), SendGrid for transactional emails, PostgreSQL migrations, Redis for retry queue.", status: "warning", aiSuggestion: null },
        { id: "t3", label: "Constraints", content: "", status: "missing", aiSuggestion: "Define: max retry count (5), timeout windows (72h total), cost limits per failed invoice, GDPR data retention." },
        { id: "t4", label: "Timeline Impact", content: "", status: "missing", aiSuggestion: null },
      ],
    },
  },
  blockers: 1,
  dependencies: ["Payments API v3", "Customer 360"],
  tags: ["billing", "platform", "Q3"],
  changeLog: [
    { gate: "business", date: "2026-04-12", action: "cleared", by: "rina", note: "ROI validated, stakeholder alignment confirmed" },
    { gate: "product", date: "2026-04-20", action: "criteria_updated", by: "rina", note: "Added webhook requirement based on ops feedback" },
    { gate: "product", date: "2026-04-15", action: "started", by: "rina", note: "Design review passed, implementation begins" },
  ],
  completedTickets: 5,
  totalTickets: 17,
};

// Sprints / Cycles
const SPRINTS = [
  {
    id: "sprint-1",
    name: "Sprint 1 — Foundation",
    description: "Establish core infrastructure for payment summary migration: React component scaffolding, API endpoint design, and authentication framework. Focus on architectural foundations that enable rapid feature development in subsequent sprints.",
    cycle: "Q2 2026",
    projectId: "ALPS-301",
    status: "completed",
    startDate: "2026-04-01",
    endDate: "2026-04-14",
    completedTickets: 4,
    totalTickets: 4,
  },
  {
    id: "sprint-2",
    name: "Sprint 2 — Core Logic",
    description: "Implement retry logic with exponential backoff, build billing dashboard UI, and establish webhook fan-out architecture. Primary goal: deliver end-to-end payment retry flow with real-time status visibility.",
    cycle: "Q2 2026",
    projectId: "ALPS-218",
    status: "in_progress",
    startDate: "2026-04-15",
    endDate: "2026-04-28",
    completedTickets: 3,
    totalTickets: 6,
  },
  {
    id: "sprint-3",
    name: "Sprint 3 — Retry & Edge Cases",
    description: "Handle edge cases: partial refunds during retry, subscription cancellations mid-retry, cascading failure prevention. Includes load testing to validate system resilience under high concurrency.",
    cycle: "Q3 2026",
    projectId: "ALPS-218",
    status: "planned",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    completedTickets: 0,
    totalTickets: 4,
  },
  {
    id: "sprint-4",
    name: "Sprint 4 — Integration & Testing",
    description: "Complete integration with Payments API v3, implement end-to-end testing suite, and conduct production readiness review. Focus on security audit, monitoring setup, and deployment preparation.",
    cycle: "Q3 2026",
    projectId: "ALPS-218",
    status: "planned",
    startDate: "2026-05-15",
    endDate: "2026-05-28",
    completedTickets: 0,
    totalTickets: 3,
  },
  {
    id: "sprint-5",
    name: "Sprint 5 — Express Payment Migration",
    description: "Migrate payment summary HTML to React components, build API endpoints replacing PHP logic, and integrate A/B testing framework. Deliver production-ready React payment flow with feature flag controls.",
    cycle: "Q3 2026",
    projectId: "ALPS-301",
    status: "in_progress",
    startDate: "2026-07-01",
    endDate: "2026-07-14",
    completedTickets: 1,
    totalTickets: 3,
  },
];

// Linear Tickets (referenced from GitLab)
const LINEAR_TICKETS = {
  "LIN-201": { 
    id: "LIN-201", projectId: "ALPS-218", sprintId: "sprint-1", title: "Design payment retry state machine", status: "done", assignee: "rina", priority: "high", created: "2026-03-28", gitlabIssue: "#542", progress: 100, description: "Define state transitions for payment retry logic",
    techSpecs: [
      { label: "Stack", value: "TypeScript + State Machine XState library" },
      { label: "Database", value: "PostgreSQL with retry_states table" },
      { label: "States", value: "pending → retrying → success | exhausted | failed" },
      { label: "Deliverables", value: "State diagram + implementation guide" },
    ],
    acceptanceCriteria: ["State diagram documented", "XState machine implemented", "All transitions tested", "Design review approved"],
  },
  "LIN-202": { 
    id: "LIN-202", projectId: "ALPS-218", sprintId: "sprint-1", title: "Set up database schema for billing", status: "done", assignee: "jun", priority: "high", created: "2026-03-29", gitlabIssue: "#543", progress: 100, description: "Create tables for invoices, transactions, retry logs",
    techSpecs: [
      { label: "Database", value: "PostgreSQL 14+" },
      { label: "Tables", value: "invoices, transactions, retry_attempts, dunning_logs" },
      { label: "Indexes", value: "customer_id, status, created_at for performance" },
      { label: "Migrations", value: "Alembic for schema version control" },
    ],
    acceptanceCriteria: ["All tables created", "Indexes optimized", "Migrations tested", "Data model reviewed by tech lead"],
  },
  "LIN-203": { 
    id: "LIN-203", projectId: "ALPS-218", sprintId: "sprint-1", title: "Create billing service skeleton", status: "done", assignee: "jun", priority: "high", created: "2026-04-01", gitlabIssue: "#544", progress: 100, description: "Set up API endpoints and service structure",
    techSpecs: [
      { label: "Framework", value: "FastAPI + Python 3.11" },
      { label: "Base Path", value: "/api/v1/billing" },
      { label: "Endpoints", value: "GET /invoices, POST /retry, PATCH /dunning-rules" },
      { label: "Auth", value: "OAuth 2.0 + JWT bearer tokens" },
    ],
    acceptanceCriteria: ["Service scaffolding complete", "Auth middleware integrated", "Logging configured", "Health check endpoint working"],
  },
  "LIN-204": { 
    id: "LIN-204", projectId: "ALPS-218", sprintId: "sprint-1", title: "Auth & permissions for billing admin", status: "done", assignee: "lena", priority: "medium", created: "2026-04-05", gitlabIssue: "#545", progress: 100, description: "RBAC for billing dashboard access",
    techSpecs: [
      { label: "Auth", value: "OAuth 2.0 with roles (admin, viewer, editor)" },
      { label: "Permissions", value: "view_invoices, edit_dunning_rules, export_reports" },
      { label: "Audit", value: "Log all admin actions to audit_log table" },
    ],
    acceptanceCriteria: ["RBAC implemented", "All roles tested", "Audit logging working", "Permissions documented"],
  },
  "LIN-205": { 
    id: "LIN-205", projectId: "ALPS-218", sprintId: "sprint-2", title: "Implement retry logic with exponential backoff", status: "in_progress", assignee: "jun", priority: "high", created: "2026-04-10", gitlabIssue: "#546", progress: 75, description: "1s, 2s, 4s, 8s, 16s max with jitter",
    techSpecs: [
      { label: "Algorithm", value: "Exponential backoff: 2^attempt + jitter (±10%)" },
      { label: "Max Wait", value: "16 seconds between retries" },
      { label: "Max Attempts", value: "5 retries over 72 hours" },
      { label: "Queue", value: "Celery with Redis backend for job scheduling" },
    ],
    acceptanceCriteria: ["Backoff calculation correct", "Jitter applied", "Max attempts enforced", "Timing verified in tests"],
  },
  "LIN-206": { 
    id: "LIN-206", projectId: "ALPS-218", sprintId: "sprint-2", title: "Build billing dashboard UI", status: "in_progress", assignee: "lena", priority: "high", created: "2026-04-11", gitlabIssue: "#547", progress: 60, description: "Invoice list, detail view, export capabilities",
    techSpecs: [
      { label: "Frontend", value: "React 18 + TypeScript" },
      { label: "State", value: "React Query for server state, Zustand for UI state" },
      { label: "Tables", value: "TanStack Table v8 with sorting, filtering, pagination" },
      { label: "Export", value: "CSV/PDF via client-side libraries" },
    ],
    acceptanceCriteria: ["Invoice list with pagination (50 items/page)", "Sort by date/amount/status", "Export to CSV/PDF", "Responsive on mobile", "Loading & error states"],
  },
  "LIN-207": { 
    id: "LIN-207", projectId: "ALPS-218", sprintId: "sprint-2", title: "Email notifications for failed payments", status: "done", assignee: "lena", priority: "medium", created: "2026-04-12", gitlabIssue: "#548", progress: 100, description: "Transactional emails with retry count",
    techSpecs: [
      { label: "Service", value: "SendGrid / Brevo" },
      { label: "Templates", value: "Handlebars + MJML for responsive emails" },
      { label: "Personalization", value: "Customer name, amount, retry count, next attempt time" },
      { label: "Tracking", value: "Open/click tracking, unsubscribe link" },
    ],
    acceptanceCriteria: ["Email templates created", "Variables passed correctly", "Tracking enabled", "Unsubscribe compliant"],
  },
  "LIN-208": { 
    id: "LIN-208", projectId: "ALPS-218", sprintId: "sprint-2", title: "Webhook fan-out to CRM/Analytics", status: "blocked", assignee: "jun", priority: "high", created: "2026-04-14", gitlabIssue: "#549", progress: 20, blockedBy: "Payments API v3 delay", description: "Emit events for downstream systems",
    techSpecs: [
      { label: "Events", value: "payment.failed, payment.succeeded, subscription.at_risk" },
      { label: "Delivery", value: "HTTP webhooks with HMAC-SHA256 signature" },
      { label: "Retry", value: "Exponential backoff, 72hr TTL, dead-letter queue" },
      { label: "Consumers", value: "Salesforce CRM, Mixpanel analytics, Slack" },
    ],
    acceptanceCriteria: ["Webhook endpoints created", "Signatures verified", "Retry logic tested", "Consumer integrations working"],
  },
  "LIN-209": { 
    id: "LIN-209", projectId: "ALPS-218", sprintId: "sprint-2", title: "Dunning rules configuration", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-18", gitlabIssue: "#550", progress: 0, description: "Admin UI for per-product dunning policies",
    techSpecs: [
      { label: "Data Model", value: "dunning_rules with max_attempts, retry_window, on_exhaustion" },
      { label: "UI", value: "React form builder with rule templates" },
      { label: "Scenarios", value: "SaaS (auto-cancel after 10), Subscription (72hr window)" },
      { label: "Preview", value: "Dry-run to show retry schedule before save" },
    ],
    acceptanceCriteria: ["Rules CRUD API", "Admin UI with form validation", "Rule templates for common scenarios", "Preview/dry-run feature", "Audit trail of changes"],
  },
  "LIN-210": { 
    id: "LIN-210", projectId: "ALPS-218", sprintId: "sprint-2", title: "Customer portal: subscription management", status: "todo", assignee: "lena", priority: "high", created: "2026-04-20", gitlabIssue: "#551", progress: 0, description: "View subscriptions, update payment methods, cancel",
    techSpecs: [
      { label: "Frontend", value: "Next.js 14 + TypeScript" },
      { label: "Auth", value: "JWT from main auth service" },
      { label: "Payment Input", value: "Stripe Elements for PCI compliance" },
      { label: "Styling", value: "Tailwind CSS, responsive mobile-first" },
    ],
    acceptanceCriteria: ["List active subscriptions", "Update payment method securely", "View recovery status timeline", "Cancel subscription", "Mobile responsive", "Loading & error states"],
  },
  "LIN-211": { 
    id: "LIN-211", projectId: "ALPS-218", sprintId: "sprint-3", title: "Handle partial refunds during retry", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-22", gitlabIssue: "#552", progress: 0, description: "Edge case: refund issued mid-retry cycle",
    techSpecs: [
      { label: "Logic", value: "Detect refund webhook, pause retry state machine" },
      { label: "Reconciliation", value: "Compare invoice vs actual transaction amounts" },
      { label: "Notification", value: "Emit event for CRM/ops team" },
    ],
    acceptanceCriteria: ["Refund detection working", "Retry paused correctly", "Reconciliation tests pass", "Event emission verified"],
  },
  "LIN-212": { 
    id: "LIN-212", projectId: "ALPS-218", sprintId: "sprint-3", title: "Subscription cancellation mid-retry", status: "todo", assignee: "jun", priority: "medium", created: "2026-04-23", gitlabIssue: "#553", progress: 0, description: "Handle state when user cancels during retry",
    techSpecs: [
      { label: "Trigger", value: "Listen to subscription.cancelled event" },
      { label: "Action", value: "Transition state machine to 'cancelled', skip pending retries" },
      { label: "Cleanup", value: "Mark retry_attempts as 'cancelled'" },
    ],
    acceptanceCriteria: ["Cancellation detected", "Retries halted", "State cleaned up", "Tests verify edge cases"],
  },
  "LIN-213": { 
    id: "LIN-213", projectId: "ALPS-218", sprintId: "sprint-3", title: "Cascading failure handling", status: "todo", assignee: "jun", priority: "high", created: "2026-04-24", gitlabIssue: "#554", progress: 0, description: "Prevent one failure from cascading to other systems",
    techSpecs: [
      { label: "Pattern", value: "Circuit breaker for downstream calls" },
      { label: "Fallback", value: "Graceful degradation, queue for async retry" },
      { label: "Isolation", value: "Each webhook consumer isolated with timeout" },
      { label: "Monitoring", value: "Alert on circuit breaker trips" },
    ],
    acceptanceCriteria: ["Circuit breaker implemented", "Timeouts enforced", "Fallbacks working", "Monitoring alerts firing"],
  },
  "LIN-214": { 
    id: "LIN-214", projectId: "ALPS-218", sprintId: "sprint-3", title: "Load testing & performance tuning", status: "todo", assignee: "mateo", priority: "high", created: "2026-04-25", gitlabIssue: "#555", progress: 0, description: "Test 1000s of concurrent retries",
    techSpecs: [
      { label: "Tool", value: "Locust / K6 for load testing" },
      { label: "Scenario", value: "10k concurrent retries, 100 req/sec sustained" },
      { label: "Targets", value: "p99 latency < 500ms, db connection pooling" },
      { label: "Profiling", value: "Flame graphs, database slow query logs" },
    ],
    acceptanceCriteria: ["Load test suite created", "Baseline metrics recorded", "Bottlenecks identified", "Performance targets met"],
  },
  "LIN-215": { 
    id: "LIN-215", projectId: "ALPS-218", sprintId: "sprint-4", title: "E2E tests for full billing flow", status: "todo", assignee: "lena", priority: "high", created: "2026-04-26", gitlabIssue: "#556", progress: 0, description: "Integration tests across all components",
    techSpecs: [
      { label: "Framework", value: "Playwright / Cypress for browser automation" },
      { label: "Coverage", value: "Happy path + 5 failure scenarios" },
      { label: "Test Data", value: "Seed database with test customers/invoices" },
      { label: "CI", value: "Run on every PR, report coverage" },
    ],
    acceptanceCriteria: ["E2E tests for 5+ scenarios", "Coverage > 80%", "CI integration", "Runs under 10 minutes"],
  },
  "LIN-216": { 
    id: "LIN-216", projectId: "ALPS-218", sprintId: "sprint-4", title: "Integration with Payments API v3", status: "todo", assignee: "jun", priority: "critical", created: "2026-04-27", gitlabIssue: "#557", progress: 0, description: "Connect to new payments provider API",
    techSpecs: [
      { label: "Provider", value: "Stripe Billing API v3 / Braintree" },
      { label: "SDK", value: "Official provider SDK with type definitions" },
      { label: "Methods", value: "charge, refund, retrieve_invoice, retry_payment" },
      { label: "Error Handling", value: "Idempotency keys, retry on network errors" },
    ],
    acceptanceCriteria: ["SDK integrated", "All required methods working", "Idempotency tested", "Error handling verified", "Secrets managed securely"],
  },
  "LIN-217": { 
    id: "LIN-217", projectId: "ALPS-218", sprintId: "sprint-4", title: "Production readiness review", status: "todo", assignee: "mateo", priority: "high", created: "2026-04-28", gitlabIssue: "#558", progress: 0, description: "Security, performance, monitoring audit",
    techSpecs: [
      { label: "Security", value: "OWASP Top 10 review, penetration test" },
      { label: "Monitoring", value: "Datadog dashboards, PagerDuty alerts" },
      { label: "Logging", value: "Structured logging to ELK stack" },
      { label: "Documentation", value: "Runbooks, incident response guides" },
    ],
    acceptanceCriteria: ["Security audit passed", "Monitoring dashboards live", "Logging working", "Runbooks documented", "Team trained"],
  },
  // ALPS-301 tickets
  "LIN-301": {
    id: "LIN-301", projectId: "ALPS-301", sprintId: "sprint-5", title: "Migrate payment summary HTML to React components", status: "done",
    assignee: "lena", priority: "high", created: "2026-05-02", gitlabIssue: "#601", progress: 100,
    description: "Replace the legacy PHP-rendered payment summary template with a React component tree. Maintain visual parity with the existing layout.",
    techSpecs: [
      { label: "Framework", value: "React 18 + TypeScript" },
      { label: "Styling", value: "CSS Modules, matching existing Design System v2 tokens" },
      { label: "Testing", value: "Storybook stories + Playwright visual regression" },
      { label: "Deliverables", value: "PaymentSummary, LineItem, OrderTotal, PromoCode components" },
    ],
    acceptanceCriteria: ["Visual parity with PHP output (< 2% pixel diff)", "All existing props supported", "Storybook stories published", "Accessibility audit passed (WCAG 2.1 AA)"],
  },
  "LIN-302": {
    id: "LIN-302", projectId: "ALPS-301", sprintId: "sprint-5", title: "Build API endpoints replacing PHP payment logic", status: "in_progress",
    assignee: "jun", priority: "high", created: "2026-05-05", gitlabIssue: "#602", progress: 40,
    blockedBy: "Payments API v3 access pending",
    description: "Create REST API endpoints that replicate the business logic currently embedded in PHP. Required before the React component can go live.",
    techSpecs: [
      { label: "Stack", value: "Node.js 20 + Express, deployed on existing API gateway" },
      { label: "Endpoints", value: "GET /payment-summary/:orderId, POST /apply-promo, POST /confirm" },
      { label: "Auth", value: "Session token passthrough from existing auth middleware" },
      { label: "Blocked on", value: "Payments API v3 credentials — procurement ETA: Jun 1" },
    ],
    acceptanceCriteria: ["All PHP business rules replicated", "Response time < 200ms p99", "Error codes match PHP responses for backward compat", "Integration tests cover happy path + 4 error scenarios"],
  },
  "LIN-303": {
    id: "LIN-303", projectId: "ALPS-301", sprintId: "sprint-5", title: "Integrate A/B testing framework for checkout flows", status: "todo",
    assignee: "lena", priority: "medium", created: "2026-05-08", gitlabIssue: "#603", progress: 0,
    description: "Wire up the A/B testing SDK so product can run experiments on the new React payment summary without code deploys.",
    techSpecs: [
      { label: "SDK", value: "Optimizely Feature Experimentation (or LaunchDarkly — TBD)" },
      { label: "Variants", value: "Control (current layout) vs Treatment (new React layout)" },
      { label: "Metrics", value: "Conversion rate, time-on-page, abandonment rate" },
      { label: "Rollout", value: "Feature flag controls % of traffic routed to React component" },
    ],
    acceptanceCriteria: ["SDK initialised without blocking page render", "Variant assignment consistent per session", "Analytics events fire correctly for both variants", "PM can toggle experiment from dashboard without deploy"],
  },
  // ALPS-302 tickets
  "LIN-401": {
    id: "LIN-401", projectId: "ALPS-302", sprintId: null, title: "Set up Flutter project structure for Favourites", status: "todo",
    assignee: "jun", priority: "high", created: "2026-05-16", gitlabIssue: "#701", progress: 0,
    description: "Bootstrap the Flutter project with the agreed architecture: Riverpod for state management, Hive for local storage, and CI/CD pipeline for App Store and Play Store.",
    techSpecs: [
      { label: "Framework", value: "Flutter 3.x (Dart 3)" },
      { label: "State", value: "Riverpod 2.x with code generation" },
      { label: "Local Storage", value: "Hive 2.x for offline favourites cache" },
      { label: "CI/CD", value: "GitHub Actions → Fastlane → TestFlight / Play Internal Track" },
    ],
    acceptanceCriteria: ["Flutter project builds on iOS 15+ and Android 10+", "Riverpod providers scaffolded for Favourites feature", "Hive box initialised and read/write tested", "CI pipeline runs on every PR and produces signed builds"],
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
// NOTE: The full Object.assign is at the bottom of the file, after all variables are defined.


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
    sprints: ["sprint-3", "sprint-4", "sprint-5"],
  },
];

// Additional projects
const ALPS_301 = {
  id: "ALPS-301",
  title: "Express Payment in Payment Summary",
  summary: "Refactor the payment summary page from vanilla HTML + PHP to a React component architecture with an API-driven backend. Improves maintainability and enables A/B testing of checkout flows.",
  requestor: "priya",
  pm: "rina",
  techLead: "mateo",
  submitted: "2026-05-01",
  targetDelivery: "2026-08-30",
  state: "in_progress",
  currentGate: 2,
  gates: {
    business: {
      status: "cleared",
      clearedOn: "2026-05-08",
      clearedBy: "rina",
      completeness: 100,
      owner: "rina",
      dueDate: "May 8",
      checklist: [
        { id: "301-b1", label: "Business Case", content: "Checkout abandonment costs ~$1.2M/yr. React migration reduces page load by 60%, projected +8% conversion rate uplift.", status: "complete", aiSuggestion: null },
        { id: "301-b2", label: "Success Metrics", content: "Page load < 1.5s (from 4.2s), checkout abandonment down 15%, A/B test velocity: 2 experiments/sprint.", status: "complete", aiSuggestion: null },
        { id: "301-b3", label: "Stakeholders", content: "VP Payments (Dana Vasquez), Head of Design (Kenji Mori), Engineering Manager (Sven Aaltonen).", status: "complete", aiSuggestion: null },
        { id: "301-b4", label: "GTM / Rollout Plan", content: "Shadow mode (May 15) → 10% canary (Jun 1) → 50% (Jun 15) → GA (Jul 1). PHP fallback kept for 30 days.", status: "complete", aiSuggestion: null },
      ],
    },
    product: {
      status: "in_progress",
      startedOn: "2026-05-10",
      completeness: 45,
      owner: "rina",
      dueDate: "Jun 5",
      checklist: [
        { id: "301-p1", label: "User Flow", content: "Cart → Payment Summary (React) → Express Pay (Apple/Google Pay) → Confirmation. PHP fallback on error.", status: "complete", aiSuggestion: null },
        { id: "301-p2", label: "Feature Breakdown", content: "React payment summary component, API endpoints replacing PHP, A/B test hook, express pay buttons.", status: "complete", aiSuggestion: null },
        { id: "301-p3", label: "Acceptance Criteria", content: "", status: "warning", aiSuggestion: "Add criteria: parity with PHP output (pixel-level diff < 2%), graceful degradation when API is slow (> 3s timeout), screen reader support for payment form fields." },
        { id: "301-p4", label: "Edge Cases", content: "", status: "missing", aiSuggestion: "Define handling for: partial page hydration failures, currency formatting edge cases (JPY, KWD), session expiry mid-checkout." },
      ],
    },
    tech: {
      status: "locked",
      completeness: 0,
      owner: "mateo",
      dueDate: "Jul 1",
      checklist: [
        { id: "301-t1", label: "Technical Approach", content: "", status: "missing", aiSuggestion: "Recommend: React 18 with Suspense for streaming SSR, tRPC for type-safe API layer, feature flags via LaunchDarkly for A/B routing." },
        { id: "301-t2", label: "Dependencies", content: "", status: "missing", aiSuggestion: "Identify: Payments API v3 (blocked — procurement pending), Design System v2 component library, A/B testing SDK (Optimizely or custom)." },
        { id: "301-t3", label: "Migration Strategy", content: "", status: "missing", aiSuggestion: "Define: strangler fig pattern — new React component served alongside PHP, traffic split via nginx, rollback via feature flag toggle." },
        { id: "301-t4", label: "Performance Budget", content: "", status: "missing", aiSuggestion: null },
      ],
    },
  },
  blockers: 0,
  dependencies: ["Payments API v3", "Design System v2"],
  tags: ["payments", "refactor", "react"],
  changeLog: [
    { gate: "business", date: "2026-05-08", action: "cleared", by: "rina", note: "ROI validated, payments team aligned" },
    { gate: "product", date: "2026-05-10", action: "started", by: "rina", note: "Product gate review initiated" },
    { gate: "product", date: "2026-05-20", action: "criteria_updated", by: "rina", note: "Added express pay (Apple/Google Pay) to feature scope" },
  ],
  completedTickets: 1,
  totalTickets: 3,
};

const ALPS_302 = {
  id: "ALPS-302",
  title: "Favourite Page Optimisation",
  summary: "Migrate the Favourites feature from the web platform to a Flutter application with an API backend. Improves performance and enables offline support for mobile users.",
  requestor: "sven",
  pm: "rina",
  techLead: "jun",
  submitted: "2026-05-15",
  targetDelivery: "2026-09-30",
  state: "empty",
  currentGate: 1,
  gates: {
    business: {
      status: "in_progress",
      startedOn: "2026-05-16",
      completeness: 30,
      owner: "rina",
      dueDate: "Jun 10",
      checklist: [
        { id: "302-b1", label: "Business Case", content: "Mobile users represent 58% of traffic but only 31% of saves. Flutter migration targets parity + offline support, projected +25% mobile engagement.", status: "complete", aiSuggestion: null },
        { id: "302-b2", label: "Success Metrics", content: "", status: "warning", aiSuggestion: "Define measurable targets: app load time < 2s, offline sync latency < 500ms, favourites save success rate > 99.9%." },
        { id: "302-b3", label: "Stakeholders", content: "", status: "missing", aiSuggestion: "Identify: Mobile Engineering lead, App Store review contact, Customer Support (for migration comms), Legal (data residency for offline storage)." },
        { id: "302-b4", label: "GTM / Rollout Plan", content: "", status: "missing", aiSuggestion: null },
      ],
    },
    product: {
      status: "locked",
      completeness: 0,
      owner: "rina",
      dueDate: "Jul 15",
      checklist: [
        { id: "302-p1", label: "User Flow", content: "", status: "missing", aiSuggestion: "Map: Browse → Favourite (tap heart) → Offline queue → Sync on reconnect → Conflict resolution (last-write-wins vs merge)." },
        { id: "302-p2", label: "Feature Breakdown", content: "", status: "missing", aiSuggestion: null },
        { id: "302-p3", label: "Acceptance Criteria", content: "", status: "missing", aiSuggestion: null },
        { id: "302-p4", label: "Edge Cases", content: "", status: "missing", aiSuggestion: "Consider: offline → online sync conflicts, account sharing (same favourites across devices), large lists (> 500 items) performance." },
      ],
    },
    tech: {
      status: "locked",
      completeness: 0,
      owner: "jun",
      dueDate: "Aug 1",
      checklist: [
        { id: "302-t1", label: "Technical Approach", content: "", status: "missing", aiSuggestion: "Recommend: Flutter 3.x with Riverpod for state, Hive or Isar for local storage, REST + WebSocket for sync. Consider Drift (SQLite) for complex queries." },
        { id: "302-t2", label: "Dependencies", content: "", status: "missing", aiSuggestion: "Identify: Flutter SDK 3.x, Favourites API (new endpoints needed), push notification service for sync triggers, CI/CD pipeline for App Store/Play Store." },
        { id: "302-t3", label: "Constraints", content: "", status: "missing", aiSuggestion: "Define: iOS 15+ / Android 10+ minimum, offline storage limit (50MB), GDPR compliance for locally cached user data." },
        { id: "302-t4", label: "Timeline Impact", content: "", status: "missing", aiSuggestion: null },
      ],
    },
  },
  blockers: 0,
  dependencies: ["Flutter SDK 3.x", "Favourites API"],
  tags: ["flutter", "mobile", "refactor"],
  changeLog: [
    { gate: "business", date: "2026-05-16", action: "started", by: "rina", note: "Business gate review initiated" },
    { gate: "business", date: "2026-05-22", action: "criteria_updated", by: "sven", note: "Added mobile engagement baseline metrics from analytics" },
  ],
  completedTickets: 0,
  totalTickets: 1,
};

// All projects array — ALPS-218 (singleton PROJECT kept for backward compat)
const PROJECTS = [PROJECT, ALPS_301, ALPS_302];

// Initial AI suggestions for the dashboard
const INITIAL_SUGGESTIONS = {
  "sug-1": {
    id: "sug-1",
    ticketId: "LIN-205",
    gateTarget: "tech",
    type: "scope_update",
    suggestion: "Add circuit breaker pattern to prevent cascading failures during payment retries. Suggest using Resilience4j or opossum library.",
    rationale: "Based on 3 recent commits and dev discussion: retry storms during payment provider outages are a known risk.",
    status: "pending_approval",
    createdAt: "Apr 28, 10:14",
  },
  "sug-2": {
    id: "sug-2",
    ticketId: "LIN-208",
    gateTarget: "product",
    type: "unblock_strategy",
    suggestion: "Unblock LIN-208 by using a mock Payments API v3 stub for integration tests while procurement is pending. Estimate 2-day workaround.",
    rationale: "Ticket blocked 11 days. Discussion thread shows team waiting on procurement — mock stub would unblock UI and integration work.",
    status: "pending_approval",
    createdAt: "Apr 30, 09:41",
  },
};

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

Object.assign(window, {
  PEOPLE,
  PROJECT,
  PROJECTS,
  SPRINTS,
  LINEAR_TICKETS,
  GITLAB_ACTIVITY,
  DISCUSSION_THREAD,
  CYCLES,
  INITIAL_SUGGESTIONS,
  PROJECT_ATTACHMENTS,
  GATE_ATTACHMENTS,
  SPRINT_ATTACHMENTS,
  TICKET_ATTACHMENTS,
  TICKET_GITLAB_ACTIVITY,
  TICKET_DISCUSSIONS,
  TICKET_AI_SUGGESTIONS,
});
