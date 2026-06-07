import { useEffect, useRef, useCallback } from "react";

// Publishes virtual key state that PlayerController can read
const virtualKeys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

export function getVirtualKeys() {
  return virtualKeys;
}

const JOYSTICK_RADIUS = 56;
const KNOB_RADIUS = 22;
const DEAD_ZONE = 0.15;

export default function VirtualJoystick({ visible }) {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const touchIdRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });

  const resetKnob = useCallback(() => {
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
    virtualKeys.forward = false;
    virtualKeys.backward = false;
    virtualKeys.left = false;
    virtualKeys.right = false;
  }, []);

  // Reset everything when visibility changes so the joystick never
  // gets stuck after the welcome interaction or zone overlays.
  useEffect(() => {
    if (!visible) {
      touchIdRef.current = null;
      resetKnob();
    }
  }, [visible, resetKnob]);

  const handleMove = useCallback((clientX, clientY) => {
    const ox = originRef.current.x;
    const oy = originRef.current.y;
    let dx = clientX - ox;
    let dy = clientY - oy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clamped = Math.min(dist, JOYSTICK_RADIUS);
    if (dist > 0) {
      dx = (dx / dist) * clamped;
      dy = (dy / dist) * clamped;
    }

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    const nx = dist > 0 ? dx / JOYSTICK_RADIUS : 0;
    const ny = dist > 0 ? dy / JOYSTICK_RADIUS : 0;

    virtualKeys.forward = ny < -DEAD_ZONE;
    virtualKeys.backward = ny > DEAD_ZONE;
    virtualKeys.left = nx < -DEAD_ZONE;
    virtualKeys.right = nx > DEAD_ZONE;
  }, []);

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;

    const onTouchStart = (e) => {
      if (touchIdRef.current !== null) return;
      const t = e.changedTouches[0];
      touchIdRef.current = t.identifier;
      const rect = base.getBoundingClientRect();
      originRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      handleMove(t.clientX, t.clientY);
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchIdRef.current) {
          handleMove(t.clientX, t.clientY);
          e.preventDefault();
          break;
        }
      }
    };

    const onTouchEnd = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchIdRef.current) {
          touchIdRef.current = null;
          resetKnob();
          break;
        }
      }
    };

    base.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      base.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleMove, resetKnob]);

  // Keep the DOM mounted so event listeners survive visibility toggles.
  // Hide with CSS instead of returning null.
  const wrapperStyle = {
    ...styles.wrapper,
    display: visible ? "block" : "none",
    pointerEvents: visible ? "auto" : "none",
  };

  return (
    <div style={wrapperStyle}>
      <div ref={baseRef} style={styles.base}>
        <div ref={knobRef} style={styles.knob} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 32,
    left: 32,
    zIndex: 300,
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "none",
  },
  base: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: "50%",
    background: "rgba(108, 99, 255, 0.15)",
    border: "2px solid rgba(108, 99, 255, 0.45)",
    position: "relative",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    cursor: "grab",
    touchAction: "none",
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: "50%",
    background: "rgba(108, 99, 255, 0.65)",
    border: "2px solid rgba(108, 99, 255, 0.9)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.05s ease",
    pointerEvents: "none",
  },
};

