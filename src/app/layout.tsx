import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import { CartStoreProvider } from "@/stores/cart-store-provider";
import { ListStoreProvider } from "@/stores/list-store-provider";
import "./globals.css";

const plexSansKr = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  preload: false,
  display: "swap",
  variable: "--font-plex-sans-kr",
});

export const metadata: Metadata = {
  title: "마틀러",
  description: "이마트와 롯데마트 가격을 비교하는 장보기 도우미",
};

export const viewport: Viewport = {
  themeColor: "#1F4E8C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={plexSansKr.variable}>
      <body className="bg-canvas font-sans text-ink antialiased">
        <CartStoreProvider>
          <ListStoreProvider>
            <div className="mx-auto min-h-dvh max-w-[480px] bg-canvas">
              {children}
            </div>
          </ListStoreProvider>
        </CartStoreProvider>
      </body>
    </html>
  );
}
