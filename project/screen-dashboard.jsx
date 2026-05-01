// ============================================================
// Dashboard Screen — single-project detail view
// Depends on: primitives.jsx (window.Section, window.Avatar, window.Icon, window.PEOPLE)
//             data.jsx (window.PROJECT, window.PROJECTS, window.LINEAR_TICKETS)
// ============================================================

// ─── Gate checklist sub-component ────────────────────────────────────────────

function GateChecklist({ gateId, gate, onUpdateItem, onAcceptAI }) {
  const statusIcon = (s) => s === "complete" ? "✅" : s === "warning" ? "⚠️" : "⬜";

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "var(--alps-text-muted)", paddingBottom: "4px" }}>
        {gate.owner    && <span>Owner: <strong style={{ color: "var(--alps-text)" }}>{window.PEOPLE[gate.owner]?.fullName || gate.owner}</strong></span>}
        {gate.dueDate  && <span>Due: <strong style={{ color: "var(--alps-text)" }}>{gate.dueDate}</strong></span>}
        {gate.clearedOn && <span>Cleared: <strong style={{ color: "var(--alps-success)" }}>{gate.clearedOn}</strong></span>}
      </div>

      {(gate.checklist || []).map((item) => (
        <div key={item.id} style={{
          padding: "12px",
          background: "var(--alps-bg)",
          borderRadius: "6px",
          borderLeft: `3px solid ${
            item.status === "complete" ? "var(--alps-success)"
            : item.status === "warning" ? "var(--alps-warning)"
            : "var(--alps-border)"
          }`,
          display: "grid", gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: 14 }}>{statusIcon(item.status)}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--alps-text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {item.label}
            </span>
          </div>

          <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>
            {item.content ? (
              <div
                onClick={() => {
                  const input = prompt(`Edit "${item.label}":`, item.content);
                  if (input !== null) onUpdateItem(gateId, item.id, input);
                }}
                style={{
                  padding: "8px 10px",
                  background: "var(--alps-bg-alt)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "1px solid transparent",
                  transition: "border-color 0.15s",
                  lineHeight: 1.5,
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                title="Click to edit"
              >
                {item.content}
              </div>
            ) : (
              <textarea
                placeholder={`Add ${item.label.toLowerCase()}…`}
                defaultValue=""
                rows={2}
                onBlur={(e) => { if (e.target.value.trim()) onUpdateItem(gateId, item.id, e.target.value); }}
                style={{
                  width: "100%", padding: "8px 10px",
                  background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)",
                  borderRadius: "4px", color: "var(--alps-text)", fontSize: "12px",
                  fontFamily: "var(--font-sans)", resize: "vertical", outline: "none",
                }}
              />
            )}
          </div>

          {item.aiSuggestion && (
            <div style={{
              padding: "10px 12px",
              background: "rgba(245, 158, 11, 0.08)",
              borderLeft: "3px solid var(--alps-warning)",
              borderRadius: "4px",
              display: "grid", gap: "8px",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--alps-warning)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                ✨ AI Suggestion
              </div>
              <div style={{ fontSize: "11px", color: "var(--alps-text)", lineHeight: 1.45 }}>{item.aiSuggestion}</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => onAcceptAI(gateId, item.id)}
                  style={{ padding: "4px 10px", background: "transparent", border: "1px solid var(--alps-warning)", color: "var(--alps-warning)", borderRadius: "3px", cursor: "pointer", fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-sans)" }}
                >
                  Accept
                </button>
                <button
                  onClick={() => onUpdateItem(gateId, item.id, item.content, true)}
                  style={{ padding: "4px 10px", background: "transparent", border: "1px solid var(--alps-border)", color: "var(--alps-text-muted)", borderRadius: "3px", cursor: "pointer", fontSize: "10px", fontFamily: "var(--font-sans)" }}
                >
                  Ignore
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GateContentBusiness({ project, onUpdateItem, onAcceptAI }) {
  const gate = project.gates.business;
  if (!gate.checklist) {
    return <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>Status: {gate.status} · {gate.completeness}% complete</div>;
  }
  return <GateChecklist gateId="business" gate={gate} onUpdateItem={onUpdateItem} onAcceptAI={onAcceptAI} />;
}

function GateContentProduct({ project, onUpdateItem, onAcceptAI }) {
  const gate = project.gates.product;
  if (!gate.checklist) {
    return <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>Status: {gate.status} · {gate.completeness}% complete</div>;
  }
  return <GateChecklist gateId="product" gate={gate} onUpdateItem={onUpdateItem} onAcceptAI={onAcceptAI} />;
}

function GateContentTech({ project, onUpdateItem, onAcceptAI }) {
  const gate = project.gates.tech;
  if (!gate.checklist) {
    return <div style={{ fontSize: "12px", color: "var(--alps-text-muted)" }}>Status: {gate.status} · {gate.completeness}% complete</div>;
  }
  return <GateChecklist gateId="tech" gate={gate} onUpdateItem={onUpdateItem} onAcceptAI={onAcceptAI} />;
}

// ─── AI suggestion card (isolated so hooks stay at top level) ─────────────────

function SuggestionCard({ sug, onApprove, onReject }) {
  const [editText, setEditText] = React.useState(sug.suggestion);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [showRejectionInput, setShowRejectionInput] = React.useState(false);

  const typeLabel = {
    scope_update:        "📋 Scope Update",
    acceptance_criteria: "✓ Acceptance Criteria",
    unblock_strategy:    "🔓 Unblock Strategy",
  }[sug.type] || sug.type;

  return (
    <div style={{ padding: "12px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "4px", borderLeft: "3px solid var(--alps-warning)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--alps-warning)", textTransform: "uppercase", marginBottom: "4px" }}>
            {typeLabel}
          </div>
          <div style={{ fontSize: "12px", color: "var(--alps-text)", fontWeight: "500", marginBottom: "6px" }}>
            {window.LINEAR_TICKETS[sug.ticketId]?.id}: {window.LINEAR_TICKETS[sug.ticketId]?.title}
          </div>
        </div>
        <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>{sug.createdAt}</span>
      </div>

      <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "8px" }}>{sug.rationale}</div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "6px", fontWeight: "600" }}>Edit before approving:</div>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows="3"
          style={{
            width: "100%", padding: "8px",
            border: "1px solid var(--alps-border)", borderRadius: "3px",
            fontSize: "12px", fontFamily: "var(--font-sans)",
            background: "var(--alps-bg-alt)", color: "var(--alps-text)",
            resize: "vertical", outline: "none",
          }}
        />
      </div>

      {showRejectionInput && (
        <div style={{ marginBottom: "12px" }}>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows="2"
            placeholder="Feedback for AI..."
            style={{
              width: "100%", padding: "8px",
              border: "1px solid var(--alps-border)", borderRadius: "3px",
              fontSize: "12px", fontFamily: "var(--font-sans)",
              background: "var(--alps-bg-alt)", color: "var(--alps-text)",
              resize: "none", outline: "none",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => onApprove(sug.id, editText)}
          style={{ padding: "6px 12px", background: "var(--alps-success)", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
        >
          ✓ Approve
        </button>
        {!showRejectionInput ? (
          <button
            onClick={() => setShowRejectionInput(true)}
            style={{ padding: "6px 12px", background: "var(--alps-bg)", color: "var(--alps-danger)", border: "1px solid var(--alps-danger)", borderRadius: "3px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
          >
            ✗ Reject
          </button>
        ) : (
          <>
            <button
              onClick={() => { if (rejectionReason.trim()) { onReject(sug.id, rejectionReason); setShowRejectionInput(false); } }}
              style={{ padding: "6px 12px", background: "var(--alps-danger)", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
            >
              Send
            </button>
            <button
              onClick={() => setShowRejectionInput(false)}
              style={{ padding: "6px 12px", background: "var(--alps-bg)", color: "var(--alps-text)", border: "1px solid var(--alps-border)", borderRadius: "3px", cursor: "pointer", fontSize: "11px" }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

function DashboardScreen({ role, suggestions, onSuggestionUpdate, activeProjectId, fromPortfolio, setScreen, setFromPortfolio }) {
  const initialProject = (activeProjectId && window.PROJECTS && window.PROJECTS.find(p => p.id === activeProjectId)) || window.PROJECT;
  const [project, setProject] = React.useState(initialProject);

  React.useEffect(() => {
    const p = (activeProjectId && window.PROJECTS && window.PROJECTS.find(p => p.id === activeProjectId)) || window.PROJECT;
    setProject(p);
  }, [activeProjectId]);

  // Filter tickets to only those belonging to the active project
  const projectTickets = Object.values(window.LINEAR_TICKETS).filter(
    (t) => t.projectId === project.id
  );
  const totalTickets   = projectTickets.length;
  const doneTickets    = projectTickets.filter((t) => t.status === "done").length;
  const inProgTickets  = projectTickets.filter((t) => t.status === "in_progress").length;
  const blockedTickets = projectTickets.filter((t) => t.status === "blocked").length;

  const [activeGate, setActiveGate] = React.useState("business");

  const pendingSuggestions  = Object.values(suggestions).filter((s) => s.status === "pending_approval");
  const approvedSuggestions = Object.values(suggestions).filter((s) => s.status === "approved");

  const handleUpdateGateItem = React.useCallback((gateId, itemId, newContent, clearAI = false) => {
    setProject((prev) => {
      const gate = { ...prev.gates[gateId] };
      gate.checklist = gate.checklist.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, content: newContent };
        if (clearAI) updated.aiSuggestion = null;
        if (newContent.trim()) updated.status = "complete";
        return updated;
      });
      gate.completeness = Math.round(gate.checklist.filter((i) => i.status === "complete").length / gate.checklist.length * 100);
      return { ...prev, gates: { ...prev.gates, [gateId]: gate } };
    });
  }, []);

  const handleAcceptAI = React.useCallback((gateId, itemId) => {
    setProject((prev) => {
      const gate = { ...prev.gates[gateId] };
      gate.checklist = gate.checklist.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, content: item.aiSuggestion, status: "complete", aiSuggestion: null };
      });
      gate.completeness = Math.round(gate.checklist.filter((i) => i.status === "complete").length / gate.checklist.length * 100);
      return { ...prev, gates: { ...prev.gates, [gateId]: gate } };
    });
  }, []);

  const handleApprove = (sugId, editedContent) => {
    const updated = { ...suggestions };
    Object.keys(updated).forEach((k) => {
      if (updated[k].id === sugId) { updated[k] = { ...updated[k], status: "approved", suggestion: editedContent }; }
    });
    onSuggestionUpdate(updated);
  };

  const handleReject = (sugId, reason) => {
    const updated = { ...suggestions };
    Object.keys(updated).forEach((k) => {
      if (updated[k].id === sugId) { updated[k] = { ...updated[k], status: "rejected", rejectionReason: reason, rejectedAt: new Date().toLocaleString() }; }
    });
    onSuggestionUpdate(updated);
  };

  return (
    <div>
      {/* Back to Portfolio */}
      {fromPortfolio && (
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={() => { setScreen("portfolio"); setFromPortfolio(false); }}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", background: "transparent",
              border: "1px solid var(--alps-border)", borderRadius: "4px",
              color: "var(--alps-text-muted)", cursor: "pointer",
              fontSize: "12px", fontFamily: "var(--font-sans)",
            }}
          >
            ← Back to Portfolio
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "grid", gap: "24px" }}>

          {/* Project header */}
          <window.Section kicker="Project" title={project.title}>
            <div style={{ fontSize: "12px", color: "var(--alps-text-muted)", marginBottom: "8px" }}>
              {project.id} · {project.summary}
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "12px" }}>
              {[
                { label: "Requestor", key: project.requestor },
                { label: "PM",        key: project.pm        },
                { label: "Tech Lead", key: project.techLead  },
              ].filter(({ key }) => key).map(({ label, key }) => (
                <div key={label}>
                  <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>{label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <window.Avatar person={key} size={20} />
                    <div style={{ fontSize: "12px" }}>{window.PEOPLE[key]?.fullName}</div>
                  </div>
                </div>
              ))}
            </div>
          </window.Section>

          {/* Ticket status */}
          <window.Section
            kicker="Progress"
            title="Ticket Status"
            right={
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
                  <div><span style={{ color: "var(--alps-success)" }}>●</span> {doneTickets}</div>
                  <div><span style={{ color: "var(--alps-accent)" }}>●</span> {inProgTickets}</div>
                  <div><span style={{ color: "var(--alps-danger)" }}>●</span> {blockedTickets}</div>
                </div>
                <button
                  onClick={() => window.open(`Progress.html?projectId=${project.id}`, "_blank")}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "4px 10px", background: "transparent",
                    border: "1px solid var(--alps-border)", borderRadius: "4px",
                    color: "var(--alps-accent)", cursor: "pointer",
                    fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-sans)",
                    whiteSpace: "nowrap", transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--alps-accent)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--alps-border)"}
                >
                  View Progress &amp; Cycles →
                </button>
              </div>
            }
          >
            <div>
              <div style={{ marginBottom: "8px", fontSize: "13px" }}>
                <strong>{doneTickets}/{totalTickets} tickets complete</strong>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--alps-bg)", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ height: "100%", width: `${(doneTickets / totalTickets) * 100}%`, background: "var(--alps-success)", transition: "width 0.3s ease" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {[
                  { label: "DONE",    count: doneTickets,                                              color: "var(--alps-success)"    },
                  { label: "IN PROG", count: inProgTickets,                                            color: "var(--alps-accent)"     },
                  { label: "BLOCKED", count: blockedTickets,                                           color: "var(--alps-danger)"     },
                  { label: "TODO",    count: totalTickets - doneTickets - inProgTickets - blockedTickets, color: "var(--alps-text-muted)" },
                ].map(({ label, count, color }) => (
                  <div key={label} style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: `3px solid ${color}` }}>
                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontSize: "20px", fontWeight: "600", color }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </window.Section>

          {/* Validation gates */}
          <window.Section kicker="Validation Gates" title="3-Gate Progression">
            {/* Gate tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "1px solid var(--alps-border)", paddingBottom: "8px" }}>
              {[
                { id: "business", label: "Business Gate" },
                { id: "product",  label: "Product Gate"  },
                { id: "tech",     label: "Tech Gate"     },
              ].map((g) => {
                const gate = project.gates[g.id];
                const pct = gate.completeness || 0;
                const statusColor = gate.status === "cleared" ? "var(--alps-success)" : gate.status === "in_progress" ? "var(--alps-accent)" : "var(--alps-text-muted)";
                const isActive = activeGate === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveGate(g.id)}
                    style={{
                      flex: 1, padding: "8px 10px",
                      background: isActive ? "rgba(8,145,178,0.1)" : "transparent",
                      color: isActive ? "var(--alps-accent)" : "var(--alps-text-muted)",
                      border: "none",
                      borderBottom: isActive ? "2px solid var(--alps-accent)" : "2px solid transparent",
                      cursor: "pointer", fontSize: "12px",
                      fontWeight: isActive ? 600 : 400,
                      fontFamily: "var(--font-sans)",
                      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px",
                    }}
                  >
                    <span>{g.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
                      <div style={{ flex: 1, height: "3px", background: "var(--alps-bg)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: statusColor, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: statusColor, minWidth: "28px", textAlign: "right" }}>{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {activeGate === "business" && <GateContentBusiness project={project} onUpdateItem={handleUpdateGateItem} onAcceptAI={handleAcceptAI} />}
            {activeGate === "product"  && <GateContentProduct  project={project} onUpdateItem={handleUpdateGateItem} onAcceptAI={handleAcceptAI} />}
            {activeGate === "tech"     && <GateContentTech     project={project} onUpdateItem={handleUpdateGateItem} onAcceptAI={handleAcceptAI} />}
          </window.Section>

          {/* Change log */}
          <window.Section kicker="Audit Trail" title="Gate Change Log">
            <div style={{ display: "grid", gap: "8px" }}>
              {project.changeLog && project.changeLog.length > 0 ? (
                project.changeLog.map((entry, i) => (
                  <div key={i} style={{ padding: "10px", background: "var(--alps-bg)", borderRadius: "3px", borderLeft: "3px solid var(--alps-info)", fontSize: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <div>
                        <strong style={{ textTransform: "uppercase", fontSize: "10px", color: "var(--alps-info)", marginRight: "8px" }}>{entry.gate} Gate</strong>
                        <strong style={{ textTransform: "uppercase", fontSize: "10px", color: "var(--alps-accent)" }}>{entry.action.replace(/_/g, " ")}</strong>
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>{entry.date}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>{entry.note}</div>
                    <div style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>by {window.PEOPLE[entry.by]?.fullName}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "12px", color: "var(--alps-text-muted)", fontSize: "12px" }}>No changes yet.</div>
              )}
            </div>
          </window.Section>
        </div>

        {/* ── RIGHT COLUMN — AI Suggestions (sticky) ── */}
        <div style={{ position: "sticky", top: "24px", display: "grid", gap: "24px" }}>
          {pendingSuggestions.length > 0 && (
            <window.Section
              kicker={`${pendingSuggestions.length}`}
              title="Pending AI Suggestions"
              right={<span style={{ fontSize: "11px", color: "var(--alps-warning)", fontWeight: "600" }}>NEEDS REVIEW</span>}
            >
              <div style={{ display: "grid", gap: "12px" }}>
                {pendingSuggestions.map((sug) => (
                  <SuggestionCard key={sug.id} sug={sug} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            </window.Section>
          )}

          {approvedSuggestions.length > 0 && (
            <window.Section
              kicker={`${approvedSuggestions.length}`}
              title="Applied Suggestions"
              right={<span style={{ fontSize: "11px", color: "var(--alps-success)", fontWeight: "600" }}>✓</span>}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                {approvedSuggestions.map((sug) => (
                  <div key={sug.id} style={{ padding: "8px", background: "var(--alps-bg)", borderRadius: "3px", borderLeft: "3px solid var(--alps-success)", fontSize: "11px" }}>
                    <div style={{ fontWeight: "600", marginBottom: "2px" }}>{window.LINEAR_TICKETS[sug.ticketId]?.id}</div>
                    <div style={{ color: "var(--alps-text-muted)", fontSize: "10px" }}>{sug.suggestion}</div>
                  </div>
                ))}
              </div>
            </window.Section>
          )}
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
