export default function ParkModel() {
  return (
    <group position={[0, 0.08, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[0.86, 0.08, 0.86]} />
        <meshStandardMaterial color="#68b96d" roughness={0.8} />
      </mesh>
      {[
        [-0.24, -0.18],
        [0.22, 0.2],
        [0.04, -0.32],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0.1, z]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.035, 0.18, 8]} />
            <meshStandardMaterial color="#6b4a2c" />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#2f8f4e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
