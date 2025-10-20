import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NinAI - Document-Based Chat",
  description: "AI chat system that allows users to ask questions and receive document-based answers with citations from sources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
