// ============================================================
// Overview Screen — Quick view of overall progress and metrics
// Depends on: primitives.jsx (window.Avatar, window.Icon)
//             utils.jsx (window.computeSprintHealth, window.computeWorkload)
//             data.jsx (window.PROJECTS, window.SPRINTS, window.LINEAR_TICKETS, window.PEOPLE)
// ============================================================

function OverviewScreen({ role, setScreen, setActiveProjectId }) {
  const projects = window.PROJECTS || [];
  const sprints = window.SPRINTS || [];
  const tickets = window.LINEAR_TICKETS || {};
  const people = window.PEOPLE || {};

  // Calculate overall metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.state === "in_progress").length;
  const completedProjects = projects.filter(p => p.state === "done").length;
  const blockedProjects = projects.filter(p => p.state === "blocked").length;

  const totalSprints = sprints.length;
  const activeSprints = sprints.filter(s => s.status === "in_progress").length;
  const completedSprints = sprints.filter(s => s.status === "completed").length;

  const totalTickets = Object.values(tickets).length;
  const completedTickets = Object.values(tickets).filter(t => t.status === "done").length;
  const inProgressTickets = Object.values(tickets).filter(t => t.status === "in_progress").length;
  const blockedTickets = Object.values(tickets).filter(t => t.status === "blocked").length;

  const overallCompletion = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;
  const workload = window.computeWorkload(sprints, tickets, people);

  // Calculate velocity metrics
  const completedSprintVelocities = sprints
    .filter(s => s.status === "completed")
    .map(s => s.completedTickets);
  const avgVelocity = completedSprintVelocities.length > 0
    ? Math.round(completedSprintVelocities.reduce((a, b) => a + b, 0) / completedSprintVelocities.length)
    : 0;

  // Calculate project health
  const projectHealth = projects.map(p => ({
    id: p.id,
    title: p.title,
    state: p.state,
    completion: p.totalTickets > 0 ? Math.round((p.completedTickets / p.totalTickets) * 100) : 0,
    gate: p.currentGate,
    blockers: p.blockers,
  }));

  // Calculate sprint health
  const sprintHealth = sprints.map(s => ({
    id: s.id,
    name: s.name,
    projectId: s.projectId,
    status: s.status,
    velocity: s.completedTickets,
    capacity: s.totalTickets,
    completion: s.totalTickets > 0 ? Math.round((s.completedTickets / s.totalTickets) * 100) : 0,
  }));

  const handleViewProject = (projectId) => {
    if (setActiveProjectId) setActiveProjectId(projectId);
    if (setScreen) setScreen("dashboard");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Overview</div>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "var(--alps-text)" }}>Project Dashboard</h1>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "var(--alps-text-muted)" }}>Quick view of overall progress and team metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {/* Projects */}
        <div style={{ padding: "16px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", display: "grid", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Projects</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--alps-primary)" }}>{totalProjects}</div>
          <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
            <span style={{ color: "var(--alps-accent)" }}>{activeProjects}</span> active · 
            <span style={{ color: "var(--alps-success)", marginLeft: "4px" }}>{completedProjects}</span> done
          </div>
        </div>

        {/* Sprints */}
        <div style={{ padding: "16px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", display: "grid", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sprints</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--alps-accent)" }}>{totalSprints}</div>
          <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
            <span style={{ color: "var(--alps-accent)" }}>{activeSprints}</span> active · 
            <span style={{ color: "var(--alps-success)", marginLeft: "4px" }}>{completedSprints}</span> done
          </div>
        </div>

        {/* Tickets */}
        <div style={{ padding: "16px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", display: "grid", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tickets</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--alps-success)" }}>{completedTickets}/{totalTickets}</div>
          <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
            <span style={{ color: "var(--alps-accent)" }}>{inProgressTickets}</span> in progress · 
            <span style={{ color: "var(--alps-danger)", marginLeft: "4px" }}>{blockedTickets}</span> blocked
          </div>
        </div>

        {/* Overall Completion */}
        <div style={{ padding: "16px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", display: "grid", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Completion</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--alps-success)" }}>{overallCompletion}%</div>
          <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>overall progress</div>
        </div>
      </div>

      {/* Resource Planning Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Velocity & Capacity */}
        <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px", display: "grid", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)" }}>Velocity & Capacity</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "6px", border: "1px solid var(--alps-border)" }}>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, marginBottom: "4px" }}>Avg Velocity</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-accent)" }}>{avgVelocity}</div>
              <div style={{ fontSize: "9px", color: "var(--alps-text-muted)" }}>tickets/sprint</div>
            </div>
            <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "6px", border: "1px solid var(--alps-border)" }}>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, marginBottom: "4px" }}>Total Capacity</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-primary)" }}>{sprints.reduce((sum, s) => sum + s.totalTickets, 0)}</div>
              <div style={{ fontSize: "9px", color: "var(--alps-text-muted)" }}>tickets planned</div>
            </div>
          </div>
        </div>

        {/* Team Workload */}
        <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px", display: "grid", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)" }}>Team Workload</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "6px", border: "1px solid var(--alps-border)" }}>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, marginBottom: "4px" }}>Team Size</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-info)" }}>{workload.length}</div>
              <div style={{ fontSize: "9px", color: "var(--alps-text-muted)" }}>active members</div>
            </div>
            <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "6px", border: "1px solid var(--alps-border)" }}>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, marginBottom: "4px" }}>Avg Load</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-accent)" }}>
                {workload.length > 0 ? Math.round(workload.reduce((sum, w) => sum + w.count, 0) / workload.length * 10) / 10 : 0}
              </div>
              <div style={{ fontSize: "9px", color: "var(--alps-text-muted)" }}>tickets/person</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Summary */}
      <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)", marginBottom: "12px" }}>Projects Summary</div>
        <div style={{ display: "grid", gap: "8px" }}>
          {projectHealth.map(p => {
            const stateColor = {
              in_progress: "var(--alps-accent)",
              done: "var(--alps-success)",
              blocked: "var(--alps-danger)",
              empty: "var(--alps-text-muted)",
            }[p.state] || "var(--alps-text-muted)";

            return (
              <div
                key={p.id}
                onClick={() => handleViewProject(p.id)}
                style={{
                  padding: "12px",
                  background: "var(--alps-bg)",
                  borderRadius: "6px",
                  border: "1px solid var(--alps-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--alps-accent)";
                  e.currentTarget.style.background = "var(--alps-bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--alps-border)";
                  e.currentTarget.style.background = "var(--alps-bg)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  <div style={{ display: "grid", gap: "2px", minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--alps-text)" }}>{p.id}</div>
                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>Gate {p.gate}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: stateColor }}>{p.completion}%</div>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "3px",
                      background: `${stateColor}22`,
                      color: stateColor,
                      textTransform: "uppercase",
                      minWidth: "60px",
                      textAlign: "center",
                    }}
                  >
                    {p.state === "in_progress" ? "Active" : p.state === "done" ? "Done" : p.state === "blocked" ? "Blocked" : "Empty"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Sprints */}
      <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)", marginBottom: "12px" }}>Active Sprints</div>
        <div style={{ display: "grid", gap: "8px" }}>
          {sprintHealth.filter(s => s.status === "in_progress").length > 0 ? (
            sprintHealth.filter(s => s.status === "in_progress").map(s => {
              const project = projects.find(p => p.id === s.projectId);
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    // Save project ID to localStorage and open Progress page with sprint filter
                    localStorage.setItem('alpsActiveProjectId', s.projectId);
                    window.open(`Progress.html?projectId=${s.projectId}&sprintId=${s.id}`, '_blank');
                  }}
                  style={{
                    padding: "12px",
                    background: "var(--alps-bg)",
                    borderRadius: "6px",
                    border: "1px solid var(--alps-border)",
                    display: "grid",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--alps-accent)";
                    e.currentTarget.style.background = "var(--alps-bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--alps-border)";
                    e.currentTarget.style.background = "var(--alps-bg)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--alps-text)" }}>{s.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginTop: "2px" }}>
                        {project?.id} · {project?.title}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>Velocity</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-accent)" }}>
                        {s.velocity}/{s.capacity}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: "4px", background: "var(--alps-bg-alt)", borderRadius: "2px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${s.completion}%`,
                        background: "var(--alps-accent)",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>
                    {s.completion}% complete
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: "12px", textAlign: "center", color: "var(--alps-text-muted)", fontSize: "12px" }}>
              No active sprints
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewScreen });
