import { useEffect, useRef, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function IdleModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/assets/idle1.glb')
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0]
      actions[actionName].play()
    }
  }, [actions])

  return (
    <group ref={group} dispose={null}>
      <primitive object={clonedScene} scale={175} position={[0, 0, 0]} />
    </group>
  )
}

export function WalkModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/assets/walking.glb')
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0]
      actions[actionName].play()
    }
  }, [actions])

  return (
    <group ref={group} dispose={null}>
      <primitive object={clonedScene} scale={175} position={[0, 0, 0]} />
    </group>
  )
}
