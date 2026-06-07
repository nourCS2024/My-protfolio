import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3, Quaternion, Euler } from "three";
import { IdleModel, WalkModel } from "./CharacterModels";
import { getVirtualKeys } from "./VirtualJoystick";

const SPEED = 4;
const SPAWN_POINT = [8, 5, 8];
const VOID_THRESHOLD = -10;
const _direction = new Vector3();
const _frontV = new Vector3();
const _sideV = new Vector3();
const _targetQuat = new Quaternion();

export default function PlayerController({
  movementEnabled,
  onboardingActive,
  playerRef,
}) {
  const rigidBodyRef = useRef();
  const modelGroupRef = useRef();
  const [isMoving, setIsMoving] = useState(false);
  const [physicsReady, setPhysicsReady] = useState(false);
  const [, getKeys] = useKeyboardControls();

  // Expose rigid body to parent
  useEffect(() => {
    if (playerRef) playerRef.current = rigidBodyRef.current;
  });

  // Wait for the physics world / trimesh colliders to be ready before
  // switching the player from kinematic to dynamic.  Without this the
  // player can start falling before the island collider is generated,
  // causing the "void fall" bug.
  useEffect(() => {
    const delay = setTimeout(() => {
      const rb = rigidBodyRef.current;
      if (rb) {
        rb.setBodyType(0, true); // 0 = Dynamic
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      setPhysicsReady(true);
    }, 1200);
    return () => clearTimeout(delay);
  }, []);

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // ── Void-fall safety net ────────────────────────────────
    // If the player somehow falls below the threshold, teleport them
    // back to the spawn point so they never get stuck in the void.
    const pos = rb.translation();
    if (pos.y < VOID_THRESHOLD) {
      rb.setTranslation(
        { x: SPAWN_POINT[0], y: SPAWN_POINT[1], z: SPAWN_POINT[2] },
        true,
      );
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Don't process movement while physics are still initialising
    if (!physicsReady) return;

    const keyboard = getKeys();
    const virtual = getVirtualKeys();

    // Merge keyboard + virtual joystick
    const forward = keyboard.forward || virtual.forward;
    const backward = keyboard.backward || virtual.backward;
    const left = keyboard.left || virtual.left;
    const right = keyboard.right || virtual.right;

    const moving = movementEnabled && (forward || backward || left || right);
    setIsMoving(moving);

    if (!movementEnabled) {
      const vel = rb.linvel();
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);

      if (onboardingActive && modelGroupRef.current) {
        const camera = state.camera;
        const translation = rb.translation();
        const dx = camera.position.x - translation.x;
        const dz = camera.position.z - translation.z;
        const angle = Math.atan2(dx, dz);
        _targetQuat.setFromEuler(new Euler(0, angle, 0));
        modelGroupRef.current.quaternion.slerp(_targetQuat, 0.08);
      }
      return;
    }

    const camera = state.camera;

    _frontV.set(0, 0, -1).applyQuaternion(camera.quaternion);
    _frontV.y = 0;
    _frontV.normalize();

    _sideV.set(1, 0, 0).applyQuaternion(camera.quaternion);
    _sideV.y = 0;
    _sideV.normalize();

    _direction.set(0, 0, 0);
    if (forward) _direction.add(_frontV);
    if (backward) _direction.sub(_frontV);
    if (right) _direction.add(_sideV);
    if (left) _direction.sub(_sideV);

    if (_direction.lengthSq() > 0) {
      _direction.normalize();

      const vel = rb.linvel();
      rb.setLinvel(
        { x: _direction.x * SPEED, y: vel.y, z: _direction.z * SPEED },
        true,
      );

      if (modelGroupRef.current) {
        const angle = Math.atan2(_direction.x, _direction.z);
        _targetQuat.setFromEuler(new Euler(0, angle, 0));
        modelGroupRef.current.quaternion.slerp(_targetQuat, 0.15);
      }
    } else {
      const vel = rb.linvel();
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={SPAWN_POINT}
      enabledRotations={[false, false, false]}
      mass={1}
      lockRotations
      linearDamping={0.5}
      friction={0}
      restitution={0}
    >
      <CapsuleCollider args={[0.4, 0.4]} position={[0, 0.8, 0]} />
      <group ref={modelGroupRef} position={[0, -0.1, 0]}>
        {isMoving ? <WalkModel /> : <IdleModel />}
      </group>
    </RigidBody>
  );
}
