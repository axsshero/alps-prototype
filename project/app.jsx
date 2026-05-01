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
  const [screen, setScreen]                 = React.useState("dashboard");
  const [suggestions, setSuggestions]       = React.useState(window.INITIAL_SUGGESTIONS || {});
  const [activeProjectId, setActiveProjectId] = React.useState(null);
  const [fromPortfolio, setFromPortfolio]   = React.useState(false);

  React.useEffect(() => {
    const handleTweak = (e) => {
      if (e.data?.type === "__activate_edit_mode") { /* show tweaks */ }
      else if (e.data?.type === "__deactivate_edit_mode") { /* hide tweaks */ }
    };
    window.addEventListener("message", handleTweak);
    return () => window.removeEventListener("message", handleTweak);
  }, []);

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
      <Sidebar_Nav screen={screen} setScreen={setScreen} role={role} setRole={setRole} />

      <main className="alps-main">
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
        {screen === "new-request" && <NewRequestScreen />}
        {screen === "archive"     && <ArchiveScreen role={role} />}
      </main>
    </div>
  );
}

// ─── Sidebar navigation ───────────────────────────────────────────────────────

function Sidebar_Nav({ screen, setScreen, role, setRole }) {
  const navItems = [
    { id: "dashboard",   label: "Dashboard",   icon: window.Icon.list    },
    { id: "portfolio",   label: "Portfolio",   icon: window.Icon.inbox   },
    { id: "cycles",      label: "Cycles",      icon: window.Icon.audit   },
    { id: "new-request", label: "New Request", icon: window.Icon.plus    },
    { id: "archive",     label: "Archive",     icon: window.Icon.archive },
  ];

  return (
    <nav className="alps-sidebar" style={{ padding: "0", display: "flex", flexDirection: "column" }}>
      {/* Wordmark */}
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--alps-border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--alps-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white" }}>A</div>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--alps-text)", letterSpacing: "-0.01em" }}>ALPS</span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "8px" }}>
        {navItems.map((item) => {
          const isActive = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 10px", marginBottom: "2px",
                background: isActive ? "rgba(8, 145, 178, 0.12)" : "transparent",
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

      {/* Role switcher */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--alps-border)" }}>
        <div style={{ fontSize: "10px", color: "var(--alps-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Role</div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "6px 8px", background: "var(--alps-bg)", border: "1px solid var(--alps-border)", borderRadius: "4px", color: "var(--alps-text)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
        >
          <option value="pm">PM</option>
          <option value="developer">Developer</option>
          <option value="techLead">Tech Lead</option>
          <option value="requestor">Requestor</option>
        </select>
      </div>
    </nav>
  );
}

// ─── Stub screens (not yet implemented) ──────────────────────────────────────

function NewRequestScreen() {
  return <div style={{ padding: "24px", color: "var(--alps-text-muted)" }}>New request form coming soon...</div>;
}

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
