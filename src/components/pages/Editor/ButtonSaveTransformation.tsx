import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "components/Notifications";
import { FileData } from "interfaces/files";
import { useState } from "react";
import { savedTransformationsAPI } from "services/files";

interface ButtonSaveTransformationProps {
  image: string;
  file: FileData;
}

export function ButtonSaveTransformation({
  file,
  image,
}: ButtonSaveTransformationProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveTransformation = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const data = {
        description: description,
        url: image,
        public_id: file.public_id,
      };

      await savedTransformationsAPI(file.id, data);
      showNotification({
        title: "Success",
        message: "Transformation saved successfully",
        color: "green",
      });
      setLoading(false);
      setDescription("")
      close();
    } catch (error) {
      setLoading(false);
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <>
      <Button onClick={open}>Save transformation</Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Save transformation"
        centered
      >
        <img
          src={image}
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
        <TextInput
          mt={"xs"}
          label="Description"
          placeholder="Facebook cover"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <Box mt={"xs"} className="flex gap-2">
          <Button onClick={() => close()} fullWidth variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSaveTransformation}
            fullWidth
            loading={loading}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
}
