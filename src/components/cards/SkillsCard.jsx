export default function SkillsCard() {
  return (
    <>
      <h1>About Me</h1>
      <p className="greeting">Hi 👋, I'm Nour Abou Ali. A passionate Full-Stack Developer.</p>

      <div className="info-line">🌱 Currently exploring AI automation and n8n.</div>
      <div className="info-line">👯 Open to collaborating on innovative web development projects.</div>
      <div className="info-line">⚡ Fun fact: I play football!</div>
      <div className="info-line">📫 Reach me at: <a href="mailto:nourabouali2017@gmail.com" style={{ marginLeft: 4 }}>nourabouali2017@gmail.com</a></div>

      <h2>Tech Stack</h2>
      <div className="tech-stack">
        <img
          src="https://skillicons.dev/icons?i=js,ts,react,vite,html,css,python,git,androidstudio,mysql,mongodb,nodejs,bootstrap,postman,sqlite"
          alt="Tech stack icons"
          loading="lazy"
        />
      </div>
    </>
  )
}
