import type { ModelType } from "../../game/types";

interface PathModelProps {
  type: ModelType;
}

export default function PathModel({ type }: PathModelProps) {
  const color =
    type === "garden-path" ? "#8fcf7b" : type === "dirt-path" ? "#8b6238" : "#787878";

  return (
    <mesh position={[0, 0.035, 0]} receiveShadow>
      <boxGeometry args={[0.82, 0.04, 0.82]} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}
