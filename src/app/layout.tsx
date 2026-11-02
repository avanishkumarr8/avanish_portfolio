import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Avanish Kumar | Frontend Engineer",
  description:
    "Frontend Engineer portfolio — React.js, Next.js, TypeScript. Scalable product UIs, GraphQL workflows, and release-quality engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-white">
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
