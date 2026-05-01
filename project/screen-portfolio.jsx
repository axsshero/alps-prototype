// ============================================================
// Portfolio Screen — multi-project list with filtering
// Depends on: primitives.jsx (window.Avatar, window.Pill, window.StateBadge, window.GateTriangles, window.Icon)
//             utils.jsx (window.computePortfolioSummary)
//             data.jsx (window.PROJECTS)
// ============================================================

function Summary_Bar({ projects }) {
  const summary = window.computePortfolioSummary(projects);

  const stats = [
    { label: "Total",       count: summary.total,                color: "var(--alps-text)"       },
    { label: "Drafting",    count: summary.byState.empty,        color: "var(--alps-text-muted)" },
    { label: "In Progress", count: summary.byState.in_progress,  color: "var(--alps-accent)"     },
    { label: "Blocked",     count: summary.byState.blocked,      color: "var(--alps-danger)"     },
    { label: "Delivered",   count: summary.byState.done,         color: "var(--alps-success)"    },
  ];

  return (
    <div style={{
      display: "flex", gap: "12px", flexWrap: "wrap",
      padding: "16px", background: "var(--alps-bg-alt)",
      border: "1px solid var(--alps-border)", borderRadius: "8px",
      marginBottom: "16px",
    }}>
      {stats.map(({ label, count, color }) => (
        <div key={label} style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "8px 16px", background: "var(--alps-bg)", borderRadius: "6px", minWidth: "72px",
        }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color }}>{count}</div>
          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function Project_Card({ project, onClick }) {
  const completionPct = project.totalTickets === 0
    ? 0
    : Math.round((project.completedTickets / project.totalTickets) * 100);

  return (
    <div
      onClick={() => onClick && onClick(project.id)}
      style={{
        padding: "16px", background: "var(--alps-bg-alt)",
        border: "1px solid var(--alps-border)", borderRadius: "8px",
        cursor: "pointer", transition: "border-color 0.15s",
        display: "grid", gap: "12px",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-accent)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
    >
      {/* Header: title + ID + state + gates */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)" }}>{project.title}</span>
          <window.Pill tone="neutral" mono={true}>{project.id}</window.Pill>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <window.StateBadge state={project.state} />
          <window.GateTriangles gates={project.gates} size={12} gap={3} />
        </div>
      </div>

      {/* Ticket progress bar */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>Tickets</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--alps-text)" }}>{completionPct}%</span>
        </div>
        <div style={{ height: "4px", background: "var(--alps-bg)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completionPct}%`, background: "var(--alps-success)", transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Footer: delivery, avatars, blockers, deps */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
            Due: <strong style={{ color: "var(--alps-text)" }}>{project.targetDelivery}</strong>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <window.Avatar person={project.pm} size={20} />
            <window.Avatar person={project.techLead} size={20} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {project.blockers > 0 && (
            <window.Pill tone="danger">
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{window.Icon.warn} {project.blockers} blocked</span>
            </window.Pill>
          )}
          {(project.dependencies || []).map((dep) => (
            <window.Pill key={dep} tone="muted">{dep}</window.Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioScreen({ role, setScreen, setActiveProjectId, setFromPortfolio }) {
  const [filter, setFilter] = React.useState("all");
  const projects = window.PROJECTS || [];

  if (projects.length === 0) {
    return <div style={{ padding: "24px", color: "var(--alps-text-muted)", fontSize: "14px" }}>No projects found.</div>;
  }

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.state === filter);

  const filterOptions = [
    { id: "all",         label: "All"         },
    { id: "empty",       label: "Drafting"    },
    { id: "in_progress", label: "In Progress" },
    { id: "blocked",     label: "Blocked"     },
    { id: "done",        label: "Delivered"   },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Portfolio</div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--alps-text)" }}>All Projects</h1>
      </div>

      <Summary_Bar projects={projects} />

      {projects.length > 1 && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px", flexWrap: "wrap" }}>
          {filterOptions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                padding: "6px 12px",
                background: filter === id ? "var(--alps-accent)" : "var(--alps-bg-alt)",
                color: filter === id ? "white" : "var(--alps-text-muted)",
                border: `1px solid ${filter === id ? "var(--alps-accent)" : "var(--alps-border)"}`,
                borderRadius: "4px", cursor: "pointer",
                fontSize: "12px", fontWeight: filter === id ? 600 : 400,
                fontFamily: "var(--font-sans)", transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div style={{ padding: "24px", color: "var(--alps-text-muted)", fontSize: "13px", textAlign: "center", background: "var(--alps-bg-alt)", borderRadius: "8px", border: "1px solid var(--alps-border)" }}>
          No projects match the selected filter.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {filteredProjects.map((project) => (
            <Project_Card
              key={project.id}
              project={project}
              onClick={(id) => { setActiveProjectId(id); setFromPortfolio(true); setScreen("dashboard"); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Summary_Bar, Project_Card, PortfolioScreen });
