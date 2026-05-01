import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Island() {
  const { scene } = useGLTF('/assets/little_game_town.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // Phase 1: The Coordinate Finder Tool
  const handleClick = (e) => {
    e.stopPropagation(); // Stops the click from passing through the floor
    const { x, y, z } = e.point;
    console.log(`Clicked at: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`);
  };

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      onPointerDown={handleClick} // Triggers the console log
    />
  )
}

useGLTF.preload('/assets/little_game_town.glb')