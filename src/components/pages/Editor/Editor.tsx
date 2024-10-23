"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Center,
  rem,
  SegmentedControl,
  Text,
} from "@mantine/core";
import {
  IconBoxPadding,
  IconSparkles,
  IconCaretLeftRight,
  IconDownload,
  IconHistory,
  IconDeviceFloppy,
  IconPhoto,
} from "@tabler/icons-react";

import { DropzoneButton } from "./DropZone";
import { FileData } from "interfaces/files";
import { getFileAPI } from "services/files";
import ResizeCropTool from "./ResizeCropTool";
import { FilterTool } from "./FilterTool";
import { showNotification } from "components/Notifications";
import { ButtonSaveTransformation } from "./ButtonSaveTransformation";

interface EditorProps {
  fileId?: number | string;
}

type NewFileData = {
  url: string;
  height: number;
  width: number;
};

export function Editor({ fileId }: EditorProps) {
  const [file, setFile] = useState<null | FileData>(null);
  const [newFile, setNewFile] = useState<NewFileData | null>(null);
  const [disabledAccordion, setDisableAccordion] = useState(true);
  const [compare, setCompare] = useState(false);
  const [segment, setSegment] = useState("saved");
  const [trasnformations, setTransformations] = useState<any[]>([]);
  const [resizeCropParams, setResizeCropParams] = useState<any[]>([]);
  const [effectParams, setEffectParams] = useState<any[]>([]);
  const [otherParams, setOtherParams] = useState<any[]>([]);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    import("two-up-element").catch((err) => {
      console.error("Error al cargar two-up-element:", err);
    });
  }, []);

  useEffect(() => {
    handleGetFile();
  }, [fileId]);

  const handleGetFile = async () => {
    if (!fileId) return;
    try {
      const data = await getFileAPI(fileId);
      setFile(data);
      setDisableAccordion(false);
    } catch (e) {
      console.log(e);
      setDisableAccordion(true);
    }
  };

  const handleNewFile = (data: NewFileData) => {
    setNewFile(data);
  };

  const handleSetFile = (data: FileData) => {
    setFile(data);
  };

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

  const handleSetTransformations = () => {
    console.log([...resizeCropParams, ...effectParams, ...otherParams]);
    setTransformations([...resizeCropParams, ...effectParams, ...otherParams]);
  };

  useEffect(() => {
    handleSetTransformations();
  }, [resizeCropParams, effectParams, otherParams]);

  const aspectRatioIsMaintained = () => {
    if (file && newFile) {
      const originalWidth = file?.json_field?.width;
      const originalHeight = file?.json_field?.height;
      const newWidth = newFile.width;
      const newHeight = newFile.height;
      // Calcula las proporciones
      const originalAspectRatio = originalWidth / originalHeight;
      const newAspectRatio = newWidth / newHeight;
      // Permitir un margen del 95% en la comparación
      const aspectRatioDifference = Math.abs(
        originalAspectRatio - newAspectRatio
      );
      const acceptableMargin = 0.03 * originalAspectRatio; // 5% del original
      return aspectRatioDifference <= acceptableMargin;
    } else {
      return false;
    }
  };

  useEffect(() => {
    aspectRatioIsMaintained();
  }, [file, newFile]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Tools Column */}
      <div className="w-[300px] border-r border-gray-300 dark:border-[var(--mantine-color-dark-4)] p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Tools</h2>
        <Accordion variant="contained" disableChevronRotation>
          <ResizeCropTool
            handleNewFile={handleNewFile}
            file={file!}
            handleSetFile={handleSetFile}
            disabledAccordion={disabledAccordion}
            trasnformations={trasnformations}
            setResizeCropParams={setResizeCropParams}
          />

          <FilterTool
            handleNewFile={handleNewFile}
            file={file!}
            handleSetFile={handleSetFile}
            disabledAccordion={disabledAccordion}
            transformations={trasnformations}
            setEffectParams={setEffectParams}
          />

          <Accordion.Item value="generative-ai">
            <Accordion.Control
              disabled={disabledAccordion}
              icon={
                <IconSparkles
                  style={{
                    width: rem(20),
                    height: rem(20),
                  }}
                />
              }
            >
              Generative AI
            </Accordion.Control>
            <Accordion.Panel>En construcción</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Image Preview Column */}
      <div className="flex-1 pl-4 pr-4 pb-[5px] pt-[10px] flex flex-col">
        <div className="flex justify-between items-center  min-h-[50px] mb-[10px] ">
          <h2 className="text-lg font-semibold">Image Preview</h2>
          <div className="flex items-center space-x-2">
            <Button
              leftSection={<IconDownload />}
              disabled={disabledAccordion}
              variant="light"
              onClick={(event) =>
                downloadImage(newFile ? newFile?.url! : file?.url!, event)
              }
            >
              Download Image
            </Button>
            {newFile && file && (
              <>
                {compare ? (
                  <Button
                    leftSection={<IconCaretLeftRight />}
                    variant="filled"
                    onClick={() => setCompare(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    disabled={disabledAccordion}
                    leftSection={<IconCaretLeftRight />}
                    variant="light"
                    onClick={() => {
                      if (aspectRatioIsMaintained()) {
                        setCompare(true);
                      } else {
                        showNotification({
                          title: "Error",
                          message:
                            "Cannot compare the images; their aspect ratios do not match.",
                          color: "red",
                        });
                      }
                    }}
                  >
                    Compare Images
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <Box className="flex-1  rounded-lg flex items-center justify-center overflow-hidden min-h-[calc(100vh - 130px)]">
          {file ? (
            <>
              {compare ? (
                <>
                  <two-up>
                    <img
                      src={file.url}
                      alt="Image Preview"
                      style={{
                        backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        position: "relative",
                      }}
                    />
                    <img
                      src={newFile?.url}
                      alt="Image Preview"
                      style={{
                        backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </two-up>
                </>
              ) : (
                <div className="min-h-[95%] max-h-[95%] overflow-hidden flex items-center justify-center min-w-[95%]  max-w-[95%] w-[100%] h-[100%]">
                  <img
                    src={newFile ? newFile.url : file.url}
                    alt="Image Preview"
                    style={{
                      height: "auto",
                      width: "auto",
                      maxWidth: "80%",
                      maxHeight: "90%",
                      minHeight: "200px",
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
                </div>
              )}
            </>
          ) : (
            <>
              <DropzoneButton />
            </>
          )}
        </Box>
        <Box className="h-[50px] border-t border-gray-300 dark:border-[var(--mantine-color-dark-4)]  w-full flex justify-between items-center ">
          {newFile ? (
            <>
              <Center mt={"xs"}>
                <IconPhoto className="mr-[10px]" />
                {newFile && (
                  <>
                    {newFile.width} x {newFile.height}
                  </>
                )}
              </Center>
            </>
          ) : (
            <>
              <Center mt={"xs"}>
                <IconPhoto className="mr-[10px]" />
                {file && (
                  <>
                    {file?.json_field?.width} x {file?.json_field?.height}
                  </>
                )}
              </Center>
            </>
          )}

          {file && newFile ? (
            <ButtonSaveTransformation file={file} image={newFile?.url} />
          ) : (
            <Button disabled>Save transformation</Button>
          )}
        </Box>
      </div>

      {/* Image Changes Column */}
      <div className="w-[280px] border-l border-gray-300 dark:border-[var(--mantine-color-dark-4)]  p-4 h-full overflow-auto">
        <h2 className="text-lg font-semibold mb-4">
          <SegmentedControl
            disabled={disabledAccordion}
            fullWidth
            onChange={(value) => setSegment(value)}
            value={segment}
            data={[
              {
                value: "saved",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconDeviceFloppy
                      style={{ width: rem(16), height: rem(16) }}
                    />
                    <span>Saved</span>
                  </Center>
                ),
              },
              {
                value: "changes",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconHistory style={{ width: rem(16), height: rem(16) }} />
                    <span>Changes</span>
                  </Center>
                ),
              },
            ]}
          />
        </h2>
        <div className="space-y-4 w-full">
          <>
            {segment === "saved" ? (
              <>
                <Center>Save your changes for future use</Center>
                <Box>
                  {file?.versions.map((version) => (
                    <Box key={version.id} mb={"md"}>
                      <img
                        src={version.url}
                        alt="Image Preview"
                        style={{
                          height: "auto",
                          width: "auto",
                          maxWidth: "100%",
                          maxHeight: "90%",
                          minHeight: "80px",
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
                      <Text>{version.description}</Text>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <>
                {" "}
                {file?.json_field?.derived?.map((item: any, index: number) => (
                  <img
                    key={index}
                    src={item.secure_url}
                    alt="Image Preview"
                    style={{
                      height: "auto",
                      width: "auto",
                      maxWidth: "100%",
                      maxHeight: "90%",
                      minHeight: "80px",
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
                ))}{" "}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
