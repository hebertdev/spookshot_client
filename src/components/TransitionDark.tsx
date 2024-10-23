"use client";
import { useEffect, useState } from "react";
import { Box, useMantineColorScheme } from "@mantine/core";

export function TransitionDark() {
  const { colorScheme } = useMantineColorScheme();
  const [showComponent, setShowComponent] = useState(false);
  const [opacity, setOpacity] = useState(0.5); // Inicializamos con opacidad 0.5

  useEffect(() => {
    if (colorScheme === "dark") {
      setShowComponent(true);
      setOpacity(1); // Inicia con opacidad 1 cuando aparece

      // Cambiar la opacidad cíclicamente mientras esté visible
      const interval = setInterval(() => {
        setOpacity((prev) => (prev === 0.5 ? 1 : 0.5)); // Alterna entre 0.5 y 1
      }, 200); // Cambia cada 500ms

      // Limpiar el intervalo y ocultar el componente después de 1.5 segundos
      const timer = setTimeout(() => {
        clearInterval(interval); // Detiene el ciclo
        setShowComponent(false); // Oculta el componente
      }, 500); // Muestra el componente por 1.5 segundos

      // Limpieza en caso de desmontaje del componente
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setShowComponent(false); // Oculta el componente cuando no es dark mode
    }
  }, [colorScheme]);

  return showComponent ? (
    <Box
      className="fixed w-full h-[100vh] bg-black z-[1000] transition-opacity duration-100"
      style={{ opacity }} // Usamos el estado de opacidad directamente
    >
      <video
        className="w-full h-full object-cover"
        src="https://res.cloudinary.com/hebertdev1/video/upload/v1728991353/transition_nqijmj.mp4"
        autoPlay
        loop
        muted
      />
    </Box>
  ) : null;
}
