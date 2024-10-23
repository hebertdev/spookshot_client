//mantine
import { Container, Button } from "@mantine/core";
import Link from "next/link";
export function HeroBanner() {
  return (
    <Container size={"xl"}>
      <main className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Desata el Terror
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-100 max-w-lg">
            Donde tus fotos se convierten en pesadillas vivientes gracias a
            nuestra avanzada inteligencia artificial maldita.
          </p>
          <div className="flex space-x-4">
            <Link href={"/account/login"}>
              <Button radius={"lg"}>Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <div className="relative w-64 h-[500px] mx-auto">
            <div className="absolute inset-0 bg-[#ffa563] rounded-[40px] transform rotate-6"></div>
            <div className="absolute inset-0 bg-[#FF6B00] rounded-[40px]"></div>
            <div className="absolute inset-2 bg-[#1A081E] rounded-[36px] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
