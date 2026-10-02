import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Alex Rivera | Senior Full-Stack Architect & 3D Web Creative',
  description:
    'Dynamic 3D portfolio powered by Next.js 15, WebGL, Three.js, and Supabase Admin CMS. Manage portfolio content, projects, skills, and credentials live without editing code.',
  keywords: [
    '3D Portfolio',
    'Next.js 15',
    'Three.js',
    'WebGL',
    'Supabase CMS',
    'Full-Stack Architect',
    'React',
    'TypeScript',
  ],
  authors: [{ name: 'Alex Rivera' }],
  openGraph: {
    title: 'Alex Rivera | 3D Interactive Portfolio & CMS',
    description: 'Dynamic 3D spatial portfolio with Supabase-backed Admin Dashboard.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
