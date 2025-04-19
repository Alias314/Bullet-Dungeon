import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function GSAP_Practice() {
  const boxRef = useRef();

  const handleClick = () => {
    gsap.from(boxRef.current, {
      y: 500,
      opacity: 0,
      duration: 0.2,
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-10 items-center justify-center">
      <div
        ref={boxRef}
        className="background-transition w-full h-full absolute inset-0 bg-black opacity-90 pointer-events-none"
      ></div>

      <button onClick={handleClick} className="p-4 bg-blue-500 text-white z-10">
        Click Me!
      </button>
    </div>
  );
}
