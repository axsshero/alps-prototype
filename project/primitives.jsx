// ============================================================
// Shared UI primitives for ALPS — Project Visibility Tool
// ============================================================
const { useState, useEffect, useRef, useMemo, Fragment } = React;

function Avatar({ person, size = 24 }) {
  if (!person) return null;
  const p = window.PEOPLE[person] || { initials: "?", name: "Unknown" };
  return (
    <span
      className="alps-avatar"
      title={p.name + " — " + (p.role || "")}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {p.initials}
    </span>
  );
}

function Pill({ tone = "neutral", children, mono = false }) {
  return (
    <span className={"alps-pill alps-pill--" + tone + (mono ? " alps-pill--mono" : "")}>
      {children}
    </span>
  );
}

function StateBadge({ state }) {
  const map = {
    empty: { label: "Drafting", tone: "muted" },
    in_progress: { label: "In progress", tone: "info" },
    blocked: { label: "Blocked", tone: "danger" },
    done: { label: "Delivered", tone: "success" },
  };
  const s = map[state] || map.in_progress;
  return <Pill tone={s.tone}>{s.label}</Pill>;
}

function GateTriangles({ gates, size = 14, gap = 4 }) {
  const order = ["business", "product", "tech"];
  return (
    <span className="alps-gates" style={{ gap }}>
      {order.map((g) => {
        const status = gates[g].status;
        let fill = "transparent";
        let stroke = "var(--alps-locked-stroke)";
        if (status === "cleared") { fill = "var(--alps-cleared)"; stroke = "var(--alps-cleared)"; }
        else if (status === "in_progress") { fill = "var(--alps-active)"; stroke = "var(--alps-active)"; }
        const w = size, h = size * 1.05;
        return (
          <svg key={g} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-label={g + " gate: " + status}>
            <path d={`M1 1 L${w - 1} ${h / 2} L1 ${h - 1} Z`} fill={fill} stroke={stroke} strokeWidth="1.25" strokeLinejoin="round"/>
          </svg>
        );
      })}
    </span>
  );
}

function GateRow({ gates, onSelect, selected }) {
  const order = [
    { key: "business", label: "Business Gate", purpose: "Validate intent & value" },
    { key: "product", label: "Product Gate", purpose: "Define UX & scope" },
    { key: "tech", label: "Tech Gate", purpose: "Validate feasibility" },
  ];
  return (
    <div className="alps-gaterow">
      {order.map((g, i) => {
        const status = gates[g.key].status;
        const isSelected = selected === g.key;
        return (
          <button
            key={g.key}
            className={"alps-gate alps-gate--" + status + (isSelected ? " alps-gate--selected" : "")}
            onClick={() => onSelect && onSelect(g.key)}
            type="button"
          >
            <div className="alps-gate__triangle">
              <svg viewBox="0 0 40 44" width="40" height="44">
                <path
                  d="M2 2 L38 22 L2 42 Z"
                  fill={status === "cleared" ? "var(--alps-cleared)" : status === "in_progress" ? "var(--alps-active)" : "transparent"}
                  stroke={status === "locked" ? "var(--alps-locked-stroke)" : status === "cleared" ? "var(--alps-cleared)" : "var(--alps-active)"}
                  strokeWidth="1.5" strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="alps-gate__meta">
              <div className="alps-gate__index">Gate {i + 1}</div>
              <div className="alps-gate__label">{g.label}</div>
              <div className="alps-gate__purpose">{g.purpose}</div>
              <div className="alps-gate__status">
                {status === "cleared" && (
                  <Fragment>
                    <span className="alps-dot alps-dot--cleared"></span>Cleared
                    {gates[g.key].clearedOn && (<span className="alps-mono"> · {gates[g.key].clearedOn}</span>)}
                  </Fragment>
                )}
                {status === "in_progress" && (
                  <Fragment>
                    <span className="alps-dot alps-dot--active"></span>In review
                    <span className="alps-mono"> · {gates[g.key].completeness}%</span>
                  </Fragment>
                )}
                {status === "locked" && (
                  <Fragment><span className="alps-dot alps-dot--locked"></span>Locked</Fragment>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, kicker, right, children, dense = false }) {
  return (
    <section className={"alps-section" + (dense ? " alps-section--dense" : "")}>
      <header className="alps-section__head">
        <div>
          {kicker && <div className="alps-kicker">{kicker}</div>}
          <h2 className="alps-section__title">{title}</h2>
        </div>
        {right && <div className="alps-section__right">{right}</div>}
      </header>
      <div className="alps-section__body">{children}</div>
    </section>
  );
}

function Button({ children, kind = "default", size = "md", icon, onClick, disabled, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={"alps-btn alps-btn--" + kind + " alps-btn--" + size}>
      {icon && <span className="alps-btn__icon">{icon}</span>}
      {children}
    </button>
  );
}

const Icon = {
  search: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>,
  plus: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10"/></svg>,
  bell: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7a4 4 0 0 1 8 0v3l1 2H3l1-2zM7 13a1 1 0 0 0 2 0"/></svg>,
  inbox: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l-2-5H4z"/><path d="M2 9h3l1 2h4l1-2h3"/></svg>,
  archive: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="3"/><path d="M3 6v7h10V6M6.5 9h3"/></svg>,
  list: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01"/></svg>,
  audit: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2a6 6 0 1 1-5.7 4.1"/><path d="M2 2v4h4M8 5v3.5L10 10"/></svg>,
  code: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5 2 8l3 3M11 5l3 3-3 3M9 3l-2 10"/></svg>,
  sparkle: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/></svg>,
  chevron: <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg>,
  close: <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8"/></svg>,
  send: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8 14 3l-3 11-3-5z"/></svg>,
  branch: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/><path d="M4 5v6M4 8c0-2 2-3 4-3"/></svg>,
  mr: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="12" r="1.5"/><path d="M4 5.5v5a2 2 0 0 0 2 2h4.5"/><path d="m9 10 1.5 2.5L9 15"/></svg>,
  check: <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m3 8 3 3 7-7"/></svg>,
  warn: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2 1 14h14zM8 6.5v3.5M8 12h.01"/></svg>,
  lock: <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>,
  link: <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 9 9 7M5 11l-1 1a2.5 2.5 0 1 1-3.5-3.5L2 7M11 5l1-1a2.5 2.5 0 1 1 3.5 3.5L14 9"/></svg>,
};

Object.assign(window, { Avatar, Pill, StateBadge, GateTriangles, GateRow, Section, Button, Icon });
