import { LucideHome } from 'lucide-react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import '~/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Forecast Finder',
  description: 'Find the weather forecast for your local area',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} antialiased`}>
        <header className='fixed top-4 left-4'>
          <Link
            href='/'
            className='rounded-full p-2 hover:bg-neutral-300 flex items-center justify-center'
          >
            <span className='sr-only'>Home</span>
            <LucideHome aria-hidden />
          </Link>
        </header>

        <main className='container mx-auto px-3 md:px-0 mb-12'>
          {props.children}
        </main>
      </body>
    </html>
  );
}
