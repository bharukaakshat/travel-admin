"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 700);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden flex items-center justify-center
      bg-gradient-to-br from-blue-600 to-blue-500
      transition-opacity duration-700 z-[9999]
      ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {/* Background Glow Circles */}
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute w-72 h-72 bg-white opacity-10 rounded-full blur-2xl right-10 bottom-10"></div>

      <div className="relative text-center text-white px-6">

        {/* Airplane Image */}
        <div className="mb-8 flex justify-center animate-float">
          <Image
            src="/plane.png"
            alt="Plane"
            width={220}
            height={220}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Elevate Your Travel
        </h1>

        <p className="text-white/80 mb-8 text-sm md:text-base">
          Manage bookings and drivers effortlessly
        </p>

        {/* Circular Button */}
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 animate-pulse">
            <span className="text-xl">→</span>
          </div>
        </div>

      </div>
    </div>
  );
}
