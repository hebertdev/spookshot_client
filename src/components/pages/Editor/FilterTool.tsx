import { Accordion, Button, rem } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { FileData } from "interfaces/files";
import { MultiSelect } from "@mantine/core";
import { useState } from "react";
import { showNotification } from "components/Notifications";
import { transformFileAPI } from "services/files";

const filtersData = [
  { label: "Sepia", value: "sepia" },
  { label: "Grayscale", value: "grayscale" },
  { label: "Oil Paint", value: "oil_paint" },
  { label: "Pixelate", value: "pixelate:10" },
  { label: "Black & White", value: "blackwhite" },
  { label: "Cartoonify", value: "cartoonify:5:30" },
];

type NewFileData = {
  url: string;
  height: number;
  width: number;
};

interface FilterToolProps {
  handleNewFile: (url: NewFileData) => void;
  handleSetFile: (file: FileData) => void;
  file: FileData;
  disabledAccordion: boolean;
  transformations: any[];
  setEffectParams: React.Dispatch<React.SetStateAction<any[]>>;
}

export function FilterTool({
  handleNewFile,
  handleSetFile,
  file,
  disabledAccordion,
  transformations,
  setEffectParams,
}: FilterToolProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetSelectedFilters = (filters: string[]) => {
    setSelectedFilters([...filters]);
    setEffectParams([...filters.map((filter) => ({ effect: filter }))]);
  };

  const submitTransformation = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const data = await transformFileAPI(file.id, [...transformations]);
      handleSetFile(data.file);
      handleNewFile({
        url: data.url,
        height: data.height,
        width: data.width,
      });
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
        };
        img.src = imageUrl;
      }
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Ocurrió un error al procesar la imagen.",
        color: "red",
      });
      setLoading(false);
    }
  };
  return (
    <Accordion.Item value="filters">
      <Accordion.Control
        disabled={disabledAccordion}
        icon={<IconFilter style={{ width: rem(20), height: rem(20) }} />}
      >
        Filters
      </Accordion.Control>
      <Accordion.Panel>
        <MultiSelect
          placeholder="Select filters"
          data={filtersData}
          value={selectedFilters}
          onChange={handleSetSelectedFilters}
        />
        <Button
          fullWidth
          mt="xs"
          onClick={submitTransformation}
          loading={loading}
        >
          Apply Filters
        </Button>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
