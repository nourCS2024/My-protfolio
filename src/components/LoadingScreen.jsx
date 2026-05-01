export default function LoadingScreen({ loaded }) {
  return (
    <div className={`loading-screen ${loaded ? 'hidden' : ''}`}>
      <div className="loading-spinner" />
      <h2>Loading Portfolio World…</h2>
    </div>
  )
}
