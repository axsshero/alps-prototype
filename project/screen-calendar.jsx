// ============================================================
// Calendar View — Display sprints, milestones, and velocity
// Shows monthly calendar with sprint timelines and metrics
// ============================================================

function CalendarView({ projectId, setScreen }) {
  const project = (projectId && window.PROJECTS?.find(p => p.id === projectId)) || window.PROJECT;
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState("month"); // month or timeline

  // Get sprints for this project
  const projectSprints = (window.SPRINTS || []).filter(s => s.projectId === project.id);

  // Get cycles
  const cycles = window.CYCLES || [];

  // Helper: Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper: Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Helper: Format date
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper: Check if date is in sprint
  const getSprintForDate = (dateStr) => {
    return projectSprints.find(s => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      const date = new Date(dateStr);
      return date >= start && date <= end;
    });
  };

  // Helper: Get velocity for sprint
  const getSprintVelocity = (sprint) => {
    const sprintTickets = Object.values(window.LINEAR_TICKETS || {}).filter(t => t.sprintId === sprint.id);
    return sprintTickets.filter(t => t.status === "done").length;
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    calendarDays.push(date);
  }

  // Navigation
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Back button */}
      <button
        onClick={() => setScreen("dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          background: "transparent",
          border: "1px solid var(--alps-border)",
          borderRadius: "4px",
          color: "var(--alps-text-muted)",
          cursor: "pointer",
          fontSize: "12px",
          fontFamily: "var(--font-sans)",
          width: "fit-content",
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <window.Section kicker="Timeline" title="Project Calendar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handlePrevMonth}
              style={{
                padding: "6px 10px",
                background: "transparent",
                border: "1px solid var(--alps-border)",
                borderRadius: "4px",
                color: "var(--alps-text-muted)",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
              }}
            >
              ← Prev
            </button>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--alps-text)", minWidth: "180px", textAlign: "center" }}>
              {monthName}
            </div>
            <button
              onClick={handleNextMonth}
              style={{
                padding: "6px 10px",
                background: "transparent",
                border: "1px solid var(--alps-border)",
                borderRadius: "4px",
                color: "var(--alps-text-muted)",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Next →
            </button>
            <button
              onClick={handleToday}
              style={{
                padding: "6px 10px",
                background: "var(--alps-accent)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
              }}
            >
              Today
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setViewMode("month")}
              style={{
                padding: "6px 12px",
                background: viewMode === "month" ? "var(--alps-accent)" : "transparent",
                color: viewMode === "month" ? "white" : "var(--alps-text-muted)",
                border: "1px solid var(--alps-border)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
              }}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              style={{
                padding: "6px 12px",
                background: viewMode === "timeline" ? "var(--alps-accent)" : "transparent",
                color: viewMode === "timeline" ? "white" : "var(--alps-text-muted)",
                border: "1px solid var(--alps-border)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
              }}
            >
              Timeline
            </button>
          </div>
        </div>
      </window.Section>

      {/* Month View */}
      {viewMode === "month" && (
        <window.Section kicker="Calendar" title="Monthly View">
          <div style={{ display: "grid", gap: "12px" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} style={{ textAlign: "center", fontSize: "11px", fontWeight: "600", color: "var(--alps-text-muted)", padding: "8px 0" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {calendarDays.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} style={{ aspectRatio: "1", background: "var(--alps-bg)" }} />;
                }

                const dateStr = formatDate(date);
                const sprint = getSprintForDate(dateStr);
                const isToday = formatDate(new Date()) === dateStr;
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                return (
                  <div
                    key={dateStr}
                    style={{
                      aspectRatio: "1",
                      padding: "8px",
                      background: isCurrentMonth ? "var(--alps-bg)" : "var(--alps-bg-alt)",
                      border: isToday ? "2px solid var(--alps-accent)" : "1px solid var(--alps-border)",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: "600", color: isToday ? "var(--alps-accent)" : "var(--alps-text)" }}>
                      {date.getDate()}
                    </div>

                    {sprint && (
                      <div
                        style={{
                          fontSize: "8px",
                          padding: "2px 4px",
                          background: sprint.status === "in_progress" ? "var(--alps-accent-overlay)" : "rgba(156,163,175,0.1)",
                          color: sprint.status === "in_progress" ? "var(--alps-accent)" : "var(--alps-text-muted)",
                          borderRadius: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: "600",
                        }}
                        title={sprint.name}
                      >
                        {sprint.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </window.Section>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <window.Section kicker="Timeline" title="Sprint Timeline & Velocity">
          <div style={{ display: "grid", gap: "16px" }}>
            {projectSprints.length > 0 ? (
              projectSprints.map((sprint) => {
                const velocity = getSprintVelocity(sprint);
                const sprintTickets = Object.values(window.LINEAR_TICKETS || {}).filter(t => t.sprintId === sprint.id);
                const completionPct = sprintTickets.length === 0 ? 0 : Math.round((velocity / sprintTickets.length) * 100);

                const statusColor = {
                  completed: "var(--alps-success)",
                  in_progress: "var(--alps-accent)",
                  planned: "var(--alps-text-muted)",
                }[sprint.status] || "var(--alps-text-muted)";

                return (
                  <div
                    key={sprint.id}
                    style={{
                      padding: "12px",
                      background: "var(--alps-bg)",
                      borderRadius: "4px",
                      borderLeft: `3px solid ${statusColor}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--alps-text)" }}>
                          {sprint.name}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginTop: "2px" }}>
                          {sprint.startDate} → {sprint.endDate} · {sprint.cycle}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>Velocity</div>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: statusColor }}>
                            {velocity}/{sprintTickets.length}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "4px 8px",
                            borderRadius: "3px",
                            background: `${statusColor}22`,
                            color: statusColor,
                            textTransform: "uppercase",
                          }}
                        >
                          {sprint.status === "in_progress" ? "Active" : sprint.status === "completed" ? "Done" : "Planned"}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>
                          {velocity} completed of {sprintTickets.length} tickets
                        </span>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--alps-text)" }}>
                          {completionPct}%
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "var(--alps-bg-alt)", borderRadius: "3px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${completionPct}%`,
                            background: statusColor,
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Ticket breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                      {[
                        { label: "Done", count: velocity, color: "var(--alps-success)" },
                        {
                          label: "In Prog",
                          count: sprintTickets.filter(t => t.status === "in_progress").length,
                          color: "var(--alps-accent)",
                        },
                        {
                          label: "Blocked",
                          count: sprintTickets.filter(t => t.status === "blocked").length,
                          color: "var(--alps-danger)",
                        },
                        {
                          label: "Todo",
                          count: sprintTickets.length - velocity - sprintTickets.filter(t => t.status === "in_progress").length - sprintTickets.filter(t => t.status === "blocked").length,
                          color: "var(--alps-text-muted)",
                        },
                      ].map(({ label, count, color }) => (
                        <div key={label} style={{ padding: "6px", background: "var(--alps-bg-alt)", borderRadius: "3px", borderLeft: `2px solid ${color}`, textAlign: "center" }}>
                          <div style={{ fontSize: "9px", color: "var(--alps-text-muted)" }}>{label}</div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color }}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--alps-text-muted)", fontSize: "12px" }}>
                No sprints planned for this project.
              </div>
            )}
          </div>
        </window.Section>
      )}

      {/* Milestones Summary */}
      <window.Section kicker="Milestones" title="Project Milestones">
        <div style={{ display: "grid", gap: "12px" }}>
          {cycles.length > 0 ? (
            cycles.map((cycle) => {
              const cycleSprints = projectSprints.filter(s => s.cycle === cycle.name);
              const totalTickets = cycleSprints.reduce((sum, s) => {
                const tickets = Object.values(window.LINEAR_TICKETS || {}).filter(t => t.sprintId === s.id);
                return sum + tickets.length;
              }, 0);
              const completedTickets = cycleSprints.reduce((sum, s) => {
                const tickets = Object.values(window.LINEAR_TICKETS || {}).filter(t => t.sprintId === s.id && t.status === "done");
                return sum + tickets.length;
              }, 0);
              const completionPct = totalTickets === 0 ? 0 : Math.round((completedTickets / totalTickets) * 100);

              return (
                <div
                  key={cycle.id}
                  style={{
                    padding: "12px",
                    background: "var(--alps-bg)",
                    borderRadius: "4px",
                    borderLeft: "3px solid var(--alps-info)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--alps-text)" }}>
                        {cycle.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", marginTop: "2px" }}>
                        {cycle.startDate} → {cycle.endDate} · {cycleSprints.length} sprint{cycleSprints.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>Progress</div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--alps-info)" }}>
                        {completionPct}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "4px", background: "var(--alps-bg-alt)", borderRadius: "2px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${completionPct}%`,
                        background: "var(--alps-info)",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: "12px", color: "var(--alps-text-muted)", fontSize: "12px", textAlign: "center" }}>
              No cycles defined.
            </div>
          )}
        </div>
      </window.Section>
    </div>
  );
}

Object.assign(window, { CalendarView });
