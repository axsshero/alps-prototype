// ============================================================
// Attachment System Components for ALPS
// ============================================================
const { useState, useEffect, useRef, useMemo, Fragment } = React;

// Placeholder components - will be implemented in subsequent tasks

function Attachment_List({ attachments, emptyMessage = "No attachments", compact = false }) {
  // Handle missing or empty attachments array
  if (!attachments || attachments.length === 0) {
    return (
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          color: "var(--alps-text-muted)",
          fontSize: "12px",
          fontStyle: "italic",
          background: "var(--alps-bg-alt)",
          border: "1px solid var(--alps-border)",
          borderRadius: "4px",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  // Render list of attachments
  return (
    <div
      style={{
        display: "grid",
        gap: compact ? "8px" : "12px",
      }}
    >
      {attachments.map((attachment) => (
        <window.Attachment_Item
          key={attachment.id}
          attachment={attachment}
          compact={compact}
        />
      ))}
    </div>
  );
}

function Attachment_Item({ attachment, compact = false }) {
  if (!attachment || !attachment.name) {
    return null; // Skip rendering invalid items
  }

  // File type color mapping
  const getTypeColor = (type) => {
    const colorMap = {
      PDF: "var(--alps-danger)",      // red
      Figma: "var(--alps-primary)",   // blue
      Markdown: "var(--alps-info)",   // light blue
      Excel: "var(--alps-success)",   // green
      ZIP: "var(--alps-text-muted)",  // gray
      Image: "var(--alps-warning)",   // amber
    };
    return colorMap[type] || "var(--alps-text-muted)";
  };

  // Get uploader info
  const uploader = window.PEOPLE?.[attachment.uploadedBy] || {
    name: "Unknown User",
    initials: "?",
  };

  // Handle click on attachment name
  const handleClick = (e) => {
    if (attachment.url === "#") {
      e.preventDefault();
      alert("File preview will be available in production. This is a prototype placeholder.");
    }
  };

  const typeColor = getTypeColor(attachment.type);

  if (compact) {
    // Compact mode: single line layout
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 10px",
          background: "var(--alps-bg)",
          border: "1px solid var(--alps-border)",
          borderRadius: "4px",
          fontSize: "11px",
          transition: "border-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--alps-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--alps-border)";
        }}
      >
        {/* File type badge */}
        <span
          style={{
            display: "inline-block",
            padding: "2px 6px",
            background: typeColor,
            color: "white",
            borderRadius: "3px",
            fontSize: "9px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}
        >
          {attachment.type}
        </span>

        {/* Attachment name */}
        <a
          href={attachment.url}
          onClick={handleClick}
          style={{
            color: "var(--alps-text)",
            textDecoration: "none",
            fontWeight: 600,
            flexShrink: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--alps-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--alps-text)";
          }}
        >
          {attachment.name}
        </a>

        {/* Size */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--alps-text-muted)",
            fontSize: "10px",
            flexShrink: 0,
          }}
        >
          {attachment.size}
        </span>

        {/* Upload time (abbreviated) */}
        <span
          style={{
            color: "var(--alps-text-muted)",
            fontSize: "10px",
            flexShrink: 0,
          }}
        >
          {attachment.uploadedAt.replace(" ago", "")}
        </span>
      </div>
    );
  }

  // Standard mode: two-line layout with avatar
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px 14px",
        background: "var(--alps-bg)",
        border: "1px solid var(--alps-border)",
        borderRadius: "4px",
        transition: "border-color 0.15s ease, background 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--alps-accent)";
        e.currentTarget.style.background = "rgba(8, 145, 178, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--alps-border)";
        e.currentTarget.style.background = "var(--alps-bg)";
      }}
    >
      {/* Top row: type badge, name, size */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* File type badge */}
        <span
          style={{
            display: "inline-block",
            padding: "3px 7px",
            background: typeColor,
            color: "white",
            borderRadius: "3px",
            fontSize: "9px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}
        >
          {attachment.type}
        </span>

        {/* Attachment name */}
        <a
          href={attachment.url}
          onClick={handleClick}
          style={{
            color: "var(--alps-text)",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 600,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--alps-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--alps-text)";
          }}
        >
          {attachment.name}
        </a>

        {/* Size */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--alps-text-muted)",
            flexShrink: 0,
          }}
        >
          {attachment.size}
        </span>
      </div>

      {/* Bottom row: avatar, uploader name, upload time */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <window.Avatar person={attachment.uploadedBy} size={16} />
        <span style={{ fontSize: "11px", color: "var(--alps-text-muted)" }}>
          {uploader.name || uploader.fullName}
        </span>
        <span style={{ color: "var(--alps-text-muted)", fontSize: "11px" }}>·</span>
        <span style={{ fontSize: "10px", color: "var(--alps-text-muted)" }}>
          {attachment.uploadedAt}
        </span>
      </div>
    </div>
  );
}

function Attachment_Upload_Placeholder({ entityType, entityId }) {
  const handleClick = () => {
    alert("File upload will be available in production. For now, attachments are pre-populated in the data layer.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: "100%",
        padding: "10px 14px",
        background: "transparent",
        border: "1px dashed var(--alps-border)",
        borderRadius: "4px",
        color: "var(--alps-text-muted)",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--alps-accent)";
        e.currentTarget.style.color = "var(--alps-accent)";
        e.currentTarget.style.background = "rgba(8, 145, 178, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--alps-border)";
        e.currentTarget.style.color = "var(--alps-text-muted)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {window.Icon.plus}
      <span>Add Attachment</span>
    </button>
  );
}

function Sprint_Description({ description, emptyMessage = "No description" }) {
  // Handle missing or empty description
  if (!description || description.trim() === "") {
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "var(--alps-bg-alt)",
          border: "1px solid var(--alps-border)",
          borderLeft: "3px solid var(--alps-info)",
          borderRadius: "4px",
          color: "var(--alps-text-muted)",
          fontSize: "12px",
          fontStyle: "italic",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  // Render description with line breaks preserved
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--alps-bg-alt)",
        border: "1px solid var(--alps-border)",
        borderLeft: "3px solid var(--alps-info)",
        borderRadius: "4px",
        color: "var(--alps-text)",
        fontSize: "12px",
        lineHeight: "1.5",
        whiteSpace: "pre-wrap", // Preserve line breaks and wrap text
      }}
    >
      {description}
    </div>
  );
}

// Expose all components on window
Object.assign(window, {
  Attachment_List,
  Attachment_Item,
  Attachment_Upload_Placeholder,
  Sprint_Description,
});
