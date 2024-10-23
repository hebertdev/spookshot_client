"use client";

import { Container, Button } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroBanner() {
  const images = [
    "https://res.cloudinary.com/spookshot/image/upload/s--SGg_CtJA--/e_gen_background_replace:prompt_an_Dark_alley_with_flickering_lights_and_sinister_smiling_pumpkins./ar_9:16,b_gen_fill,c_pad/q_auto/f_webp/tblbbczj6fxhxmx0vbtf",
    "https://res.cloudinary.com/spookshot/image/upload/s--uUaC3iFX--/ar_9:16,c_pad/q_auto/f_webp/tblbbczj6fxhxmx0vbtf.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <Container size={"xl"}>
      <main className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center h-[calc(100vh-65px)]">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Unleash the Terror
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-100 max-w-lg">
            Where your photos turn into living nightmares thanks to our advanced
            cursed artificial intelligence.
          </p>
          <div className="flex space-x-4">
            <Link href={"/account/login"}>
              <Button radius={"lg"}>Log In</Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <div className="relative w-64 h-[500px] mx-auto">
            <div className="absolute inset-0 bg-[#ffa563] rounded-[40px] transform rotate-6"></div>
            <div className="absolute inset-0 bg-[#FF6B00] rounded-[40px]"></div>
            <div className="absolute inset-2 bg-[#1A081E] rounded-[36px] overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt="Terror image"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              />
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
