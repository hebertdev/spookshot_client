import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    brand: [
      "#fff1e1",
      "#ffe3cb",
      "#ffc599",
      "#ffa563",
      "#ff8a36",
      "#ff7918",
      "#ff7006",
      "#e45f00",
      "#cc5300",
      "#b24500",
    ],
    dark: [
      "#FF6B00", // color del título en darkmode
      "#FF6B00", // color del link <a> en darkmode
      "#d7d7d7", // color del texto <p> en darkmode
      "#8B8B8B", // input placeholder color en darkmode
      "#4A0E4E", // border input color en darkmode
      "#3A0C3E", // color border en div en darkmode y también default hover button
      "#2A0A2E", // input bg en darkmode
      "#1A081E", // background color en darkmode
      "#51005c", //mantine color dark 8
      "#fad", //
    ],
  },
  primaryColor: "brand",
});
