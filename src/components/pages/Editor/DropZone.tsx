import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Text,
  Group,
  Button,
  rem,
  useMantineTheme,
  Center,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconX,
  IconDownload,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import classes from "./DropZone.module.css";
import { uploadFileAPI } from "services/files";
import { showNotification } from "components/Notifications";

export function DropzoneButton() {
  const router = useRouter();
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDrop = (acceptedFiles: File[]) => {
    // Solo seleccionamos el primer archivo por simplicidad
    const file = acceptedFiles[0];
    setFiles(acceptedFiles);
    if (file) {
      // Generar un preview de la imagen
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    }
  };

  const handleRemoveImage = () => {
    setFiles([]);
    setImagePreview(null);
  };

  const handleUploadImage = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const data = await uploadFileAPI(files[0]);
      showNotification({
        title: "Success",
        message: "Upload success",
        color: "green",
      });
      router.push(`/editor/${data.id}`);
    } catch (e) {
      setLoading(false);
      showNotification({
        title: "Error",
        message: "No se pudo subir la imagen.",
        color: "red",
      });
    }
  };

  return (
    <div className="relative min-h-[95%] max-h-[95%] overflow-hidden flex items-center justify-center min-w-[95%]  max-w-[95%] w-[100%] h-[100%]">
      {!imagePreview ? (
        <div>
          <Dropzone
            openRef={openRef}
            onDrop={handleDrop} // Cambié onDrop para manejar los archivos
            className="border-2 border-dashed border-gray-300 dark:border-[var(--mantine-color-dark-4)] mb-[10px] rounded-lg"
            radius="md"
            accept={[
              MIME_TYPES.jpeg,
              MIME_TYPES.png,
              MIME_TYPES.webp,
              MIME_TYPES.avif,
            ]}
            maxSize={30 * 1024 ** 2}
            maxFiles={1}
          >
            <div style={{ pointerEvents: "none", padding: "10px" }}>
              <Group justify="center">
                <Dropzone.Accept>
                  <IconDownload
                    style={{ width: rem(50), height: rem(50) }}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{ width: rem(50), height: rem(50) }}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload
                    style={{ width: rem(50), height: rem(50) }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>
              </Group>

              <Text ta="center" fw={700} fz="lg" mt="xl">
                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                <Dropzone.Idle>Upload resume</Dropzone.Idle>
              </Text>
              <Text ta="center" fz="sm" mt="xs" c="dimmed" p={10}>
                Arrastra y suelta archivos aquí para subir. Solo aceptamos
                imagenes de <i>.jpg</i>, <i>.png</i> y <i>.webp</i> que sean
                menores de 30mb.
              </Text>
            </div>
          </Dropzone>
          <Center>
            <Button
              className={classes.control}
              size="md"
              radius="xl"
              onClick={() => openRef.current?.()}
              mt={"10px"}
            >
              Elige una imagen
            </Button>
          </Center>
        </div>
      ) : (
        <>
          <img
            src={imagePreview}
            alt="Image Preview"
            style={{
              height: "auto",
              width: "auto",
              maxWidth: "80%",
              maxHeight: "90%",
              minHeight: "300px",
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: "10px 10px",
              backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
            }}
          />
          <div className="flex gap-[5px] items-center pt-[10px] w-full absolute bottom-0 left-0 right-0 justify-end">
            <Button
              size="xs"
              leftSection={<IconUpload />}
              onClick={handleUploadImage}
              loading={loading}
            >
              Upload
            </Button>
            <Button
              size="xs"
              bg={"red"}
              leftSection={<IconTrash />}
              onClick={handleRemoveImage}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
