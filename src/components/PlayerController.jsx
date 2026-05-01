import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { Vector3, Quaternion, Euler } from 'three'
import { IdleModel, WalkModel } from './CharacterModels'

const SPEED = 4
const _direction = new Vector3()
const _frontV = new Vector3()
const _sideV = new Vector3()
const _targetQuat = new Quaternion()

export default function PlayerController({ movementEnabled, onboardingActive, playerRef }) {
  const rigidBodyRef = useRef()
  const modelGroupRef = useRef()
  const [isMoving, setIsMoving] = useState(false)
  const [, getKeys] = useKeyboardControls()

  // Expose rigid body to parent
  useEffect(() => {
    if (playerRef) playerRef.current = rigidBodyRef.current
  })

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current
    if (!rb) return

    const { forward, backward, left, right } = getKeys()
    const moving = movementEnabled && (forward || backward || left || right)
    setIsMoving(moving)

    if (!movementEnabled) {
      // Zero out horizontal velocity, keep gravity
      const vel = rb.linvel()
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true)

      // When onboarding dialog is active, rotate character to face the camera
      if (onboardingActive && modelGroupRef.current) {
        const camera = state.camera
        const translation = rb.translation()
        // Direction from player toward camera (projected onto XZ plane)
        const dx = camera.position.x - translation.x
        const dz = camera.position.z - translation.z
        const angle = Math.atan2(dx, dz)
        _targetQuat.setFromEuler(new Euler(0, angle, 0))
        modelGroupRef.current.quaternion.slerp(_targetQuat, 0.08)
      }
      return
    }

    // get camera
    const camera = state.camera

    // Movement direction relative to camera
    _frontV.set(0, 0, -1).applyQuaternion(camera.quaternion)
    _frontV.y = 0
    _frontV.normalize()

    _sideV.set(1, 0, 0).applyQuaternion(camera.quaternion)
    _sideV.y = 0
    _sideV.normalize()

    _direction.set(0, 0, 0)
    if (forward) _direction.add(_frontV)
    if (backward) _direction.sub(_frontV)
    if (right) _direction.add(_sideV)
    if (left) _direction.sub(_sideV)

    if (_direction.lengthSq() > 0) {
      _direction.normalize()

      const vel = rb.linvel()
      rb.setLinvel(
        { x: _direction.x * SPEED, y: vel.y, z: _direction.z * SPEED },
        true
      )

      // Rotate model to face direction
      if (modelGroupRef.current) {
        const angle = Math.atan2(_direction.x, _direction.z)
        _targetQuat.setFromEuler(new Euler(0, angle, 0))
        modelGroupRef.current.quaternion.slerp(_targetQuat, 0.15)
      }
    } else {
      // Stop horizontal movement
      const vel = rb.linvel()
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true)
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[8, 5, 8]}
      enabledRotations={[false, false, false]}
      mass={1}
      lockRotations
      linearDamping={0.5}
      friction={0}
      restitution={0}
    >
      <CapsuleCollider args={[0.4, 0.4]} position={[0, 0.8, 0]} />
      <group ref={modelGroupRef} position={[0, -0.1, 0]}> {/* Tweak this -0.1 up or down until his feet touch the floor! */}
        <IdleModel visible={!isMoving} />
        <WalkModel visible={isMoving} />
      </group>
    </RigidBody>
  )
}
