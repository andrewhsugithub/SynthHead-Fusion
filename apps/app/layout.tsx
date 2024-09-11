import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";

import { headers } from "next/headers";

import Layout from "@/components/page/Layout";
import { GLOBAL_TITLE, GLOBAL_DESCRIPTION } from "@/constants";

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export async function generateMetadata() {
  const headersList = headers();
  const currentPath = headersList.get("x-current-path");
  const [_, route] = currentPath?.split("/") || [];

  return {
    title: GLOBAL_TITLE,
    description: GLOBAL_DESCRIPTION,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
