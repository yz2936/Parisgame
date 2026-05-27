export default function BridgeModel() {
  return (
    <group position={[0, 0.12, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.16, 0.7]} />
        <meshStandardMaterial color="#8a603b" roughness={0.65} />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.78]} />
          <meshStandardMaterial color="#5f3b23" />
        </mesh>
      ))}
    </group>
  );
}
