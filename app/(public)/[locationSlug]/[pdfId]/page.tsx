import { db } from '@/lib/db';
import { pdfFiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PdfViewerClient from '@/components/PdfViewerClient';

export const dynamic = 'force-dynamic';

export default async function PdfViewerPage({ params }: { params: { locationSlug: string; pdfId: string } }) {
  const [pdf] = await db.select().from(pdfFiles).where(eq(pdfFiles.id, params.pdfId));
  
  if (!pdf || !pdf.isActive) {
    notFound();
  }

  // We hide the global layout headers/footers recursively if possible, 
  // but since we are within app/(public)/layout.tsx, the header will wrap it. 
  // For a true full-screen viewer, we could put this page outside (public) layout.
  // Given we want standard viewing, the layout header is okay, but mobile viewer should take remaining height.
  // Actually, I authored the public layout header to be normal height.

  return (
    <div className="-mt-16 sm:mt-0 z-50 absolute inset-0 sm:relative">
       {/* Absolute full-screen cover on mobile to hide the standard nav bar, making it a true viewer */}
      <PdfViewerClient 
        url={pdf.fileUrl} 
        title={pdf.title} 
        locationSlug={params.locationSlug} 
      />
    </div>
  );
}
