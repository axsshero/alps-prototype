// ============================================================
// App shell — routing, sidebar, and root render
// Screens live in screen-dashboard.jsx, screen-portfolio.jsx, screen-cycles.jsx
// ============================================================

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
  const [role, setRole]                     = React.useState("pm");
  const [screen, setScreen]                 = React.useState("overview");
  const [suggestions, setSuggestions]       = React.useState(window.INITIAL_SUGGESTIONS || {});
  const [activeProjectId, setActiveProjectId] = React.useState(null);
  const [fromPortfolio, setFromPortfolio]   = React.useState(false);
  const [editingSprintId, setEditingSprintId] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleTweak = (e) => {
      if (e.data?.type === "__activate_edit_mode") { /* show tweaks */ }
      else if (e.data?.type === "__deactivate_edit_mode") { /* hide tweaks */ }
    };
    window.addEventListener("message", handleTweak);
    return () => window.removeEventListener("message", handleTweak);
  }, []);

  // Close mobile menu when screen changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [screen]);

  const appClass = alpsStyles.darkMode ? "alps-app dark" : "alps-app light";

  return (
    <div
      className={appClass}
      style={{
        "--alps-primary": alpsStyles.primaryColor,
        "--alps-accent":  alpsStyles.accentColor,
        "--alps-success": alpsStyles.successColor,
        "--alps-warning": alpsStyles.warningColor,
        "--alps-danger":  alpsStyles.dangerColor,
        "--alps-info":    alpsStyles.infoColor,
      }}
    >
      {/* Mobile header - shown only on mobile */}
      <div className="mobile-header">
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--alps-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white" }}>A</div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)", letterSpacing: "-0.01em" }}>ALPS</span>
        </div>
        <div style={{ width: "36px" }} />
      </div>

      {/* Mobile overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
      />

      {/* Desktop/Mobile content wrapper */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        <Sidebar_Nav 
          screen={screen} 
          setScreen={setScreen} 
          role={role} 
          setRole={setRole}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="alps-main">
          {screen === "overview" && <window.OverviewScreen role={role} setScreen={setScreen} setActiveProjectId={setActiveProjectId} />}
          {screen === "dashboard" && (
            <DashboardScreen
              role={role}
              suggestions={suggestions}
              onSuggestionUpdate={setSuggestions}
              activeProjectId={activeProjectId}
              fromPortfolio={fromPortfolio}
              setScreen={setScreen}
              setFromPortfolio={setFromPortfolio}
            />
          )}
          {screen === "portfolio" && (
            <PortfolioScreen
              role={role}
              setScreen={setScreen}
              setActiveProjectId={setActiveProjectId}
              setFromPortfolio={setFromPortfolio}
            />
          )}
          {screen === "cycles"      && <CyclesScreen role={role} setScreen={setScreen} setActiveProjectId={setActiveProjectId} setFromPortfolio={setFromPortfolio} />}
          {screen === "new-request" && <window.NewRequestScreen setScreen={setScreen} setActiveProjectId={setActiveProjectId} />}
          {screen === "create-sprint" && <window.NewSprintForm projectId={activeProjectId || window.PROJECT.id} onSuccess={() => setScreen("overview")} />}
          {screen === "create-ticket" && <window.NewRequestScreen setScreen={setScreen} setActiveProjectId={setActiveProjectId} />}
          {screen === "sprint-detail" && (window.__editingSprintId || editingSprintId) && <window.SprintDetailScreen sprintId={window.__editingSprintId || editingSprintId} projectId={activeProjectId} setScreen={setScreen} />}
          {screen === "archive"     && <ArchiveScreen role={role} />}
        </main>
      </div>
    </div>
  );
}

// ─── Sidebar navigation ───────────────────────────────────────────────────────

function Sidebar_Nav({ screen, setScreen, role, setRole, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
    { id: "overview",    label: "Overview",    icon: window.Icon.list    },
    { id: "portfolio",   label: "Portfolio",   icon: window.Icon.inbox   },
    { id: "cycles",      label: "Cycles",      icon: window.Icon.audit   },
    { id: "new-request", label: "New Request", icon: window.Icon.plus    },
    { id: "archive",     label: "Archive",     icon: window.Icon.archive },
  ];

  const handleNavClick = (screenId) => {
    setScreen(screenId);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <nav className={`alps-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ padding: "0", display: "flex", flexDirection: "column" }}>
      {/* Wordmark */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--alps-border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--alps-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white" }}>A</div>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)", letterSpacing: "-0.01em" }}>ALPS</span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "8px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", marginBottom: "2px",
                  background: isActive ? "var(--alps-accent-overlay)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "3px solid var(--alps-accent)" : "3px solid transparent",
                  borderRadius: "0 4px 4px 0",
                  color: isActive ? "var(--alps-accent)" : "var(--alps-text-muted)",
                  cursor: "pointer", fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "var(--font-sans)", textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div style={{ borderTop: "1px solid var(--alps-border)", paddingTop: "8px", display: "grid", gap: "6px" }}>
          <button
            onClick={() => handleNavClick("create-sprint")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 10px",
              background: "transparent",
              border: "1px solid var(--alps-accent)",
              borderRadius: "4px",
              color: "var(--alps-accent)",
              cursor: "pointer", fontSize: "12px",
              fontWeight: 600,
              fontFamily: "var(--font-sans)", textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--alps-accent-overlay)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>+</span>
            Create Sprint
          </button>
          <button
            onClick={() => handleNavClick("create-ticket")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 10px",
              background: "transparent",
              border: "1px solid var(--alps-accent)",
              borderRadius: "4px",
              color: "var(--alps-accent)",
              cursor: "pointer", fontSize: "12px",
              fontWeight: 600,
              fontFamily: "var(--font-sans)", textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--alps-accent-overlay)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>+</span>
            Create Ticket
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Stub screens (not yet implemented) ──────────────────────────────────────

function ArchiveScreen({ role }) {
  return <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>Archive view coming soon...</div>;
}

// ─── Shared window components (used across screens) ───────────────────────────

// Override Section from primitives with the app-shell version
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

function _hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
  return Math.abs(h);
}

window.Avatar = function Avatar({ person, size = 24 }) {
  const personData = window.PEOPLE[person];
  return (
    <div style={{ width: size, height: size, borderRadius: "4px", background: `hsl(${_hash(person || "") % 360}, 70%, 60%)`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, fontWeight: "600" }}>
      {personData?.initials || "?"}
    </div>
  );
};

// ─── Boot ─────────────────────────────────────────────────────────────────────

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

Object.assign(window, { App, Sidebar_Nav });
