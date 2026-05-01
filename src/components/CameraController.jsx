import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import gsap from 'gsap'

const _playerPos = new Vector3()
const _cameraTarget = new Vector3()
const _lookTarget = new Vector3()

// Camera offsets for third person
const CAMERA_OFFSET = new Vector3(0, 8, 14)
const CAMERA_LERP = 0.05

// Hacker room camera positions
const ROOM_CAM_POS = new Vector3(5, -96, 8)
const ROOM_LOOK_AT = new Vector3(0, -99, 0)

export default function CameraController({ playerRef, activeZone, onZoneExit, cameraRef }) {
  const { camera } = useThree()
  const isAnimating = useRef(false)
  const following = useRef(true)
  const savedPlayerPos = useRef(new Vector3())

  // When activeZone changes, animate camera
  useEffect(() => {
    if (activeZone && !isAnimating.current) {
      isAnimating.current = true
      following.current = false

      // Save player position for return trip
      const rb = playerRef?.current
      if (rb) {
        const t = rb.translation()
        savedPlayerPos.current.set(t.x, t.y, t.z)
      }

      // Animate to hacker room
      gsap.to(camera.position, {
        x: ROOM_CAM_POS.x,
        y: ROOM_CAM_POS.y,
        z: ROOM_CAM_POS.z,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(
            ROOM_LOOK_AT.x,
            ROOM_LOOK_AT.y + (camera.position.y - ROOM_CAM_POS.y) * 0.1,
            ROOM_LOOK_AT.z
          )
        },
        onComplete: () => {
          camera.lookAt(ROOM_LOOK_AT.x, ROOM_LOOK_AT.y, ROOM_LOOK_AT.z)
          isAnimating.current = false
        }
      })
    }

    if (!activeZone && isAnimating.current === false && !following.current) {
      // Return animation
      isAnimating.current = true
      const returnPos = savedPlayerPos.current.clone().add(CAMERA_OFFSET)

      gsap.to(camera.position, {
        x: returnPos.x,
        y: returnPos.y,
        z: returnPos.z,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(
            savedPlayerPos.current.x,
            savedPlayerPos.current.y + 1,
            savedPlayerPos.current.z
          )
        },
        onComplete: () => {
          isAnimating.current = false
          following.current = true
        }
      })
    }
  }, [activeZone, camera, playerRef])

  // Follow player in third-person
  useFrame(() => {
    if (!following.current || isAnimating.current) return

    const rb = playerRef?.current
    if (!rb) return

    const translation = rb.translation()
    _playerPos.set(translation.x, translation.y, translation.z)

    // Desired camera position
    _cameraTarget.copy(_playerPos).add(CAMERA_OFFSET)

    // Smooth follow
    camera.position.lerp(_cameraTarget, CAMERA_LERP)

    // Look at player
    _lookTarget.set(_playerPos.x, _playerPos.y + 1.2, _playerPos.z)
    camera.lookAt(_lookTarget)
  })

  return null
}
