export default function ArziCard() {
  return (
    <>
      <h1>Arzi Guest House</h1>
      <p>
        A sleek, responsive landing page designed for a private house and pool rental.
      </p>

      <h2>Tech Stack</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {['HTML', 'CSS', 'JavaScript'].map((t) => (
          <span key={t} className="tech-label">{t}</span>
        ))}
      </div>

      <a
        className="github-link"
        href="https://github.com/nourCS2024/ArziGuestHouse"
        target="_blank"
        rel="noopener noreferrer"
      >
        ⬡ View on GitHub
      </a>
    </>
  )
}
