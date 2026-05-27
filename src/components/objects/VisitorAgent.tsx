import { Html } from "@react-three/drei";
import { visitorProfileByType } from "../../data/visitors";
import { useGameStore } from "../../game/store";
import type { Visitor } from "../../game/types";

interface VisitorAgentProps {
  visitor: Visitor;
}

export default function VisitorAgent({ visitor }: VisitorAgentProps) {
  const selectVisitor = useGameStore((state) => state.selectVisitor);
  const selectedVisitorId = useGameStore((state) => state.selectedVisitorId);
  const profile = visitorProfileByType[visitor.type];
  const selected = selectedVisitorId === visitor.id;

  return (
    <group
      position={[visitor.visualPosition.x, 0.24, visitor.visualPosition.z]}
      onClick={(event) => {
        event.stopPropagation();
        selectVisitor(visitor.id);
      }}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
        <meshStandardMaterial color={profile.color} emissive={selected ? "#ffffff" : "#000000"} emissiveIntensity={selected ? 0.2 : 0} />
      </mesh>
      {visitor.status === "lost" && (
        <Html center position={[0, 0.38, 0]} className="visitor-status">
          ?
        </Html>
      )}
    </group>
  );
}
