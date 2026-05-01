import SkillsCard from './cards/SkillsCard'
import UOBCard from './cards/UOBCard'
import InsuranceCard from './cards/InsuranceCard'
import ArziCard from './cards/ArziCard'

export default function HoloUI({ activeZone, onExit }) {
  const renderCard = () => {
    switch (activeZone) {
      case 'Skills':
        return <SkillsCard />
      case 'UOB Event Board':
        return <UOBCard />
      case 'AlMutakamelah Insurance':
        return <InsuranceCard />
      case 'Arzi Guest House':
        return <ArziCard />
      default:
        return null
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        animation: 'holoAppear 0.4s ease',
      }}
    >
      <div className="holo-card">
        {renderCard()}
        <button className="exit-btn" onClick={onExit}>
          ◀ Exit Simulation
        </button>
      </div>
    </div>
  )
}
