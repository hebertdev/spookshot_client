"use client";
import {
  SegmentedControl,
  useMantineColorScheme,
  Center,
  rem,
} from "@mantine/core";
import { IconSun, IconMoon, IconDeviceLaptop } from "@tabler/icons-react";

export function DarkModeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <>
      <SegmentedControl
        value={colorScheme}
        onChange={(value: any) => setColorScheme(value)}
        data={[
          {
            value: "light",
            label: (
              <Center style={{ gap: 10 }}>
                <IconSun style={{ width: rem(16), height: rem(16) }} />
                <span>Light</span>
              </Center>
            ),
          },
          {
            value: "dark",
            label: (
              <Center style={{ gap: 10 }}>
                <IconMoon style={{ width: rem(16), height: rem(16) }} />
                <span>Dark</span>
              </Center>
            ),
          },
        ]}
        size="xs"
        m={10}
        fullWidth
      />
    </>
  );
}
