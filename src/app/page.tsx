import type { Metadata } from 'next';
import { getPortfolioServerData } from '@/lib/portfolio-server';
import { PortfolioClient } from '@/components/PortfolioClient';

// Ensure fresh data is pulled on every server request so admin updates reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioServerData();
  const name = data.profile?.full_name?.trim() || 'Portfolio';
  const tagline = data.profile?.tagline?.trim() || '3D Interactive Portfolio';
  const bio =
    data.profile?.bio?.trim() ||
    'Modern interactive web portfolio built with Next.js, Three.js, and Supabase.';

  return {
    title: `${name} | ${tagline}`,
    description: bio,
    openGraph: {
      title: `${name} | ${tagline}`,
      description: bio,
      type: 'website',
    },
  };
}

export default async function Page() {
  const initialData = await getPortfolioServerData();

  return <PortfolioClient initialData={initialData} />;
}
