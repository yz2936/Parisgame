import { Text } from "@react-three/drei";
import type { ModelType } from "../../game/types";

interface LandmarkModelProps {
  type: ModelType;
  label: string;
}

function Label({ label, y = 1.15 }: { label: string; y?: number }) {
  return (
    <Text
      position={[0, y, 0]}
      rotation={[-Math.PI / 3, 0, 0]}
      fontSize={0.17}
      color="#2b1b10"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.012}
      outlineColor="#fff8e8"
    >
      {label}
    </Text>
  );
}

export default function LandmarkModel({ type, label }: LandmarkModelProps) {
  if (type === "notre-dame") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.24, 0]}>
          <boxGeometry args={[0.62, 0.42, 0.72]} />
          <meshStandardMaterial color="#d8c5a4" />
        </mesh>
        {[-0.21, 0.21].map((x) => (
          <mesh key={x} castShadow position={[x, 0.58, -0.22]}>
            <boxGeometry args={[0.18, 0.54, 0.18]} />
            <meshStandardMaterial color="#b7a489" />
          </mesh>
        ))}
        <mesh position={[0, 0.7, 0.18]}>
          <coneGeometry args={[0.14, 0.28, 4]} />
          <meshStandardMaterial color="#6a7a82" />
        </mesh>
        <Label label="Notre-Dame" y={1.25} />
      </group>
    );
  }

  if (type === "eiffel") {
    return (
      <group position={[0, 0.05, 0]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <coneGeometry args={[0.34, 1.25, 4]} />
          <meshStandardMaterial color="#7b624b" wireframe />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[0.42, 0.08, 0.42]} />
          <meshStandardMaterial color="#7b624b" />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.68, 0.07, 0.68]} />
          <meshStandardMaterial color="#7b624b" />
        </mesh>
        <Label label="Eiffel Tower" y={1.55} />
      </group>
    );
  }

  if (type === "market") {
    return (
      <group position={[0, 0.09, 0]}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[0.72, 0.22, 0.55]} />
          <meshStandardMaterial color="#c77a46" />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <coneGeometry args={[0.48, 0.28, 4]} />
          <meshStandardMaterial color="#efb34c" />
        </mesh>
        <Label label={label} />
      </group>
    );
  }

  if (type === "university") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.72, 0.36, 0.54]} />
          <meshStandardMaterial color="#b99772" />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.82, 0.08, 0.62]} />
          <meshStandardMaterial color="#8e5941" />
        </mesh>
        <Label label={label} />
      </group>
    );
  }

  if (type === "chapel") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.48, 0.34, 0.58]} />
          <meshStandardMaterial color="#d9c6a5" />
        </mesh>
        <mesh position={[0, 0.48, -0.12]}>
          <coneGeometry args={[0.22, 0.34, 4]} />
          <meshStandardMaterial color="#6f7f8b" />
        </mesh>
        <Label label={label} />
      </group>
    );
  }

  if (type === "fountain") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.32, 0.14, 24]} />
          <meshStandardMaterial color="#c9d3d8" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.025, 24]} />
          <meshStandardMaterial color="#55a8dc" />
        </mesh>
      </group>
    );
  }

  if (type === "metro") {
    return (
      <group position={[0, 0.11, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.18, 0.36]} />
          <meshStandardMaterial color="#3e8b71" />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <torusGeometry args={[0.22, 0.025, 8, 18, Math.PI]} />
          <meshStandardMaterial color="#f1d170" />
        </mesh>
        <Label label="Metro" y={0.8} />
      </group>
    );
  }

  if (type === "exhibition") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[0.78, 0.42, 0.62]} />
          <meshStandardMaterial color="#e7d5b8" />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.3, 16, 8]} />
          <meshStandardMaterial color="#8bbbd8" transparent opacity={0.8} />
        </mesh>
        <Label label={label} y={1.18} />
      </group>
    );
  }

  if (type === "cafe") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[0.54, 0.3, 0.46]} />
          <meshStandardMaterial color="#df8c6a" />
        </mesh>
        <mesh position={[0.25, 0.08, 0.28]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#f2d29b" />
        </mesh>
        <Label label={label} y={0.92} />
      </group>
    );
  }

  if (type === "well") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.24, 0.22, 18]} />
          <meshStandardMaterial color="#9f9080" />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <torusGeometry args={[0.2, 0.025, 8, 18]} />
          <meshStandardMaterial color="#6e6258" />
        </mesh>
      </group>
    );
  }

  if (type === "kiosk") {
    return (
      <group position={[0, 0.08, 0]}>
        <mesh castShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.34, 6]} />
          <meshStandardMaterial color="#356e8a" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.3, 0.18, 6]} />
          <meshStandardMaterial color="#e4bd56" />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0.08, 0]}>
      <mesh castShadow position={[0, 0.24, 0]}>
        <boxGeometry args={[0.62, 0.42, 0.58]} />
        <meshStandardMaterial color={type === "sanitation" ? "#a6c2c7" : "#cfa57f"} />
      </mesh>
      <Label label={label} />
    </group>
  );
}
