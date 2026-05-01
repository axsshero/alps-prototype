// ============================================================
// Tweaks Panel for ALPS
// ============================================================
const { useState, useEffect } = React;

function TweaksUI() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === "__activate_edit_mode") {
        setIsOpen(true);
      } else if (e.data.type === "__deactivate_edit_mode") {
        setIsOpen(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleTweakChange = (key, value) => {
    window.parent.postMessage(
      { type: "__edit_mode_set_keys", edits: { [key]: value } },
      "*"
    );
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "280px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 10000,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: "600" }}>Tweaks</div>
        <button
          onClick={() => {
            setIsOpen(false);
            window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            fontSize: "16px",
            color: "#666",
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Role
          </label>
          <select
            onChange={(e) => handleTweakChange("role", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              border: "1px solid #ddd",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            <option value="requestor">Requestor</option>
            <option value="pm">Product Manager</option>
            <option value="developer">Developer</option>
            <option value="techLead">Tech Lead</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Theme
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => handleTweakChange("theme", "light")}
              style={{
                flex: 1,
                padding: "6px",
                background: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleTweakChange("theme", "dark")}
              style={{
                flex: 1,
                padding: "6px",
                background: "#333",
                color: "white",
                border: "1px solid #555",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Dark
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Density
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => handleTweakChange("density", "comfortable")}
              style={{
                flex: 1,
                padding: "6px",
                background: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Comfortable
            </button>
            <button
              onClick={() => handleTweakChange("density", "compact")}
              style={{
                flex: 1,
                padding: "6px",
                background: "#e0e0e0",
                border: "1px solid #ddd",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Compact
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Project State
          </label>
          <select
            onChange={(e) => handleTweakChange("projectState", e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              border: "1px solid #ddd",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            <option value="all">All projects</option>
            <option value="empty">Drafting</option>
            <option value="in_progress">In progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Register listener before rendering
window.addEventListener("message", (e) => {
  if (e.data.type === "__activate_edit_mode" || e.data.type === "__deactivate_edit_mode") {
    // App listens to these, no extra work needed
  }
});

const tweaksRoot = ReactDOM.createRoot(document.createElement("div"));
document.body.appendChild(tweaksRoot._internalRoot.containerInfo);
tweaksRoot.render(<TweaksUI />);
