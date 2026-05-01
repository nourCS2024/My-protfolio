import { useState, useEffect } from 'react'

/* ── Main OnboardingUI Component ─────────────────────────── */
export default function OnboardingUI({ nearZone, setNearZone, setOnboardingActive }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && nearZone === 'Welcome' && step === 0) {
        setStep(1)
        setOnboardingActive(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nearZone, step, setOnboardingActive])

  if (step === 0) return null

  return (
    <div style={styles.overlay}>
      {/* ── Blur backdrop with cutout for the 3D character ── */}
      <div style={styles.blurBackdrop} />

      <div style={styles.dialogContainer}>

        {/* ── Avatar Portrait ── */}
        <div style={styles.portrait}>
          <img
            src="/assets/avatar.jpg"
            alt="Nour Abou Ali"
            style={styles.avatarImg}
          />
          <div style={styles.portraitNameTag}>NOUR</div>
        </div>

        {/* ── Speech Bubble ── */}
        <div style={styles.speechBubble}>
          {/* Decorative corner accents */}
          <div style={{ ...styles.corner, top: 6, left: 6 }} />
          <div style={{ ...styles.corner, top: 6, right: 6, transform: 'scaleX(-1)' }} />
          <div style={{ ...styles.corner, bottom: 6, left: 6, transform: 'scaleY(-1)' }} />
          <div style={{ ...styles.corner, bottom: 6, right: 6, transform: 'scale(-1)' }} />

          {step === 1 && (
            <>
              <h2 style={styles.speakerName}>Nour Abou Ali</h2>
              <p style={styles.dialogText}>
                Hello! Welcome to my Career World! This 3D portfolio is an
                interactive space for my Software Development Career.
              </p>
              <div style={styles.buttonRow}>
                <button
                  style={styles.continueBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 220, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#00f0ff'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 220, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 220, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#00dce8'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => setStep(2)}
                >
                  Continue ➔
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={styles.speakerName}>Nour Abou Ali</h2>
              <p style={styles.dialogText}>
                Here is your map: Head{' '}
                <strong style={{ color: '#6c63ff' }}>North-West</strong> for my
                Skills,{' '}
                <strong style={{ color: '#00d68f' }}>North-East</strong> for
                Events, or{' '}
                <strong style={{ color: '#ff6b6b' }}>South</strong> for
                Insurance. Press Start to explore!
              </p>
              <div style={styles.buttonRow}>
                <button
                  style={{ ...styles.continueBtn, borderColor: '#00d68f' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 214, 143, 0.2)'
                    e.currentTarget.style.borderColor = '#33e8aa'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 214, 143, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 220, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#00d68f'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => {
                    setStep(0)
                    setNearZone(null)
                    setOnboardingActive(false)
                  }}
                >
                  🚀 Start Exploring
                </button>
              </div>
            </>
          )}

          {/* Blinking indicator */}
          <div style={styles.blinker}>▼</div>
        </div>
      </div>
    </div>
  )
}

/* ── Inline Styles ────────────────────────────────────────── */

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '50px',
    paddingLeft: '24px',
    paddingRight: '24px',
    zIndex: 1000,
    pointerEvents: 'none',
    animation: 'onb-fadeIn 0.35s ease',
  },

  blurBackdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    WebkitMaskImage: 'radial-gradient(ellipse 180px 280px at 50% 42%, transparent 70%, black 100%)',
    maskImage: 'radial-gradient(ellipse 180px 280px at 50% 42%, transparent 70%, black 100%)',
    pointerEvents: 'none',
  },

  dialogContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
    width: '100%',
    maxWidth: '920px',
    pointerEvents: 'auto',
    animation: 'onb-slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
  },

  /* ── Portrait ── */
  portrait: {
    width: '180px',
    height: '220px',
    flexShrink: 0,
    borderRadius: '14px',
    background: '#1a1a24',
    border: '2px solid #00dce8',
    boxShadow: '0 0 24px rgba(0, 220, 232, 0.25), inset 0 0 20px rgba(0, 220, 232, 0.05)',
    overflow: 'hidden',
    position: 'relative',
  },

  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  portraitNameTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#00dce8',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '4px 0',
    borderTop: '1px solid rgba(0, 220, 232, 0.3)',
  },

  /* ── Speech Bubble ── */
  speechBubble: {
    flex: 1,
    position: 'relative',
    background: 'rgba(20, 20, 25, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '2px solid rgba(0, 220, 232, 0.35)',
    borderRadius: '16px',
    padding: '26px 30px 22px',
    boxShadow: '0 4px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 220, 232, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
    minHeight: '150px',
  },

  corner: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    borderTop: '2px solid rgba(0, 220, 232, 0.6)',
    borderLeft: '2px solid rgba(0, 220, 232, 0.6)',
  },

  speakerName: {
    fontSize: '19px',
    fontWeight: 700,
    margin: '0 0 12px',
    color: '#00dce8',
    letterSpacing: '0.03em',
    textShadow: '0 0 14px rgba(0, 220, 232, 0.4)',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },

  dialogText: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.88)',
    margin: '0 0 20px',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },

  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  continueBtn: {
    padding: '10px 30px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    background: 'rgba(0, 220, 255, 0.08)',
    border: '1.5px solid #00dce8',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },

  blinker: {
    position: 'absolute',
    bottom: '10px',
    right: '18px',
    fontSize: '12px',
    color: 'rgba(0, 220, 232, 0.5)',
    animation: 'onb-blink 1.2s ease-in-out infinite',
  },
}

/* ── Inject Keyframes (once) ─────────────────────────────── */
if (typeof document !== 'undefined') {
  const id = 'onboarding-rpg-keyframes'
  if (!document.getElementById(id)) {
    const sheet = document.createElement('style')
    sheet.id = id
    sheet.textContent = `
      @keyframes onb-fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes onb-slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes onb-blink {
        0%, 100% { opacity: 0.25; }
        50%      { opacity: 1; }
      }
    `
    document.head.appendChild(sheet)
  }
}
