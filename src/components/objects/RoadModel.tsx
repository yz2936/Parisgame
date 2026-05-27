export default function RoadModel() {
  return (
    <group position={[0, 0.055, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[0.96, 0.05, 0.96]} />
        <meshStandardMaterial color="#5f6065" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.015, 0.86]} />
        <meshStandardMaterial color="#e7d79f" />
      </mesh>
      {[-0.33, 0.33].map((x) => (
        <group key={x} position={[x, 0.04, 0.28]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.045, 0.16, 8]} />
            <meshStandardMaterial color="#6b4a2c" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color="#3c8d52" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
