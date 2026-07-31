import type { Metadata } from 'next';
import { gloock, gilda, cormorant, zenMincho } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beyond Bizarre | A JoJo Experience',
  description: 'Enter a world beyond your imagination.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${gloock.variable} ${gilda.variable} ${cormorant.variable} ${zenMincho.variable}`}
    >
      <body className="min-h-screen bg-[#0a0b0e] text-[#e0e0e0] font-cormorant antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}