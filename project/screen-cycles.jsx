// ============================================================
// Cycles & Sprints Screen — delivery timeline + team workload
// Depends on: primitives.jsx (window.Avatar, window.Icon)
//             utils.jsx (window.computeSprintHealth, window.computeTimelinePosition,
//                        window.computeTodayMarkerPosition, window.computeWorkload)
//             data.jsx (window.CYCLES, window.SPRINTS, window.LINEAR_TICKETS, window.PEOPLE)
// ============================================================

function Sprint_Health_Badge({ health }) {
  const colorMap = {
    "On Track":   "var(--alps-success)",
    "At Risk":    "var(--alps-warning)",
    "Overloaded": "var(--alps-danger)",
  };
  const color = colorMap[health] || "var(--alps-text-muted)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: "4px",
      fontSize: "10px", fontWeight: 700,
      background: `${color}22`, color,
      border: `1px solid ${color}44`,
    }}>
      {health}
    </span>
  );
}

function Sprint_Card({ sprint, health, onViewProject, expanded, onToggleExpand }) {
  const completionPct = sprint.totalTickets === 0
    ? 0
    : Math.round((sprint.completedTickets / sprint.totalTickets) * 100);

  const statusColor = {
    completed:   "var(--alps-success)",
    in_progress: "var(--alps-accent)",
    planned:     "var(--alps-text-muted)",
  }[sprint.status] || "var(--alps-text-muted)";

  // Look up the project this sprint belongs to
  const project = sprint.projectId && window.PROJECTS
    ? window.PROJECTS.find(p => p.id === sprint.projectId)
    : null;

  // Get tickets for this sprint
  const sprintTickets = Object.values(window.LINEAR_TICKETS || {}).filter(t => t.sprintId === sprint.id);
  const blockedTickets = sprintTickets.filter(t => t.status === "blocked");
  const inProgressTickets = sprintTickets.filter(t => t.status === "in_progress");

  return (
    <div style={{
      padding: "14px 16px", background: "var(--alps-bg)",
      border: "1px solid var(--alps-border)", borderRadius: "6px",
      display: "grid", gap: "10px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--alps-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sprint.name}</span>
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", flexShrink: 0,
            background: `${statusColor}22`, color: statusColor, textTransform: "uppercase",
          }}>
            {sprint.status === "in_progress" ? "Active" : sprint.status === "completed" ? "Completed" : "Upcoming"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sprint_Health_Badge health={health} />
          {sprintTickets.length > 0 && (
            <button
              onClick={onToggleExpand}
              style={{
                padding: "4px 6px", background: "transparent",
                border: "1px solid var(--alps-border)", borderRadius: "3px",
                color: "var(--alps-text-muted)", cursor: "pointer",
                fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--alps-text)"; e.currentTarget.style.color = "var(--alps-text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--alps-border)"; e.currentTarget.style.color = "var(--alps-text-muted)"; }}
            >
              {expanded ? "−" : "+"} Details
            </button>
          )}
        </div>
      </div>

      {/* Project badge + link */}
      {project && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>Project:</span>
            <span style={{
              fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)",
              padding: "1px 6px", borderRadius: "3px",
              background: "rgba(8,145,178,0.12)", color: "var(--alps-accent)",
            }}>{project.id}</span>
            <span style={{ fontSize: "11px", color: "var(--alps-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{project.title}</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => window.open(`Progress.html?projectId=${project.id}`, "_blank")}
              style={{
                padding: "2px 8px", background: "transparent",
                border: "1px solid var(--alps-border)", borderRadius: "3px",
                color: "var(--alps-primary)", cursor: "pointer",
                fontSize: "10px", fontWeight: 600, fontFamily: "var(--font-sans)",
                flexShrink: 0, transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
            >
              Progress →
            </button>
            {onViewProject && (
              <button
                onClick={() => onViewProject(project.id)}
                style={{
                  padding: "2px 8px", background: "transparent",
                  border: "1px solid var(--alps-border)", borderRadius: "3px",
                  color: "var(--alps-accent)", cursor: "pointer",
                  fontSize: "10px", fontWeight: 600, fontFamily: "var(--font-sans)",
                  flexShrink: 0, transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
              >
                Dashboard →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sprint description */}
      {sprint.description && (
        <div style={{ marginTop: "2px" }}>
          <window.Sprint_Description description={sprint.description} />
        </div>
      )}

      {/* Date range */}
      <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
        {sprint.status === "planned"     && <span>Starts: <strong style={{ color: "var(--alps-text)" }}>{sprint.startDate}</strong></span>}
        {sprint.status === "completed"   && <span>Ended: <strong style={{ color: "var(--alps-text)" }}>{sprint.endDate}</strong> · Final: <strong style={{ color: "var(--alps-success)" }}>{completionPct}%</strong></span>}
        {sprint.status === "in_progress" && <span>{sprint.startDate} → {sprint.endDate}</span>}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>{sprint.completedTickets}/{sprint.totalTickets} tickets</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--alps-text)" }}>{completionPct}%</span>
        </div>
        <div style={{ height: "4px", background: "var(--alps-bg-alt)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completionPct}%`, background: statusColor, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && sprintTickets.length > 0 && (
        <div style={{ marginTop: "6px", padding: "12px", background: "var(--alps-bg-alt)", borderRadius: "4px", display: "grid", gap: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>In Progress</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--alps-accent)" }}>{inProgressTickets.length}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>Blocked</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: blockedTickets.length > 0 ? "var(--alps-danger)" : "var(--alps-text-muted)" }}>{blockedTickets.length}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>Velocity</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--alps-text)" }}>{sprint.completedTickets}</div>
            </div>
          </div>
          
          {blockedTickets.length > 0 && (
            <div style={{ padding: "8px 10px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "4px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--alps-danger)", marginBottom: "4px" }}>⚠ Blocked Tickets</div>
              {blockedTickets.slice(0, 3).map(t => (
                <div key={t.id} style={{ fontSize: "10px", color: "var(--alps-text)", marginTop: "2px" }}>
                  • {t.id}: {t.title}
                </div>
              ))}
              {blockedTickets.length > 3 && (
                <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginTop: "4px" }}>
                  + {blockedTickets.length - 3} more
                </div>
              )}
            </div>
          )}

          {/* Sprint Attachments */}
          <div style={{ marginTop: "4px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Sprint Attachments
            </div>
            <window.Attachment_List
              attachments={window.SPRINT_ATTACHMENTS?.[sprint.id] || []}
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
        </div>
      )}
    </div>
  );
}

function Timeline_Bar({ cycle, sprints, today, hoveredSprint, onSprintHover, onSprintLeave }) {
  const todayPos = window.computeTodayMarkerPosition(cycle, today);

  const sprintColors = [
    "var(--alps-accent)",
    "var(--alps-primary)",
    "var(--alps-info)",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div style={{
      position: "relative", height: "40px",
      background: "var(--alps-bg)", border: "1px solid var(--alps-border)",
      borderRadius: "4px", overflow: "visible", marginTop: "8px",
    }}>
      {sprints.map((sprint, i) => {
        const { left, width } = window.computeTimelinePosition(sprint, cycle);
        if (width === 0) return null;
        const color = sprintColors[i % sprintColors.length];
        const isHovered = hoveredSprint === sprint.id;

        return (
          <div
            key={sprint.id}
            onMouseEnter={() => onSprintHover && onSprintHover(sprint.id)}
            onMouseLeave={() => onSprintLeave && onSprintLeave()}
            style={{
              position: "absolute",
              left: `${left}%`, width: `${width}%`,
              top: "4px", bottom: "4px",
              background: color, opacity: isHovered ? 1 : 0.7,
              borderRadius: "3px", cursor: "pointer",
              transition: "opacity 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {width > 8 && (
              <span style={{ fontSize: "9px", fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 4px" }}>
                {sprint.name.split(" — ")[0]}
              </span>
            )}
            {isHovered && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)",
                borderRadius: "4px", padding: "8px 10px", fontSize: "11px", color: "var(--alps-text)",
                whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", pointerEvents: "none",
              }}>
                <div style={{ fontWeight: 700, marginBottom: "3px" }}>{sprint.name}</div>
                <div style={{ color: "var(--alps-text-muted)" }}>{sprint.startDate} → {sprint.endDate}</div>
                <div style={{ color: "var(--alps-text-muted)", marginTop: "2px" }}>
                  {sprint.totalTickets === 0 ? "0%" : Math.round(sprint.completedTickets / sprint.totalTickets * 100) + "%"} complete
                </div>
              </div>
            )}
          </div>
        );
      })}

      {todayPos !== null && (
        <div style={{ position: "absolute", left: `${todayPos}%`, top: 0, bottom: 0, width: "2px", background: "var(--alps-warning)", zIndex: 5 }}>
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", fontWeight: 700, color: "var(--alps-warning)", whiteSpace: "nowrap" }}>
            Today
          </div>
        </div>
      )}
    </div>
  );
}

function Workload_Summary({ workload }) {
  if (!workload || workload.length === 0) {
    return <div style={{ fontSize: "12px", color: "var(--alps-text-muted)", padding: "8px 0" }}>No active workload data.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      {workload.map((entry) => (
        <div key={entry.personId} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 10px", background: "var(--alps-bg)",
          borderRadius: "4px", border: "1px solid var(--alps-border)",
        }}>
          <window.Avatar person={entry.personId} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--alps-text)" }}>{entry.name}</div>
            <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>{entry.role}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {entry.count > 3 && (
              <span style={{ color: "var(--alps-warning)", display: "flex", alignItems: "center" }}>{window.Icon.warn}</span>
            )}
            <span style={{ fontSize: "13px", fontWeight: 700, color: entry.count > 3 ? "var(--alps-warning)" : "var(--alps-text)", minWidth: "20px", textAlign: "right" }}>
              {entry.count}
            </span>
            <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>tickets</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CyclesScreen({ role, setScreen, setActiveProjectId, setFromPortfolio }) {
  const [hoveredSprint, setHoveredSprint] = React.useState(null);
  const [expandedSprint, setExpandedSprint] = React.useState(null);
  const [filterProject, setFilterProject] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const today = new Date();

  const cycles  = window.CYCLES         || [];
  const sprints = window.SPRINTS        || [];
  const tickets = window.LINEAR_TICKETS || {};
  const people  = window.PEOPLE         || {};
  const projects = window.PROJECTS      || [];

  const workload = window.computeWorkload(sprints, tickets, people);

  // Filter sprints by project and search
  const filteredSprints = React.useMemo(() => {
    return sprints.filter(s => {
      if (filterProject !== "all" && s.projectId !== filterProject) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [sprints, filterProject, searchQuery]);

  // Navigate to a project's dashboard
  const handleViewProject = React.useCallback((projectId) => {
    if (setActiveProjectId) setActiveProjectId(projectId);
    if (setFromPortfolio) setFromPortfolio(false);
    if (setScreen) setScreen("dashboard");
  }, [setScreen, setActiveProjectId, setFromPortfolio]);

  // Compute summary stats
  const totalSprints = filteredSprints.length;
  const activeSprints = filteredSprints.filter(s => s.status === "in_progress").length;
  const completedSprints = filteredSprints.filter(s => s.status === "completed").length;
  const avgCompletion = totalSprints === 0 ? 0 : Math.round(
    filteredSprints.reduce((sum, s) => sum + (s.totalTickets === 0 ? 0 : (s.completedTickets / s.totalTickets) * 100), 0) / totalSprints
  );

  if (cycles.length === 0) {
    return <div style={{ padding: "24px", color: "var(--alps-text-muted)", fontSize: "14px" }}>No cycles found.</div>;
  }

  return (
    <div>
      {/* Header with summary stats */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Cycles & Sprints</div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--alps-text)" }}>Delivery Timeline</h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ padding: "8px 12px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-text)" }}>{totalSprints}</div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-accent)" }}>{activeSprints}</div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Active</div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-success)" }}>{completedSprints}</div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Done</div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--alps-text)" }}>{avgCompletion}%</div>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Avg</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search sprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px", fontSize: "12px", background: "var(--alps-bg-alt)",
              border: "1px solid var(--alps-border)", borderRadius: "6px",
              color: "var(--alps-text)", width: "240px", outline: "none",
            }}
          />
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={{
              padding: "8px 12px", fontSize: "12px", background: "var(--alps-bg-alt)",
              border: "1px solid var(--alps-border)", borderRadius: "6px",
              color: "var(--alps-text)", cursor: "pointer", outline: "none",
            }}
          >
            <option value="all">All projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.id} — {p.title}</option>)}
          </select>
          {(filterProject !== "all" || searchQuery) && (
            <button
              onClick={() => { setFilterProject("all"); setSearchQuery(""); }}
              style={{
                padding: "8px 12px", fontSize: "11px", background: "transparent",
                border: "1px solid var(--alps-border)", borderRadius: "6px",
                color: "var(--alps-accent)", cursor: "pointer", fontWeight: 600,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", alignItems: "start" }}>

        {/* LEFT: Cycle groups */}
        <div style={{ display: "grid", gap: "24px" }}>
          {cycles.map((cycle) => {
            const cycleSprints = filteredSprints.filter((s) => s.cycle === cycle.name);
            const cycleStatusColor = {
              in_progress: "var(--alps-accent)",
              planned:     "var(--alps-text-muted)",
              completed:   "var(--alps-success)",
            }[cycle.status] || "var(--alps-text-muted)";

            if (cycleSprints.length === 0 && (filterProject !== "all" || searchQuery)) {
              return null; // Hide empty cycles when filtering
            }

            return (
              <div key={cycle.id} style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--alps-text)" }}>{cycle.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginTop: "2px" }}>{cycle.startDate} → {cycle.endDate}</div>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: `${cycleStatusColor}22`, color: cycleStatusColor, textTransform: "uppercase" }}>
                    {cycle.status === "in_progress" ? "Active" : cycle.status === "completed" ? "Completed" : "Planned"}
                  </span>
                </div>

                <Timeline_Bar
                  cycle={cycle} sprints={cycleSprints} today={today}
                  hoveredSprint={hoveredSprint}
                  onSprintHover={setHoveredSprint}
                  onSprintLeave={() => setHoveredSprint(null)}
                />

                {cycleSprints.length > 0 ? (
                  <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
                    {cycleSprints.map((sprint) => (
                      <Sprint_Card
                        key={sprint.id}
                        sprint={sprint}
                        health={window.computeSprintHealth(sprint, today)}
                        onViewProject={handleViewProject}
                        expanded={expandedSprint === sprint.id}
                        onToggleExpand={() => setExpandedSprint(expandedSprint === sprint.id ? null : sprint.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "var(--alps-text-muted)", padding: "12px 0", textAlign: "center" }}>
                    {filterProject !== "all" || searchQuery ? "No sprints match the current filters." : "No sprints in this cycle."}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Workload (sticky) */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "8px", padding: "16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Team Workload</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)" }}>Active Sprints</div>
            </div>
            <Workload_Summary workload={workload} />
          </div>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { Sprint_Health_Badge, Sprint_Card, Timeline_Bar, Workload_Summary, CyclesScreen });
