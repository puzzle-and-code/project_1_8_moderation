import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moderation App",
  description: "Приложение для модерации статей",
};

import "@pigment-css/react/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {/* Шапка*/}
        <Header />

        {/* Контейнер для  контента страниц */}
        <main className="flex-1 container mx-auto max-w-5xl p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
