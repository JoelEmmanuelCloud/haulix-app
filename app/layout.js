import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Haulix - Professional Shipping Support',
  description: 'Fast, reliable shipping support with real-time chat and tracking. Professional logistics solutions for your delivery needs.',
  keywords: 'shipping, delivery, logistics, tracking, support, real-time chat',
  authors: [{ name: 'Haulix Team' }],
  creator: 'Haulix',
  publisher: 'Haulix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Haulix - Professional Shipping Support',
    description: 'Fast, reliable shipping support with real-time chat and tracking.',
    url: 'https://haulix.delivery',
    siteName: 'Haulix',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haulix - Professional Shipping Support',
    description: 'Fast, reliable shipping support with real-time chat and tracking.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}