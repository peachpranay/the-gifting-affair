import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/app/components/context/CartContext';
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: "hamper-website",
  description: "hamper-website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
