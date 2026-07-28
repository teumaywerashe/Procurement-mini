import type { Metadata } from "next";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";
import { ThemeProvider } from "../components/ThemeProvider";

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "var(--font-geist-sans), sans-serif",
});

export const metadata: Metadata = {
  title: "ProcureHub",
  description: "Procurement management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Prevents flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');})();`,
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <MantineProvider theme={theme} defaultColorScheme="dark">
              {children}
            </MantineProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
