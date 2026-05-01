import React, { useState, useEffect, Fragment } from "react";

const alpsStyles = /*EDITMODE-BEGIN*/{
  "primaryColor": "#2563eb",
  "accentColor": "#0891b2",
  "successColor": "#10b981",
  "warningColor": "#f59e0b",
  "dangerColor": "#ef4444",
  "infoColor": "#06b6d4",
  "darkMode": true
}/*EDITMODE-END*/;

function App() {
  const [role, setRole] = useState("pm");
  const [screen, setScreen] = useState("dashboard");
  const [suggestions, setSuggestions] = useState(window.SUGGESTIONS || {});

  // Setup tweak mode listener
  useEffect(() => {
    const handleTweak = (e) => {
      if (e.data?.type === "__activate_edit_mode") {
        // Show tweaks
      } else if (e.data?.type === "__deactivate_edit_mode") {
        // Hide tweaks
      }
    };
    window.addEventListener("message", handleTweak);
    return () => window.removeEventListener("message", handleTweak);
  }, []);

  const appClass = alpsStyles.darkMode ? "alps-app dark" : "alps-app light";

  return (
    <div className={appClass} style={{ "--alps-primary": alpsStyles.primaryColor, "--alps-accent": alpsStyles.accentColor, "--alps-success": alpsStyles.successColor, "--alps-warning": alpsStyles.warningColor, "--alps-danger": alpsStyles.dangerColor, "--alps-info": alpsStyles.infoColor }}>
      <header className="alps-header">
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--alps-text)" }}>ALPS</div>
          <nav style={{ display: "flex", gap: "2px" }}>
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "portfolio", label: "Portfolio" },
              { id: "new-request", label: "New Request" },
              { id: "archive", label: "Archive" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                style={{
                  padding: "8px 12px",
                  background: screen === item.id ? "var(--alps-accent)" : "transparent",
                  color: screen === item.id ? "white" : "var(--alps-text-muted)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: screen === item.id ? "600" : "400",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: "6px 8px",
              background: "var(--alps-bg)",
              border: "1px solid var(--alps-border)",
              borderRadius: "4px",
              color: "var(--alps-text)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <option value="pm">PM</option>
            <option value="developer">Developer</option>
            <option value="techLead">Tech Lead</option>
            <option value="requestor">Requestor</option>
          </select>

          <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: "var(--alps-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
            {window.PEOPLE["you"]?.initials || "JD"}
          </div>
        </div>
      </header>

      <main className="alps-main">
        {screen === "dashboard" && <DashboardScreen role={role} suggestions={suggestions} onSuggestionUpdate={setSuggestions} />}
        {screen === "portfolio" && <PortfolioScreen role={role} />}
        {screen === "new-request" && <NewRequestScreen />}
        {screen === "archive" && <ArchiveScreen role={role} />}
      </main>

      <style>{`
        :root {
          --alps-primary: ${alpsStyles.primaryColor};
          --alps-accent: ${alpsStyles.accentColor};
          --alps-success: ${alpsStyles.successColor};
          --alps-warning: ${alpsStyles.warningColor};
          --alps-danger: ${alpsStyles.dangerColor};
          --alps-info: ${alpsStyles.infoColor};
          --alps-bg: ${alpsStyles.darkMode ? "#1a1a1a" : "#ffffff"};
          --alps-bg-alt: ${alpsStyles.darkMode ? "#262626" : "#f9fafb"};
          --alps-text: ${alpsStyles.darkMode ? "#f0f0f0" : "#1a1a1a"};
          --alps-text-muted: ${alpsStyles.darkMode ? "#a0a0a0" : "#6b7280"};
          --alps-border: ${alpsStyles.darkMode ? "#3f3f3f" : "#e5e7eb"};
          --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; font-family: var(--font-sans); }

        .alps-app {
          background: var(--alps-bg);
          color: var(--alps-text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .alps-header {
          background: var(--alps-bg-alt);
          border-bottom: 1px solid var(--alps-border);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .alps-main {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .alps-sidebar {
          width: 280px;
          background: var(--alps-bg-alt);
          border-right: 1px solid var(--alps-border);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        window-section {
          background: var(--alps-bg-alt);
          border: 1px solid var(--alps-border);
          border-radius: 6px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

function DashboardScreen({ role, suggestions, onSuggestionUpdate }) {
  const project = window.PROJECT;
  const totalTickets = Object.keys(window.LINEAR_TICKETS).length;
  const doneTickets = Object.values(window.LINEAR_TICKETS).filter((t) => t.status === "done").length;
  const inProgressTickets = Object.values(window.LINEAR_TICKETS).filter((t) => t.status === "in_progress").length;
  const blockedTickets = Object.values(window.LINEAR_TICKETS).filter((t) => t.status === "blocked").length;
  const [activeGate, setActiveGate] = useState("business");

  const pendingSuggestions = Object.values(suggestions).filter((s) => s.status === "pending_approval");
  const approvedSuggestions = Object.values(suggestions).filter((s) => s.status === "approved");

  const handleSuggestionApprove = (sugId, updatedContent) => {
    const updated = { ...suggestions };
    Object.keys(updated).forEach((key) => {
      if (updated[key].id === sugId) {
        updated[key].status = "approved";
        if (updatedContent) {
          updated[key].suggestion = updatedContent;
        }
      }
    });
    onSuggestionUpdate(updated);
  };

  const handleSuggestionReject = (sugId, rejectionReason) => {
    const updated = { ...suggestions };
    Object.keys(updated).forEach((key) => {
      if (updated[key].id === sugId) {
        updated[key].status = "rejected";
        updated[key].rejectionReason = rejectionReason;
        updated[key].rejectionAt = new Date().toLocaleString();
      }
    });
    onSuggestionUpdate(updated);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
      {/* LEFT COLUMN - Main dashboard content */}
      <div style={{ display: "grid", gap: "24px" }}>
        <window.Section kicker="Project" title={project.title}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "var(--alps-text-muted)", marginBottom: "8px" }}>
              {project.id} · {project.summary}
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "12px" }}>
              {project.requestor && (
                <div>
                  <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>Requestor</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <window.Avatar person={project.requestor} size={20} />
                    <div style={{ fontSize: "12px" }}>{window.PEOPLE[project.requestor]?.fullName}</div>
                  </div>
                </div>
              )}
              {project.pm && (
                <div>
                  <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>PM</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <window.Avatar person={project.pm} size={20} />
                    <div style={{ fontSize: "12px" }}>{window.PEOPLE[project.pm]?.fullName}</div>
                  </div>
                </div>
              )}
              {project.techLead && (
                <div>
                  <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>Tech Lead</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <window.Avatar person={project.techLead} size={20} />
                    <div style={{ fontSize: "12px" }}>{window.PEOPLE[project.techLead]?.fullName}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </window.Section>

        <window.Section
          kicker="Progress"
          title="Ticket Status"
          right={
            <div style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
              <div><span style={{ color: "var(--alps-success)" }}>●</span> {doneTickets}</div>
              <div><span style={{ color: "var(--alps-accent)" }}>●</span> {inProgressTickets}</div>
              <div><span style={{ color: "var(--alps-danger)" }}>●</span> {blockedTickets}</div>
            </div>
          }
        >
          <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
            <div style={{ marginBottom: "12px" }}>
              <strong>{doneTickets}/{totalTickets} tickets complete</strong>
            </div>
            <div style={{ width: "100%", height: "8px", background: "var(--alps-bg)", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ height: "100%", width: `${(doneTickets / totalTickets) * 100}%`, background: "var(--alps-success)", transition: "width 0.3s ease" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: "3px solid var(--alps-success)" }}>
                <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>DONE</div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: "var(--alps-success)" }}>{doneTickets}</div>
              </div>
              <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: "3px solid var(--alps-accent)" }}>
                <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>IN PROG</div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: "var(--alps-accent)" }}>{inProgressTickets}</div>
              </div>
              <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: "3px solid var(--alps-danger)" }}>
                <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>BLOCKED</div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: "var(--alps-danger)" }}>{blockedTickets}</div>
              </div>
              <div style={{ padding: "12px", background: "var(--alps-bg)", borderRadius: "4px", borderLeft: "3px solid var(--alps-text-muted)" }}>
                <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "4px" }}>TODO</div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: "var(--alps-text-muted)" }}>{totalTickets - doneTickets - inProgressTickets - blockedTickets}</div>
              </div>
            </div>
          </div>
        </window.Section>

        <window.Section kicker="Validation Gates" title="3-Gate Progression">
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "1px solid var(--alps-border)", paddingBottom: "8px" }}>
            {[
              { id: "business", label: "Business Gate" },
              { id: "product", label: "Product Gate" },
              { id: "tech", label: "Tech Gate" },
            ].map((gate) => (
              <button
                key={gate.id}
                onClick={() => setActiveGate(gate.id)}
                style={{
                  padding: "8px 12px",
                  background: activeGate === gate.id ? "var(--alps-accent)" : "transparent",
                  color: activeGate === gate.id ? "white" : "var(--alps-text)",
                  border: "none",
                  borderRadius: "3px 3px 0 0",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: activeGate === gate.id ? "600" : "400",
                }}
              >
                {gate.label}
              </button>
            ))}
          </div>
          {activeGate === "business" && <GateContentBusiness project={project} />}
          {activeGate === "product" && <GateContentProduct project={project} />}
          {activeGate === "tech" && <GateContentTech project={project} />}
        </window.Section>

        <window.Section kicker="Audit Trail" title="Gate Change Log">
          <div style={{ display: "grid", gap: "8px" }}>
            {project.changeLog && project.changeLog.length > 0 ? (
              project.changeLog.map((entry, i) => (
                <div key={i} style={{ padding: "10px", background: "var(--alps-bg)", borderRadius: "3px", borderLeft: "3px solid var(--alps-info)", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <div>
                      <strong style={{ textTransform: "uppercase", fontSize: "10px", color: "var(--alps-info)", marginRight: "8px" }}>
                        {entry.gate} Gate
                      </strong>
                      <strong style={{ textTransform: "uppercase", fontSize: "10px", color: "var(--alps-accent)" }}>
                        {entry.action.replace(/_/g, " ")}
                      </strong>
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

      {/* RIGHT COLUMN - AI Suggestions (sticky) */}
      <div style={{ position: "sticky", top: "80px", display: "grid", gap: "24px" }}>
        {pendingSuggestions.length > 0 && (
          <window.Section 
            kicker={`${pendingSuggestions.length}`}
            title="Pending AI Suggestions"
            right={<span style={{ fontSize: "11px", color: "var(--alps-warning)", fontWeight: "600" }}>NEEDS REVIEW</span>}
          >
            <div style={{ display: "grid", gap: "12px" }}>
              {pendingSuggestions.map((sug) => {
                const [editText, setEditText] = useState(sug.suggestion);
                const [rejectionReason, setRejectionReason] = useState("");
                const [showRejectionInput, setShowRejectionInput] = useState(false);

                return (
                  <div key={sug.id} style={{ padding: "12px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "4px", borderLeft: "3px solid var(--alps-warning)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--alps-warning)", textTransform: "uppercase", marginBottom: "4px" }}>
                          {sug.type === "scope_update" && "📋 Scope Update"}
                          {sug.type === "acceptance_criteria" && "✓ Acceptance Criteria"}
                          {sug.type === "unblock_strategy" && "🔓 Unblock Strategy"}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--alps-text)", fontWeight: "500", marginBottom: "6px" }}>
                          {window.LINEAR_TICKETS[sug.ticketId]?.id}: {window.LINEAR_TICKETS[sug.ticketId]?.title}
                        </div>
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>{sug.createdAt}</span>
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "8px" }}>
                      {sug.rationale}
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                        Edit before approving:
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="3"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid var(--alps-border)",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontFamily: "var(--font-sans)",
                          background: "var(--alps-bg-alt)",
                          color: "var(--alps-text)",
                          marginBottom: "8px",
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
                            width: "100%",
                            padding: "8px",
                            border: "1px solid var(--alps-border)",
                            borderRadius: "3px",
                            fontSize: "12px",
                            fontFamily: "var(--font-sans)",
                            background: "var(--alps-bg-alt)",
                            color: "var(--alps-text)",
                            marginBottom: "8px",
                          }}
                        />
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          handleSuggestionApprove(sug.id, editText);
                        }}
                        style={{
                          padding: "6px 12px",
                          background: "var(--alps-success)",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        ✓ Approve
                      </button>
                      {!showRejectionInput ? (
                        <button
                          onClick={() => setShowRejectionInput(true)}
                          style={{
                            padding: "6px 12px",
                            background: "var(--alps-bg)",
                            color: "var(--alps-danger)",
                            border: "1px solid var(--alps-danger)",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          ✗ Reject
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              if (rejectionReason.trim()) {
                                handleSuggestionReject(sug.id, rejectionReason);
                                setShowRejectionInput(false);
                              }
                            }}
                            style={{
                              padding: "6px 12px",
                              background: "var(--alps-danger)",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            Send
                          </button>
                          <button
                            onClick={() => setShowRejectionInput(false)}
                            style={{
                              padding: "6px 12px",
                              background: "var(--alps-bg)",
                              color: "var(--alps-text)",
                              border: "1px solid var(--alps-border)",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
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
  );
}

function GateContentBusiness({ project }) {
  const gate = project.gates.business;
  return (
    <div style={{ fontSize: "13px", color: "var(--alps-text-muted)" }}>
      <div><strong>Status:</strong> {gate.status}</div>
    </div>
  );
}

function GateContentProduct({ project }) {
  const gate = project.gates.product;
  return (
    <div style={{ fontSize: "13px", color: "var(--alps-text-muted)" }}>
      <div><strong>Status:</strong> {gate.status}</div>
    </div>
  );
}

function GateContentTech({ project }) {
  const gate = project.gates.tech;
  return (
    <div style={{ fontSize: "13px", color: "var(--alps-text-muted)" }}>
      <div><strong>Status:</strong> {gate.status}</div>
    </div>
  );
}

function PortfolioScreen({ role }) {
  return <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>Portfolio view coming soon...</div>;
}

function NewRequestScreen() {
  return <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>New request form coming soon...</div>;
}

function ArchiveScreen({ role }) {
  return <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>Archive view coming soon...</div>;
}

// Custom window.Section component
window.Section = function Section({ kicker, title, right, children }) {
  return (
    <div style={{ background: "var(--alps-bg-alt)", border: "1px solid var(--alps-border)", borderRadius: "6px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <div>
          {kicker && <div style={{ fontSize: "11px", color: "var(--alps-text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>{kicker}</div>}
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--alps-text)" }}>{title}</div>
        </div>
        {right && <div style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>{right}</div>}
      </div>
      {children}
    </div>
  );
};

// Custom window.Avatar component
window.Avatar = function Avatar({ person, size = 24 }) {
  const personData = window.PEOPLE[person];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
        background: `hsl(${hash(person) % 360}, 70%, 60%)`,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        fontWeight: "600",
      }}
    >
      {personData?.initials || "?"}
    </div>
  );
};

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

Object.assign(window, { App, DashboardScreen });
