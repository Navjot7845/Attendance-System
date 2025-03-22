import { Analytics } from '@vercel/analytics/next';
import NextThemeProvider from '@/components/ThemeProvider';
import "./globals.css";

export const metadata = {
  title: "Coding Ninjas CUIET",
  description: "Coding Ninjas",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en"
      suppressHydrationWarning
    >
      <body
        className={`antialiased`}
      >
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
          <Analytics />
        </NextThemeProvider>
      </body>
    </html>
  );
}