import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'OVRA — Every Workout',
  description: 'OVRA athletic knitwear landing page featuring misty-orchid sportswear, WORKOUT photo collage, and Fresh Fits stencil marquee.',
  openGraph: {
    title: 'OVRA — Every Workout',
    description: 'OVRA athletic knitwear landing page featuring misty-orchid sportswear, WORKOUT photo collage, and Fresh Fits stencil marquee.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVRA — Every Workout',
    description: 'OVRA athletic knitwear landing page featuring misty-orchid sportswear, WORKOUT photo collage, and Fresh Fits stencil marquee.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
