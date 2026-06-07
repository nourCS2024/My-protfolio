import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Billboard, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

const INTERACTION_ZONES = [
  { name: 'Skills', position: [-16.3, -0.30, -65.34], color: '#6c63ff' },
  { name: 'UOB Event Board', position: [16.3, -0.30, -75.34], color: '#00d68f' },
  { name: 'AlMutakamelah Insurance', position: [-16.3, -0.30, 64.75], color: '#ff6b6b' },
  { name: 'Arzi Guest House', position: [16.3, -0.30, 65.00], color: '#ffc107' },
  { name: 'Welcome', position: [12.36, 0.00, -13.53], color: '#ffffff' },
]

const INTERACTION_RADIUS = 3.5
const BUILDING_HEIGHT = 9

function CityMarker({ name, position, color, isNear }) {
  const roofY = position[1] + BUILDING_HEIGHT + 2.0;

  // Dynamically calculate the width of the sign based on the text length
  const signWidth = Math.max(name.length * 0.25, 2.0);

  // === WALL ALIGNMENT LOGIC ===
  const isRightSide = position[0] > 0;

  // If the building is on the right (+16.3), the door faces Left (-X). We rotate the sign -90 degrees.
  // If the building is on the left (-16.3), the door faces Right (+X). We rotate the sign +90 degrees.
  const signRotationY = isRightSide ? -Math.PI / 2 : Math.PI / 2;

  // We push the sign just slightly out from the brick wall so it doesn't clip
  const wallOffset = isRightSide ? -0.15 : 0.15;

  return (
    <group position={[position[0], 0, position[2]]}>

      {/* === 1. THE ROOF BEACON (Skyline hologram) === */}
      <group position={[0, roofY, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.08, 16, 100]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        </Float>
        <Text position={[0, 1.2, 0]} fontSize={1.6} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.06} outlineColor={color}>
          {name}
        </Text>
      </group>


      {/* === 2. THE CHUNKY 3D STOREFRONT SIGN (Y = 3.65) === */}
      {/* We apply the fixed rotation here so it rests perfectly flat against the wall */}
      <group position={[wallOffset, 3.65, 0]} rotation={[0, signRotationY, 0]}>

        {/* The thick, low-poly physical sign board */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[signWidth, 1.0, 0.2]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.9} /> {/* Matches the white trim on the buildings */}
        </mesh>

        {/* Dark Text printed directly onto the board */}
        <Text position={[0, 0.15, 0.01]} fontSize={0.35} color="#2b2b36" anchorX="center" anchorY="middle" fontWeight="bold">
          {name}
        </Text>

        {/* The Prompt only appears floating under the sign when close */}
        {isNear && (
          <Text position={[0, -0.3, 0.05]} fontSize={0.22} color={color} outlineWidth={0.01} outlineColor="#000000">
            [ Press ENTER ]
          </Text>
        )}

      </group>

    </group>
  )
}

function WelcomeMarker({ position, isNear }) {
  const { scene } = useGLTF('/assets/lit_welcome_sign_planter_prop.glb')
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* The 3D stone sign model */}
      <primitive object={clonedScene} scale={2.0} rotation={[Math.PI / 2, 0, 0]} />



      {/* Press ENTER prompt — only when near */}
      {isNear && (
        <Billboard position={[0, 0.6, 0.5]}>
          <Float speed={3} floatIntensity={0.2}>
            <Text
              fontSize={0.25}
              color="#aaeeff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.012}
              outlineColor="#000000"
            >
              [ Press ENTER ]
            </Text>
          </Float>
        </Billboard>
      )}
    </group>
  )
}

export default function InteractionZones({ playerRef, nearZone, setNearZone }) {
  const _playerPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const rb = playerRef?.current
    if (!rb) return

    const translation = rb.translation()
    _playerPos.set(translation.x, translation.y, translation.z)

    let closest = null
    let closestDist = Infinity

    for (const zone of INTERACTION_ZONES) {
      const dx = _playerPos.x - zone.position[0]
      const dz = _playerPos.z - zone.position[2]
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < INTERACTION_RADIUS && dist < closestDist) {
        closest = zone.name
        closestDist = dist
      }
    }

    if (closest !== nearZone) {
      setNearZone(closest)
    }
  })

  return (
    <group>
      {INTERACTION_ZONES.map((zone) => {
        if (zone.name === 'Welcome') {
          return (
            <WelcomeMarker
              key={zone.name}
              position={zone.position}
              isNear={nearZone === zone.name}
            />
          )
        }
        return (
          <CityMarker
            key={zone.name}
            name={zone.name}
            position={zone.position}
            color={zone.color}
            isNear={nearZone === zone.name}
          />
        )
      })}
    </group>
  )
}


export { INTERACTION_ZONES }