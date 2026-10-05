import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='bis_skin_checked'||n==='bis_register')return;return o.apply(this,arguments);};var c=function(){var el=document.querySelectorAll('[bis_skin_checked],[bis_register]');for(var i=0;i<el.length;i++){el[i].removeAttribute('bis_skin_checked');el[i].removeAttribute('bis_register');}};c();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',c);}var ce=console.error;console.error=function(){for(var i=0;i<arguments.length;i++){if(typeof arguments[i]==='string'&&arguments[i].indexOf('bis_skin_checked')!==-1){return;}}return ce.apply(console,arguments);};}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
