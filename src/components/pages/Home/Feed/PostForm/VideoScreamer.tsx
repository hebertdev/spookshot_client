import {
  Box,
  Button,
  Card,
  Checkbox,
  Image,
  Modal,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons-react";
import { showNotification } from "components/Notifications";
import { FileData } from "interfaces/files";
import { useEffect, useRef, useState } from "react";
import { getFilesAPI, uploadFileAPI, videoScreamerAPI } from "services/files";

interface videoScreamerProps {
  handleSetMedia: (media: string[]) => void;
}

export function VideoScreamer({ handleSetMedia }: videoScreamerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generated, setGenerated] = useState<string[]>([]); // Change to an array
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);
  const [selectImage, setSelectImage] = useState<FileData | null>(null);
  const [errorGenerating, setErrorGenerating] = useState<boolean>(false);
  const [retryTime, setRetryTime] = useState<number>(15000);
  const [urlVideo, setUrlVideo] = useState<string | null>(null);

  const handleGetFiles = async () => {
    try {
      const data = await getFilesAPI();
      setItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (opened) handleGetFiles();
  }, [opened]);

  const handleCheckboxChange = (index: number | null) => {
    const newIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newIndex);
    if (newIndex !== null) {
      setSelectImage(items[newIndex]);
      close();
    } else {
      console.log("empty");
    }
  };

  const inputFileImagePost = useRef(null);

  const handleFileChangeAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (loading) return;

    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setLoading(true);
      const data = await uploadFileAPI(selectedFile);
      showNotification({
        title: "Success",
        message: "Upload success",
        color: "green",
      });
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems.unshift(data);
        return newItems;
      });
    } catch (e) {
      showNotification({
        title: "Error",
        message: "Could not upload the image.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const params: Array<{
        effect?: string;
        crop?: string;
        aspect_ratio?: string;
        background?: string;
      }> = [];

      if (aspectRatio) {
        params.push({
          crop: "pad",
          aspect_ratio: aspectRatio,
          background: "gen_fill",
        });
      }

      const data = await videoScreamerAPI(selectImage?.id!, params);
      setUrlVideo(data.url_video);
      handleSetMedia([data.url_video]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <div className="mt-2">
        <p>
          Create a screamer video using an image, apply random filters, and
          include a random screamer in one of them.
        </p>
        <Button
          mt={"xs"}
          radius={"lg"}
          leftSection={<IconPhoto size={"18"} />}
          size="xs"
          variant="outline"
          onClick={open}
        >
          {selectedIndex !== null ? "Change image" : "Select image"}
        </Button>
        <Modal
          opened={opened}
          onClose={close}
          title="Select or upload image"
          centered
        >
          <Box mb={"xs"}>
            <label htmlFor="file-input">png / jpg / webp / avif</label>
            <br />
            <Button
              loading={loading}
              fullWidth
              size="md"
              variant="outline"
              leftSection={<IconPhoto />}
              component="label"
              mt={"xs"}
              mb={"md"}
            >
              Upload
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChangeAndUpload}
                ref={inputFileImagePost}
              />
            </Button>
          </Box>

          <div className="columns-2 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-2 gap-3">
            {items.map((file, index) => (
              <Card
                key={index} // Make sure to add a unique key
                radius={"md"}
                className="mb-4 break-inside-avoid p-0 overflow-hidden relative group"
                withBorder
              >
                <Box className="relative">
                  <Box className="absolute top-0 left-0 p-1 w-full">
                    <Box className="p-[3px] bg-[rgba(0,0,0,0.4)] w-[24px] h-[24px] rounded-[3px] flex justify-center items-center">
                      <Checkbox
                        checked={selectedIndex === index}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </Box>
                  </Box>
                  <Image
                    src={file.url}
                    width={file.json_field.width}
                    height={file.json_field.height}
                    className="w-full h-auto min-h-[150px] group-hover"
                  />
                </Box>
              </Card>
            ))}
          </div>
        </Modal>
      </div>
      {selectImage && (
        <Box
          mt={"xs"}
          className="min-h-[300px] max-h-[400px] overflow-hidden flex items-center justify-center min-w-[95%] max-w-[95%] h-[200px]"
        >
          {urlVideo ? (
            <video
              src={urlVideo}
              controls
              style={{
                height: "auto",
                width: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
                minHeight: "200px",
              }}
            />
          ) : (
            <img
              src={generated[0] ? generated[0] : selectImage?.url}
              style={{
                height: "auto",
                width: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
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
          )}
        </Box>
      )}

      {selectImage && (
        <>
          <Select
            mt={"xs"}
            data={[
              {
                value: "9:16",
                label: "Instagram story (9/16)",
              },
              {
                value: "1:1",
                label: "Instagram post (1/1)",
              },
              {
                value: "3:4",
                label: "Instagram post (3/4)",
              },
            ]}
            placeholder="Select an output format"
            value={aspectRatio}
            onChange={setAspectRatio}
          />
          <Button
            mt={"xs"}
            radius={"lg"}
            fullWidth
            variant="light"
            onClick={handleGenerate}
            loading={loading}
            disabled={errorGenerating || !aspectRatio}
          >
            {errorGenerating ? `Retry in ${retryTime / 1000} sec` : "Generate"}
          </Button>
        </>
      )}
    </>
  );
}
