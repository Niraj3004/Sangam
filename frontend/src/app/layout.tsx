import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sangam | Nepali Students Network",
  description: "The ultimate platform for Nepali students to discover opportunities, collaborate on projects, and build their careers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
