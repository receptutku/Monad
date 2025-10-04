import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Monad Parallel Auctions',
  description: 'Commit-Reveal based uniform price batch auctions on Monad',
  keywords: ['Monad', 'DeFi', 'Auctions', 'Blockchain', 'Web3'],
  authors: [{ name: 'Monad Team' }],
  openGraph: {
    title: 'Monad Parallel Auctions',
    description: 'Commit-Reveal based uniform price batch auctions on Monad',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monad Parallel Auctions',
    description: 'Commit-Reveal based uniform price batch auctions on Monad',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

