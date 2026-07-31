import { Gloock, Gilda_Display, Cormorant_Upright, Zen_Old_Mincho } from 'next/font/google';

export const gloock = Gloock({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gloock',
});

export const gilda = Gilda_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gilda',
});

export const cormorant = Cormorant_Upright({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export const zenMincho = Zen_Old_Mincho({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-mincho',
});