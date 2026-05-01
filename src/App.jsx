import { Suspense, useState, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'
import Scene from './components/Scene'
import LoadingScreen from './components/LoadingScreen'
import HoloUI from './components/HoloUI'
import ControlsHint from './components/ControlsHint'
import OnboardingUI from './components/OnboardingUI'

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [activeZone, setActiveZone] = useState(null)
  const [movementEnabled, setMovementEnabled] = useState(true)
  const [nearZone, setNearZone] = useState(null)
  const [onboardingActive, setOnboardingActive] = useState(false)
  const cameraRef = useRef()
  const playerRef = useRef()

  const handleZoneEnter = useCallback((zoneName) => {
    setActiveZone(zoneName)
    setMovementEnabled(false)
  }, [])

  const handleZoneExit = useCallback(() => {
    setActiveZone(null)
    setMovementEnabled(true)
  }, [])

  return (
    <>
      <LoadingScreen loaded={loaded} />

      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 8, 12], fov: 55, near: 0.1, far: 1000 }}
          style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
          onCreated={({ camera }) => { cameraRef.current = camera }}
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]}>
              <Scene
                onLoaded={() => setLoaded(true)}
                activeZone={activeZone}
                onZoneEnter={handleZoneEnter}
                onZoneExit={handleZoneExit}
                movementEnabled={movementEnabled && !onboardingActive}
                onboardingActive={onboardingActive}
                cameraRef={cameraRef}
                playerRef={playerRef}
                nearZone={nearZone}
                setNearZone={setNearZone}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {activeZone && (
        <HoloUI activeZone={activeZone} onExit={handleZoneExit} />
      )}

      <OnboardingUI nearZone={nearZone} setNearZone={setNearZone} setOnboardingActive={setOnboardingActive} />

      {!activeZone && loaded && <ControlsHint nearZone={nearZone} />}
    </>
  )
}
