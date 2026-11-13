import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "GFI Talent Intelligence",
  description: "Explainable resume screening prototype for LCA and UI/UX roles"
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}