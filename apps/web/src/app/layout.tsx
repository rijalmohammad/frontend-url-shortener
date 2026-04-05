import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UrlShortenerProvider } from '@/context/UrlShortenerContext';
 
const inter = Inter({ subsets: ['latin'] });
 
export const metadata: Metadata = {
  title: 'LinkShort',
  description: 'Shorten links instantly',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UrlShortenerProvider>
          {children}
        </UrlShortenerProvider>
      </body>
    </html>
  );
}