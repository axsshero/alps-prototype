// ============================================================
// Sprint Detail Screen — View, edit sprint, and manage tickets
// Allows selecting/deselecting tickets for a sprint
// ============================================================

function SprintDetailScreen({ sprintId, projectId, setScreen, onSprintUpdate }) {
  const sprint = window.SPRINTS?.find(s => s.id === sprintId);
  const project = (projectId && window.PROJECTS?.find(p => p.id === projectId)) || window.PROJECT;
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState(sprint ? {
    name: sprint.name,
    description: sprint.description,
    cycle: sprint.cycle,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
  } : {});

  const [selectedTickets, setSelectedTickets] = React.useState(
    sprint ? Object.values(window.LINEAR_TICKETS).filter(t => t.sprintId === sprintId).map(t => t.id) : []
  );

  if (!sprint) {
    return (
      <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>
        Sprint not found.
        <button
          onClick={() => setScreen("cycles")}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            background: "var(--alps-accent)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          Back to Cycles
        </button>
      </div>
    );
  }

  // Get all tickets for this project
  const projectTickets = Object.values(window.LINEAR_TICKETS).filter(t => t.projectId === project.id);
  
  // Get tickets currently in this sprint
  const sprintTickets = projectTickets.filter(t => selectedTickets.includes(t.id));
  
  // Get available tickets (not in any sprint or in this sprint)
  const availableTickets = projectTickets.filter(t => !t.sprintId || t.sprintId === sprintId);

  const handleSaveEdit = () => {
    if (onSprintUpdate) {
      const updatedSprint = {
        ...sprint,
        ...editForm,
      };
      onSprintUpdate(updatedSprint);
    }
    setIsEditing(false);
  };

  const handleToggleTicket = (ticketId) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleSaveTickets = () => {
    // Update all tickets with new sprint assignment
    const updatedTickets = { ...window.LINEAR_TICKETS };
    Object.keys(updatedTickets).forEach(ticketId => {
      if (selectedTickets.includes(ticketId)) {
        updatedTickets[ticketId] = { ...updatedTickets[ticketId], sprintId: sprintId };
      } else if (updatedTickets[ticketId].sprintId === sprintId) {
        updatedTickets[ticketId] = { ...updatedTickets[ticketId], sprintId: null };
      }
    });
    window.LINEAR_TICKETS = updatedTickets;
    alert("Tickets updated successfully!");
  };

  const completedCount = sprintTickets.filter(t => t.status === "done").length;
  const inProgressCount = sprintTickets.filter(t => t.status === "in_progress").length;
  const blockedCount = sprintTickets.filter(t => t.status === "blocked").length;
  const todoCount = sprintTickets.filter(t => t.status === "todo").length;

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Back button */}
      <button
        onClick={() => setScreen("cycles")}
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
        ← Back to Cycles
      </button>

      {/* Sprint header */}
      <window.Section kicker="Sprint" title={sprint.name}>
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>
            {sprint.cycle} · {sprint.startDate} to {sprint.endDate}
          </div>
          <div style={{ fontSize: "13px", color: "var(--alps-text)", lineHeight: "1.5" }}>
            {sprint.description}
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: "6px 12px",
                background: "transparent",
                border: "1px solid var(--alps-accent)",
                borderRadius: "4px",
                color: "var(--alps-accent)",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--alps-accent-overlay)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {isEditing ? "Cancel" : "Edit Sprint"}
            </button>
          </div>
        </div>
      </window.Section>

      {/* Edit form */}
      {isEditing && (
        <window.Section kicker="Edit" title="Sprint Details">
          <form style={{ display: "grid", gap: "16px" }}>
            <window.FormField
              label="Sprint Name"
              name="name"
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <window.FormField
              label="Description"
              name="description"
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <window.FormField
              label="Cycle"
              name="cycle"
              type="text"
              value={editForm.cycle}
              onChange={(e) => setEditForm({ ...editForm, cycle: e.target.value })}
              required
            />
            <window.FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={editForm.startDate}
              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
              required
            />
            <window.FormField
              label="End Date"
              name="endDate"
              type="date"
              value={editForm.endDate}
              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              required
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "var(--alps-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  color: "var(--alps-text-muted)",
                  border: "1px solid var(--alps-border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </window.Section>
      )}

      {/* Sprint progress */}
      <window.Section kicker="Progress" title="Ticket Status">
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ marginBottom: "8px", fontSize: "13px" }}>
            <strong>{completedCount}/{sprintTickets.length} tickets complete</strong>
          </div>
          <div style={{ width: "100%", height: "8px", background: "var(--alps-bg)", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ height: "100%", width: `${sprintTickets.length > 0 ? (completedCount / sprintTickets.length) * 100 : 0}%`, background: "var(--alps-success)", transition: "width 0.3s ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { label: "DONE", count: completedCount, color: "var(--alps-success)" },
              { label: "IN PROG", count: inProgressCount, color: "var(--alps-accent)" },
              { label: "BLOCKED", count: blockedCount, color: "var(--alps-danger)" },
              { label: "TODO", count: todoCount, color: "var(--alps-text-muted)" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: `3px solid ${color}` }}>
                <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "20px", fontWeight: "600", color }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      </window.Section>

      {/* Ticket selection */}
      <window.Section kicker="Tickets" title="Manage Sprint Tickets">
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>
            Select tickets to include in this sprint. {selectedTickets.length} ticket(s) selected.
          </div>

          {/* Available tickets */}
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--alps-text-muted)", textTransform: "uppercase" }}>
              Available Tickets
            </div>
            <div style={{ display: "grid", gap: "6px", maxHeight: "400px", overflowY: "auto" }}>
              {availableTickets.length > 0 ? (
                availableTickets.map(ticket => (
                  <label
                    key={ticket.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px 12px",
                      background: "var(--alps-bg)",
                      borderRadius: "4px",
                      border: "1px solid var(--alps-border)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-accent)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleToggleTicket(ticket.id)}
                      style={{ marginTop: "2px", cursor: "pointer" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--alps-text)" }}>
                        {ticket.id}: {ticket.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginTop: "2px" }}>
                        Status: <span style={{ textTransform: "uppercase", fontWeight: "600" }}>{ticket.status}</span>
                        {ticket.assignee && ` · Assigned to ${window.PEOPLE[ticket.assignee]?.fullName || ticket.assignee}`}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div style={{ padding: "12px", color: "var(--alps-text-muted)", fontSize: "12px" }}>
                  No available tickets
                </div>
              )}
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: "flex", gap: "12px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--alps-border)" }}>
            <button
              onClick={handleSaveTickets}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "var(--alps-success)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
              }}
            >
              Save Ticket Selection
            </button>
          </div>
        </div>
      </window.Section>

      {/* Current sprint tickets */}
      {sprintTickets.length > 0 && (
        <window.Section kicker={`${sprintTickets.length}`} title="Sprint Tickets">
          <div style={{ display: "grid", gap: "8px" }}>
            {sprintTickets.map(ticket => {
              const statusColor = 
                ticket.status === "done" ? "var(--alps-success)"
                : ticket.status === "in_progress" ? "var(--alps-accent)"
                : ticket.status === "blocked" ? "var(--alps-danger)"
                : "var(--alps-text-muted)";

              return (
                <div
                  key={ticket.id}
                  style={{
                    padding: "12px",
                    background: "var(--alps-bg)",
                    borderRadius: "4px",
                    borderLeft: `3px solid ${statusColor}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--alps-text)" }}>
                      {ticket.id}: {ticket.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginTop: "4px" }}>
                      <span style={{ textTransform: "uppercase", fontWeight: "600" }}>{ticket.status}</span>
                      {ticket.assignee && ` · ${window.PEOPLE[ticket.assignee]?.fullName || ticket.assignee}`}
                      {ticket.priority && ` · Priority: ${ticket.priority}`}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginLeft: "12px" }}>
                    {ticket.progress}%
                  </div>
                </div>
              );
            })}
          </div>
        </window.Section>
      )}
    </div>
  );
}

Object.assign(window, { SprintDetailScreen });
