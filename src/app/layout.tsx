import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";
import { Header } from "components/Header";
import { getTokenServer } from "helpers/auth";
import { Navbar } from "components/Navbar";
import NextTopLoader from "nextjs-toploader";
import { TransitionDark } from "components/TransitionDark";

//providers
import { UserContextProvider } from "contexts/UserContext";

export const metadata = {
  title: "SpookShot | Beautiful App",
  description:
    "SpookShot is the perfect app for Halloween, featuring spooky filters and effects that transform your photos into terrifying masterpieces. Have fun creating and sharing unique moments with friends and family!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getTokenServer(); // Espera a que se obtenga el token
  return (
    <html lang="es">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <NextTopLoader color="#ff7006" height={3} />
        <MantineProvider theme={theme}>
          <UserContextProvider>
            <Notifications />
            <TransitionDark />
            {!token ? (
              <>
                <Header />
                {children}
              </>
            ) : (
              <>
                <div className="w-full flex justify-between">
                  <Navbar />
                  <div className="w-full">{children}</div>
                </div>
              </>
            )}
          </UserContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
