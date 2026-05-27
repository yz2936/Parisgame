import { OrbitControls, PerspectiveCamera, Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGameStore } from "../game/store";
import MapGrid from "./MapGrid";

function SimulationLoop() {
  const tick = useGameStore((state) => state.tick);

  useFrame((_, delta) => {
    tick(Math.min(delta, 0.12));
  });

  return null;
}

function CameraResetBridge() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    const reset = () => {
      camera.position.set(16, 18, 18);
      controls.current?.target.set(0, 0, 0);
      controls.current?.update();
    };

    window.addEventListener("reset-paris-camera", reset);
    reset();
    return () => window.removeEventListener("reset-paris-camera", reset);
  }, [camera]);

  return (
    <OrbitControls
      ref={controls}
      enablePan
      enableZoom
      minDistance={8}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.25}
      makeDefault
    />
  );
}

export default function GameCanvas() {
  return (
    <Canvas shadows className="game-canvas">
      <PerspectiveCamera makeDefault position={[16, 18, 18]} fov={45} />
      <ambientLight intensity={0.72} />
      <directionalLight
        castShadow
        position={[8, 14, 10]}
        intensity={1.15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Sky sunPosition={[6, 10, 8]} turbidity={5} rayleigh={0.55} />
      <Suspense fallback={null}>
        <MapGrid />
      </Suspense>
      <SimulationLoop />
      <CameraResetBridge />
    </Canvas>
  );
}
