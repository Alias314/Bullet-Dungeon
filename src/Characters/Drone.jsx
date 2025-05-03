import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Drone() {
    
    
    return (
        <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={'white'} />
        </mesh>
    );
}