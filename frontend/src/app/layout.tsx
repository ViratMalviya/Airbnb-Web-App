import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Airbnb Clone',
  description: 'A functional clone of Airbnb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ToastProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
            </WishlistProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
