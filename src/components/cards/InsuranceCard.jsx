export default function InsuranceCard() {
  return (
    <>
      <h1>AlMutakamelah Insurance Services</h1>
      <p>
        A comprehensive digital platform for an insurance brokerage company based in Dubai, UAE.
        Handles customer complaints, contact management, insurance applications, and subscription handling.
      </p>

      <h2>Tech Stack</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Vanilla JS', 'HTML5', 'CSS3'].map((t) => (
          <span key={t} className="tech-label">{t}</span>
        ))}
      </div>

      <a
        className="github-link"
        href="https://github.com/RaydanAridiCS/R-N-WebApp1"
        target="_blank"
        rel="noopener noreferrer"
      >
        ⬡ View on GitHub
      </a>
    </>
  )
}
