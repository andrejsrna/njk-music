// lib/fonts.js
import { Inter, Russo_One, Share_Tech_Mono, Archivo, JetBrains_Mono } from 'next/font/google'

export const pressStart2P = Russo_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap', // Improves loading performance
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Track detail redesign
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});
