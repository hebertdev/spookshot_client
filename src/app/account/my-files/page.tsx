"use client";

//components
import { Container, Title, Box, Button } from "@mantine/core";
import { ContainerGallery } from "components/pages/Account/MyFiles";

export default function MyFiles() {
  return (
    <Container size={"lg"}>
      <Box className="flex justify-between gap-1 items-center">
        <Title order={2} mt={"md"} mb={"md"}>
          My Files
        </Title>
        <Button>Upload</Button>
      </Box>
      <ContainerGallery />
    </Container>
  );
}
