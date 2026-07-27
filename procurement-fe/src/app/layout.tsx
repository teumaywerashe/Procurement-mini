import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'var(--font-geist-sans), sans-serif',
});

export const metadata: Metadata = {
  title: 'ProcureHub',
  description: 'Procurement management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
