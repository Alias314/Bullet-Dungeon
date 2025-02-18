
export default function Floor() {    
    return (
        <mesh position={[2, 0, 2]}>
            <boxGeometry args={[15, 1, 15]} />
            <meshStandardMaterial color='white' />
        </mesh>
    );
}