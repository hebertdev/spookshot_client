import {
  Accordion,
  Box,
  Button,
  Divider,
  NumberInput,
  rem,
  Switch,
  Tabs,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconCrop,
  IconInfoSquareRounded,
  IconMaximize,
  IconRectangleVertical,
} from "@tabler/icons-react";
import {
  IconCrop32,
  IconCropLandscape,
  IconCropPortrait,
  IconSquare,
  IconCheck,
} from "@tabler/icons-react";
import { Group, Select, SelectProps } from "@mantine/core";
import { use, useEffect, useState } from "react";
import { transformFileAPI } from "services/files";
import { showNotification } from "components/Notifications";
import { FileData } from "interfaces/files";

type NewFileData = {
  url: string;
  height: number;
  width: number;
};

interface ResizeCropToolProps {
  handleNewFile: (url: NewFileData) => void;
  handleSetFile: (file: FileData) => void;
  file: FileData;
  disabledAccordion: boolean;
  trasnformations: any[];
  setResizeCropParams: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ResizeCropTool({
  handleNewFile,
  handleSetFile,
  file,
  disabledAccordion,
  trasnformations,
  setResizeCropParams,
}: ResizeCropToolProps) {
  const [aspectRatio, setAspectRatio] = useState<string | null>("custom");
  const [height, setHeight] = useState<number | undefined | string>(undefined);
  const [width, setWidth] = useState<number | undefined | string>(undefined);
  const [crop, setCrop] = useState<string | null>("pad");
  const [loading, setLoading] = useState<boolean>(false);
  const [genFillAi, setGenFillAi] = useState<boolean>(false);
  const [smartCrop, setSmartCrop] = useState<boolean>(false);
  const [mantainAspectRatio, setMantainAspectRatio] = useState<boolean>(false);
  const [params, setParams] = useState<{ [key: string]: any }>({ crop: "pad" });

  const aspectRatioMap: Record<string, string> = {
    custom: "custom",
    portrait_9_16: "9:16",
    wide_16_9: "16:9",
    square_1_1: "1:1",
    landscape_4_3: "4:3",
    portrait_3_4: "3:4",
  };

  const originalWidth = file?.json_field?.width;
  const originalHeight = file?.json_field?.height;

  useEffect(() => {
    if (mantainAspectRatio) {
      setWidth(originalWidth);
      setHeight(originalHeight);
      setParams((prevParams) => ({
        ...prevParams,
        width: originalWidth,
        height: originalHeight,
      }));
    } else {
      setWidth("");
      setHeight("");
      setParams((prevParams) => {
        const newParams = { ...prevParams };
        delete newParams.width;
        delete newParams.height;
        return newParams;
      });
    }
  }, [mantainAspectRatio]);

  useEffect(() => {
    if (aspectRatio !== "custom") {
      setMantainAspectRatio(false);
    } else {
      setParams((prevParams) => {
        const newParams = { ...prevParams };
        delete newParams.width;
        delete newParams.height;
        return newParams;
      });
    }
    //handleWidth(width);
  }, [aspectRatio]);

  useEffect(() => {
    setGenFillAi(false);
    setSmartCrop(false);
    const newParams = { ...params };
    delete newParams.background;
    delete newParams.gravity;
    setParams(newParams);
  }, [crop]);

  const handleWidth = (value: number | undefined | string) => {
    if (typeof value === "number") {
      setWidth(value);
      setParams((prevParams) => ({
        ...prevParams,
        width: value,
      }));
      if (value > 0) {
        if (aspectRatio === "custom" && mantainAspectRatio) {
          const newHeight = Math.round(
            (value * originalHeight) / originalWidth
          );
          setHeight(newHeight);
          setParams((prevParams) => ({
            ...prevParams,
            height: newHeight,
          }));
        } else if (aspectRatio !== "custom") {
          const [aspectWidth, aspectHeight] = aspectRatioMap[aspectRatio!]
            .split(":")
            .map(Number);
          const newHeight = Math.round((value * aspectHeight) / aspectWidth);
          setHeight(newHeight);
          setParams((prevParams) => ({
            ...prevParams,
            height: newHeight,
          }));
        }
      }
    } else {
      setWidth(undefined);
      setParams((prevParams) => {
        const newParams = { ...prevParams };
        delete newParams.width;
        return newParams;
      });
    }
  };

  const handleHeight = (value: number | undefined | string) => {
    if (typeof value === "number") {
      setHeight(value);
      setParams((prevParams) => ({
        ...prevParams,
        height: value,
      }));
      if (value > 0) {
        if (aspectRatio === "custom" && mantainAspectRatio) {
          const newWidth = Math.round((value * originalWidth) / originalHeight);
          setWidth(newWidth);
          setParams((prevParams) => ({
            ...prevParams,
            width: newWidth,
          }));
        } else if (aspectRatio !== "custom") {
          const [aspectWidth, aspectHeight] = aspectRatioMap[aspectRatio!]
            .split(":")
            .map(Number);
          const newWidth = Math.round((value * aspectWidth) / aspectHeight);
          setWidth(newWidth);
          setParams((prevParams) => ({
            ...prevParams,
            width: newWidth,
          }));
        }
      }
    } else {
      setHeight(undefined);
      setParams((prevParams) => {
        const newParams = { ...prevParams };
        delete newParams.height;
        return newParams;
      });
    }
  };

  const handleAspectRatio = (value: string | null) => {
    setAspectRatio(value);
    setParams((prevParams) => {
      const newParams = { ...prevParams };
      if (value !== "custom") {
        newParams.aspect_ratio = aspectRatioMap[value!];
      } else {
        delete newParams.aspect_ratio;
      }
      return newParams;
    });
  };

  const handleCrop = (value: string | null) => {
    setCrop(value);
    setParams((prevParams) => {
      const newParams = { ...prevParams };
      newParams.crop = value;
      delete newParams.gravity;
      delete newParams.background;
      return newParams;
    });
  };

  useEffect(() => {
    setResizeCropParams([params]);
    if (height) {
      setParams((prevParams) => ({
        ...prevParams,
        height: height,
      }));
    } else {
      const newParams = { ...params };
      delete newParams.height;
      setParams(newParams);
    }
  }, [width, height, aspectRatio, crop, genFillAi, smartCrop]);

  const validateResizeParams = (): boolean => {
    if (aspectRatio === "custom" && (!width || !height)) {
      showNotification({
        title: "Error",
        message:
          "No se puede aplicar el resize sin especificar el ancho o altura",
        color: "red",
      });
      return false;
    }
    return true;
  };

  const validateSmartCropParams = (): boolean => {
    if (crop === "crop") {
      if (smartCrop && !width && !height) {
        showNotification({
          title: "Error",
          message:
            "No se puede aplicar el smart crop sin especificar el ancho o altura",
          color: "red",
        });
        return false;
      }
    }
    return true;
  };

  const validateParams = (): boolean => {
    return validateResizeParams() && validateSmartCropParams();
  };

  const handleSubmitTransformation = async () => {
    if (loading) return;
    if (!validateParams()) return;
    try {
      setLoading(true);
      if (!trasnformations || trasnformations.length === 0) {
        showNotification({
          title: "Error",
          message: "No se puede aplicar ningún cambio.",
          color: "red",
        });
        setLoading(false);
        return;
      }

      const data = await transformFileAPI(file.id, trasnformations);
      handleSetFile(data.file);
      if (data.url) {
        const imageUrl = data.url;
        const img = new Image();
        img.onload = () => {
          setLoading(false);
          handleNewFile({
            url: imageUrl,
            height: img.height,
            width: img.width,
          });
        };
        img.onerror = () => {
          setLoading(false);
          showNotification({
            title: "Error",
            message: "No se pudo transformar la imagen.",
            color: "red",
          });
          if (genFillAi) {
            showNotification({
              title: "Error",
              message:
                "Elimine la opción 'Generative Fill', aplique los cambios y luego vuelva a añadir 'Generative Fill' para intentar nuevamente.",
              color: "red",
              autoClose: 6000,
            });
          }
        };
        img.src = imageUrl;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Ocurrió un error al procesar la imagen.");
    }
  };

  return (
    <Accordion.Item value="resize">
      <Accordion.Control
        disabled={disabledAccordion}
        icon={
          <IconCrop
            style={{
              width: rem(20),
              height: rem(20),
            }}
          />
        }
      >
        Rezise & Crop
      </Accordion.Control>
      <Accordion.Panel>
        <SelectAspectRatio
          aspectRatio={aspectRatio}
          handleAspectRatio={handleAspectRatio}
        />

        {aspectRatio === "custom" && (
          <Switch
            mt={"md"}
            size="xs"
            label="Maintain aspect ratio"
            checked={mantainAspectRatio}
            onChange={(e) => setMantainAspectRatio(e.currentTarget.checked)}
          />
        )}

        <Box className="flex gap-1">
          <NumberInput
            label="Width"
            placeholder="Enter"
            value={width}
            onChange={handleWidth}
            allowDecimal={false}
            allowNegative={false}
          />
          <NumberInput
            label="Height"
            placeholder="Enter"
            value={height}
            onChange={handleHeight}
            allowDecimal={false}
            allowNegative={false}
          />
        </Box>
        <Tabs defaultValue="gallery" value={crop} onChange={handleCrop}>
          <Tabs.List grow>
            <Tabs.Tab value="pad">Fit</Tabs.Tab>
            <Tabs.Tab value="fill">Fill</Tabs.Tab>
            <Tabs.Tab value="crop">Crop</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pad">
            <Text size="xs" mt="xs">
              Resizes the image to fit inside the bounding box specified by the
              dimensions, maintaining the aspect ratio.
            </Text>
            <img
              src="https://res.cloudinary.com/prod/image/upload/q_auto,f_auto,dpr_2/v1695973685/console/studio/fit_example"
              alt=""
            />
            <Switch
              labelPosition="left"
              checked={genFillAi}
              onChange={(event) => {
                const isChecked = event.currentTarget.checked;
                setGenFillAi(isChecked);
                setParams((prevParams) => {
                  const newParams = { ...prevParams };
                  if (isChecked) {
                    newParams.background = "gen_fill";
                    delete newParams.gravity;
                  } else {
                    delete newParams.background;
                  }

                  return newParams;
                });
              }}
              label={
                <>
                  <Text size="sm" className="flex items-center ">
                    Generative Fill{" "}
                    <Tooltip label="Automatically fills the padded area using generative AI to extend the image seamlessly.">
                      <IconInfoSquareRounded
                        className="ml-[4px]"
                        size={"16px"}
                      />
                    </Tooltip>
                  </Text>
                </>
              }
            />
          </Tabs.Panel>

          <Tabs.Panel value="fill">
            <Text size="xs" mt="xs">
              Resizes the image to fill the specified dimensions without
              distortion. The image may be cropped as a result.
            </Text>
            <img
              src="https://res.cloudinary.com/prod/image/upload/q_auto,f_auto,dpr_2/v1695973685/console/studio/fill_example"
              alt=""
            />
            <Switch
              labelPosition="left"
              checked={smartCrop}
              onChange={(event) => {
                const isChecked = event.currentTarget.checked;
                setSmartCrop(isChecked);
                setParams((prevParams) => {
                  const newParams = { ...prevParams };
                  if (isChecked) {
                    newParams.gravity = "auto";
                    delete newParams.background;
                  } else {
                    delete newParams.gravity;
                  }
                  return newParams;
                });
              }}
              label={
                <>
                  <Text size="sm" className="flex items-center ">
                    Smart crop{" "}
                    <Tooltip label="Automatically focuses on the most interesting area.">
                      <IconInfoSquareRounded
                        className="ml-[4px]"
                        size={"16px"}
                      />
                    </Tooltip>
                  </Text>
                </>
              }
            />
          </Tabs.Panel>

          <Tabs.Panel value="crop">
            <Text size="xs" mt="xs">
              Extracts a region of the specified dimensions from the original
              image without first resizing it.
            </Text>
            <img
              src="https://res.cloudinary.com/prod/image/upload/q_auto,f_auto,dpr_2/v1695973685/console/studio/crop_example"
              alt=""
            />
            <Switch
              labelPosition="left"
              checked={smartCrop}
              onChange={(event) => {
                const isChecked = event.currentTarget.checked;
                setSmartCrop(isChecked);
                setParams((prevParams) => {
                  const newParams = { ...prevParams };
                  if (isChecked) {
                    newParams.gravity = "auto";
                    delete newParams.background;
                  } else {
                    delete newParams.gravity;
                  }
                  return newParams;
                });
              }}
              label={
                <>
                  <Text size="sm" className="flex items-center ">
                    Smart crop{" "}
                    <Tooltip label="Automatically focuses on the most interesting area.">
                      <IconInfoSquareRounded
                        className="ml-[4px]"
                        size={"16px"}
                      />
                    </Tooltip>
                  </Text>
                </>
              }
            />
          </Tabs.Panel>
        </Tabs>
        <Divider mt={"xs"} />
        <Button
          fullWidth
          size="sm"
          mt={"xs"}
          onClick={handleSubmitTransformation}
          loading={loading}
        >
          Apply Changes
        </Button>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

interface SelectAspectRatioProps {
  aspectRatio: string | null;
  handleAspectRatio: (data: any) => void;
}

function SelectAspectRatio({
  aspectRatio,
  handleAspectRatio,
}: SelectAspectRatioProps) {
  const iconProps = {
    stroke: 1.5,
    color: "currentColor",
    opacity: 0.6,
    size: 18,
  };

  const icons: Record<string, React.ReactNode> = {
    custom: <IconMaximize {...iconProps} />,
    portrait_9_16: <IconCropPortrait {...iconProps} />,
    wide_16_9: <IconCrop32 {...iconProps} />,
    square_1_1: <IconSquare {...iconProps} />,
    landscape_4_3: <IconCropLandscape {...iconProps} />,
    portrait_3_4: <IconRectangleVertical {...iconProps} />,
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      {icons[option.value]}
      {option.label}
      {checked && (
        <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
      )}
    </Group>
  );

  return (
    <Select
      label="Aspect ratio"
      mb={"xs"}
      placeholder="Select aspect ratio"
      onChange={handleAspectRatio}
      allowDeselect={false}
      data={[
        { value: "custom", label: "Custom" },
        { value: "portrait_9_16", label: "Portrait (9:16)" },
        { value: "wide_16_9", label: "Wide (16:9)" },
        { value: "square_1_1", label: "Square (1:1)" },
        { value: "landscape_4_3", label: "Landscape (4:3)" },
        { value: "portrait_3_4", label: "Portrait (3:4)" },
      ]}
      renderOption={renderSelectOption}
      value={aspectRatio}
    />
  );
}
