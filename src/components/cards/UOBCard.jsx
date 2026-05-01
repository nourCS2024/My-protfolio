export default function UOBCard() {
  return (
    <>
      <h1>UOB Campus Event Board</h1>
      <p>A modern, full-stack campus event management platform for the University of Balamand.</p>

      <h2>Tech Stack</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {['TypeScript', 'React', 'NestJS', 'PostgreSQL', 'Tailwind CSS'].map((t) => (
          <span key={t} className="tech-label">{t}</span>
        ))}
      </div>

      <h2>Features</h2>
      <ul className="features-list">
        <li>Multi-method Authentication (Google OAuth 2.0, AI Face Recognition, Role-based Access)</li>
        <li>Event Management & Registration (RSVP, CSV export)</li>
        <li>Club Management</li>
        <li>Support System</li>
        <li>Automated SMTP Notifications</li>
      </ul>

      <a
        className="github-link"
        href="https://github.com/nourCS2024/Event-Calendar"
        target="_blank"
        rel="noopener noreferrer"
      >
        ⬡ View on GitHub
      </a>
    </>
  )
}
