export default function ControlsHint({ nearZone }) {
  return (
    <div className="controls-hint">
      <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
      <span>to move</span>
      {nearZone && (
        <>
          <span style={{ margin: '0 4px', opacity: 0.4 }}>|</span>
          <kbd>Enter</kbd>
          <span>to interact with <strong>{nearZone}</strong></span>
        </>
      )}
    </div>
  )
}
