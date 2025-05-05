import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
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
        <main className='container mx-auto px-3 md:px-0'>{props.children}</main>
      </body>
    </html>
  );
}
