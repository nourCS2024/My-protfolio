import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export default function HackerRoom() {
  const { scene } = useGLTF('/assets/hacker_room_low_poly.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group position={[0, -100, 0]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 2]} intensity={1.5} color="#6c63ff" />
      <pointLight position={[-2, 2, -1]} intensity={0.8} color="#00d68f" />
      <primitive object={scene} scale={2.5} />
    </group>
  )
}

useGLTF.preload('/assets/hacker_room_low_poly.glb')
