import type { Metadata } from "next";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "var(--font-geist-sans), sans-serif",
});

export const metadata: Metadata = {
  title: "ProcureHub",
  description: "Procurement management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <MantineProvider
            theme={theme}
            defaultColorScheme="dark"
          >
            {children}
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  );
}