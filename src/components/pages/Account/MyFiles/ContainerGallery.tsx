"use client";

import { Tabs, rem } from "@mantine/core";
import { IconPhoto, IconStar, IconSettings } from "@tabler/icons-react";
import { Gallery } from "./Gallery";

export function ContainerGallery() {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="gallery">
      <Tabs.List mb={"sm"}>
        <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
          Gallery
        </Tabs.Tab>
        <Tabs.Tab value="messages" leftSection={<IconStar style={iconStyle} />}>
          Favorites
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <Gallery />
      </Tabs.Panel>

      <Tabs.Panel value="messages">In building</Tabs.Panel>
    </Tabs>
  );
}
