import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { PredictionsProvider } from "@/components/predictions-provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "SportPredict - Track Your Sports Predictions",
  description: "Make and track sports predictions with probability-based odds",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PredictionsProvider>{children}</PredictionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
