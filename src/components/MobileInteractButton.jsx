export default function MobileInteractButton({
  nearZone,
  onInteract,
  visible,
}) {
  if (!visible || !nearZone || nearZone === "Welcome") return null;

  return (
    <button
      style={styles.btn}
      onTouchStart={(e) => {
        e.preventDefault();
        onInteract();
      }}
      onClick={onInteract}
    >
      <span style={styles.icon}>⬡</span>
      <span style={styles.label}>Enter {nearZone}</span>
    </button>
  );
}

const styles = {
  btn: {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "14px 22px",
    background: "rgba(108, 99, 255, 0.2)",
    border: "2px solid rgba(108, 99, 255, 0.6)",
    borderRadius: 16,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#e8e8f0",
    cursor: "pointer",
    fontFamily: "'Inter', system-ui, sans-serif",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    animation: "mobileInteractPulse 2s ease-in-out infinite",
  },
  icon: {
    fontSize: 22,
    lineHeight: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    maxWidth: 110,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

// Inject keyframe once
if (typeof document !== "undefined") {
  const id = "mobile-interact-keyframes";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes mobileInteractPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.3); }
        50% { box-shadow: 0 0 0 8px rgba(108, 99, 255, 0); }
      }
    `;
    document.head.appendChild(s);
  }
}
