import { useEffect, useRef, useCallback } from 'react'
import { RigidBody, MeshCollider } from '@react-three/rapier'
import Island from './Island'
import HackerRoom from './HackerRoom'
import PlayerController from './PlayerController'
import InteractionZones from './InteractionZones'
import CameraController from './CameraController'

export default function Scene({
  onLoaded,
  activeZone,
  onZoneEnter,
  onZoneExit,
  movementEnabled,
  onboardingActive,
  cameraRef,
  playerRef,
  nearZone,
  setNearZone,
}) {
  // Signal loaded after first render
  useEffect(() => {
    const timer = setTimeout(() => onLoaded(), 500)
    return () => clearTimeout(timer)
  }, [onLoaded])

  // Listen for Enter key to activate zone
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Enter' && nearZone && nearZone !== 'Welcome' && !activeZone) {
        onZoneEnter(nearZone)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nearZone, activeZone, onZoneEnter])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
      />
      <hemisphereLight
        args={['#87ceeb', '#362d59', 0.4]}
      />

      {/* Fog */}
      <fog attach="fog" args={['#1a1a2e', 30, 80]} />

      {/* Sky color */}
      <color attach="background" args={['#1a1a2e']} />

      {/* Island with trimesh collider */}
      {/* Island with trimesh collider */}
      <RigidBody type="fixed" colliders="trimesh" friction={0}>
        <Island />
      </RigidBody>
      {/* Hacker Room (far below) */}
      <HackerRoom />

      {/* Player */}
      <PlayerController
        movementEnabled={movementEnabled}
        onboardingActive={onboardingActive}
        playerRef={playerRef}
      />

      {/* Teleport pads / interaction zones */}
      <InteractionZones
        playerRef={playerRef}
        onZoneEnter={onZoneEnter}
        nearZone={nearZone}
        setNearZone={setNearZone}
      />

      {/* Camera follow logic */}
      <CameraController
        playerRef={playerRef}
        activeZone={activeZone}
        onZoneExit={onZoneExit}
        cameraRef={cameraRef}
      />
    </>
  )
}
