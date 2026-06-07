import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { PCFShadowMap } from "three";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, useGLTF } from "@react-three/drei";
import Scene from "./components/Scene";
import LoadingScreen from "./components/LoadingScreen";
import HoloUI from "./components/HoloUI";
import ControlsHint from "./components/ControlsHint";
import OnboardingUI from "./components/OnboardingUI";
import VirtualJoystick from "./components/VirtualJoystick";
import MobileInteractButton from "./components/MobileInteractButton";

const keyboardMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
          /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const [movementEnabled, setMovementEnabled] = useState(true);
  const [nearZone, setNearZone] = useState(null);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const cameraRef = useRef();
  const playerRef = useRef();
  const isMobile = useIsMobile();

  const handleZoneEnter = useCallback((zoneName) => {
    setActiveZone(zoneName);
    setMovementEnabled(false);
    // Warm up the hacker room mesh right as camera starts flying down
    useGLTF.preload("/assets/hacker_room_low_poly.glb");
  }, []);

  const handleZoneExit = useCallback(() => {
    setActiveZone(null);
    setMovementEnabled(true);
  }, []);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    // Preload secondary assets after the world is visible
    setTimeout(() => {
      useGLTF.preload("/assets/idle1.glb");
      useGLTF.preload("/assets/walking.glb");
      useGLTF.preload("/assets/lit_welcome_sign_planter_prop.glb");
    }, 1000);
  }, []);

  const handleMobileInteract = useCallback(() => {
    if (nearZone && nearZone !== "Welcome" && !activeZone) {
      handleZoneEnter(nearZone);
    }
  }, [nearZone, activeZone, handleZoneEnter]);

  return (
    <>
      <LoadingScreen loaded={loaded} />

      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows={{ type: PCFShadowMap }}
          camera={{ position: [0, 8, 12], fov: 55, near: 0.1, far: 1000 }}
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
          onCreated={({ camera }) => {
            cameraRef.current = camera;
          }}
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]}>
              <Scene
                onLoaded={handleLoaded}
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

      {activeZone && <HoloUI activeZone={activeZone} onExit={handleZoneExit} />}

      <OnboardingUI
        nearZone={nearZone}
        setNearZone={setNearZone}
        setOnboardingActive={setOnboardingActive}
        isMobile={isMobile}
      />

      {/* Mobile controls — only show when not in a zone */}
      {!activeZone && loaded && (
        <>
          <VirtualJoystick visible={isMobile && !onboardingActive} />
          <MobileInteractButton
            nearZone={nearZone}
            onInteract={handleMobileInteract}
            visible={isMobile && !onboardingActive}
          />
        </>
      )}

      {!activeZone && loaded && !isMobile && (
        <ControlsHint nearZone={nearZone} />
      )}
    </>
  );
}
