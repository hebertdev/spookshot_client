import Link from "next/link";
import { Box, Card, Image, ActionIcon } from "@mantine/core";
import {
  IconPhoto,
  IconDownload,
  IconStar,
  IconTrash,
  IconMaximize,
  IconEdit,
} from "@tabler/icons-react";
import { FileData } from "interfaces/files";

interface FileCardProps {
  file: FileData;
}

// Función para descargar la imagen
const downloadImage = async (imageUrl: string, event: React.MouseEvent) => {
  event.preventDefault();
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = ""; // Proporciona un nombre de archivo si es necesario
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function FileCard({ file }: FileCardProps) {
  return (
    <Card
      radius={"md"}
      className="mb-4 break-inside-avoid p-0 overflow-hidden relative group"
      withBorder
    >
      {/* Contenedor de la imagen que desencadena el hover */}
      <Box className="relative">
        <Box className="absolute top-0 left-0 p-1 w-full">
          <Box className="p-[3px] bg-[rgba(0,0,0,0.4)] w-[24px] h-[24px] rounded-[3px] flex justify-center items-center">
            <IconPhoto color="white" />
          </Box>
        </Box>
        <Image
          src={file.url}
          width={file.json_field.width}
          height={file.json_field.height}
          className="w-full h-auto min-h-[150px] group-hover"
        />

        {/* El contenedor con los iconos se mostrará solo al hacer hover sobre la imagen */}
        <Box className="absolute top-0 left-0 w-[100%] h-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Box
            className="absolute w-[30px] right-0 top-0 p-[3px]"
            component={Link}
            href={`/editor/${file.id}`}
          >
            <ActionIcon size={"sm"} className="bg-[rgba(0,0,0,0.4)]">
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              size={"sm"}
              className="bg-[rgba(0,0,0,0.4)]"
              onClick={(event) => downloadImage(file.url, event)} // Pasar el evento
            >
              <IconDownload />
            </ActionIcon>

            <ActionIcon size={"sm"} className="bg-[rgba(0,0,0,0.4)]">
              <IconStar />
            </ActionIcon>
            <ActionIcon size={"sm"} className="bg-[rgba(0,0,0,0.4)]">
              <IconTrash />
            </ActionIcon>
          </Box>
          <Box className="absolute w-[30px] right-0 bottom-0 p-[3px]">
            <ActionIcon size={"sm"} className="bg-[rgba(0,0,0,0.4)]">
              <IconMaximize />
            </ActionIcon>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
