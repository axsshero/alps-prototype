// ============================================================
// DiscussionPanel — Display and manage threaded discussions
// for projects and sprints with optional MS Teams integration
// ============================================================

const { useState, useCallback } = React;

function DiscussionPanel({ entityId, entityType, teamsThreadUrl, onTeamsThreadChange, previewMode = false, onViewAll = null }) {
  const [showTeamsInput, setShowTeamsInput] = useState(false);
  const [teamsThreadInput, setTeamsThreadInput] = useState(teamsThreadUrl || "");
  const [expandedReplies, setExpandedReplies] = useState({});

  // Get discussion thread key from entityType and entityId
  const threadKey = `${entityType}-${entityId}`;
  const allMessages = (window.DISCUSSION_THREAD && window.DISCUSSION_THREAD[threadKey]) || [];
  
  // In preview mode, show only the latest 3 messages
  const messages = previewMode ? allMessages.slice(-3) : allMessages;

  // Format timestamp to readable format
  const formatTime = useCallback((isoTimestamp) => {
    if (!isoTimestamp) return "";
    try {
      const date = new Date(isoTimestamp);
      if (isNaN(date.getTime())) return "";
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  }, []);

  // Handle Teams thread URL save
  const handleSaveTeamsUrl = useCallback(() => {
    if (onTeamsThreadChange) {
      onTeamsThreadChange(teamsThreadInput);
    }
    setShowTeamsInput(false);
  }, [teamsThreadInput, onTeamsThreadChange]);

  // Toggle reply expansion
  const toggleReplies = useCallback((messageId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  // Render a single message with optional nested replies
  const renderMessage = (msg, depth = 0) => {
    const person = window.PEOPLE && window.PEOPLE[msg.author];
    const hasReplies = msg.replies && msg.replies.length > 0;
    const isExpanded = expandedReplies[msg.id];
    const indentPx = depth * 24;

    return (
      <div key={msg.id} style={{ marginLeft: `${indentPx}px`, marginBottom: "12px" }}>
        {/* Message container */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            background: depth === 0 ? "var(--alps-bg)" : "rgba(8, 145, 178, 0.05)",
            borderRadius: "4px",
            borderLeft: depth === 0 ? "3px solid var(--alps-accent)" : "2px solid var(--alps-border)",
          }}
        >
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {person ? (
              <window.Avatar person={msg.author} size={32} />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--alps-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--alps-text-muted)",
                }}
              >
                ?
              </div>
            )}
          </div>

          {/* Message content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Author and timestamp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--alps-text)" }}>
                {person ? person.fullName : msg.author}
              </span>
              <span style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {/* Message text */}
            <div
              style={{
                fontSize: "13px",
                color: "var(--alps-text)",
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}
            >
              {msg.message}
            </div>

            {/* Reply toggle button */}
            {hasReplies && (
              <button
                onClick={() => toggleReplies(msg.id)}
                style={{
                  marginTop: "8px",
                  padding: "4px 8px",
                  background: "transparent",
                  border: "1px solid var(--alps-border)",
                  borderRadius: "3px",
                  color: "var(--alps-accent)",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--alps-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
              >
                {isExpanded ? "▼" : "▶"} {msg.replies.length} {msg.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {hasReplies && isExpanded && (
          <div style={{ marginTop: "8px" }}>
            {msg.replies.map((reply) => renderMessage(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Teams thread section */}
      <div style={{ marginBottom: "20px" }}>
        {teamsThreadUrl && !showTeamsInput ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "rgba(8, 145, 178, 0.1)",
              borderRadius: "4px",
              borderLeft: "3px solid var(--alps-accent)",
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--alps-text)" }}>
              <strong>Teams thread:</strong> {teamsThreadUrl}
            </span>
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              <button
                onClick={() => window.open(teamsThreadUrl, "_blank")}
                style={{
                  padding: "4px 10px",
                  background: "var(--alps-accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Open in Teams
              </button>
              <button
                onClick={() => setShowTeamsInput(true)}
                style={{
                  padding: "4px 10px",
                  background: "transparent",
                  color: "var(--alps-accent)",
                  border: "1px solid var(--alps-accent)",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--alps-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
              >
                Edit
              </button>
            </div>
          </div>
        ) : null}

        {showTeamsInput && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              background: "var(--alps-bg)",
              borderRadius: "4px",
              borderLeft: "3px solid var(--alps-info)",
            }}
          >
            <input
              type="text"
              value={teamsThreadInput}
              onChange={(e) => setTeamsThreadInput(e.target.value)}
              placeholder="Paste Teams thread URL..."
              style={{
                flex: 1,
                padding: "8px 10px",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--alps-border)",
                borderRadius: "3px",
                background: "var(--alps-bg-alt)",
                color: "var(--alps-text)",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--alps-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
            />
            <button
              onClick={handleSaveTeamsUrl}
              style={{
                padding: "6px 12px",
                background: "var(--alps-accent)",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowTeamsInput(false);
                setTeamsThreadInput(teamsThreadUrl || "");
              }}
              style={{
                padding: "6px 12px",
                background: "transparent",
                color: "var(--alps-text-muted)",
                border: "1px solid var(--alps-border)",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "600",
                fontFamily: "var(--font-sans)",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--alps-text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
            >
              Cancel
            </button>
          </div>
        )}

        {!teamsThreadUrl && !showTeamsInput && (
          <button
            onClick={() => setShowTeamsInput(true)}
            style={{
              padding: "8px 12px",
              background: "transparent",
              color: "var(--alps-accent)",
              border: "1px dashed var(--alps-accent)",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "var(--font-sans)",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--alps-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
          >
            + Link Teams thread
          </button>
        )}
      </div>

      {/* Discussion messages */}
      <div>
        {messages.length > 0 ? (
          <div style={{ display: "grid", gap: "8px" }}>
            {messages.map((msg) => renderMessage(msg, 0))}
            
            {/* "View all" link in preview mode */}
            {previewMode && allMessages.length > 3 && onViewAll && (
              <button
                onClick={onViewAll}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  color: "var(--alps-accent)",
                  border: "1px solid var(--alps-accent)",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.15s",
                  marginTop: "8px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--alps-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--alps-border)")}
              >
                View all {allMessages.length} messages →
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "var(--alps-text-muted)",
              fontSize: "12px",
            }}
          >
            No discussion messages yet. Start a conversation!
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { DiscussionPanel });
