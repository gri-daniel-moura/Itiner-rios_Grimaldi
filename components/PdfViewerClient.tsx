"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Configure worker to avoid bundling issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title: string;
  locationSlug: string;
}

export default function PdfViewerClient({ url, title, locationSlug }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [width, setWidth] = useState<number>(0);

  // Responsive width detection
  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth - 32); // 16px padding on each side
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const prevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const nextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

  return (
    <div className="flex flex-col h-screen bg-blue-600 pb- bezpieczna">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-lg z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href={`/${locationSlug}`} className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-sm truncate max-w-[180px]">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" download rel="noreferrer" className="p-2 hover:bg-slate-800 rounded-full transition-colors" title="Download">
            <Download size={20} />
          </a>
        </div>
      </div>

      {/* Viewer Main Area */}
      <div className="flex-1 overflow-auto bg-slate-800 flex justify-center py-6 px-4 touch-pan-x touch-pan-y relative" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="shadow-2xl bg-white transition-transform duration-200 origin-top flex" style={{ transform: `scale(${scale})` }}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex justify-center items-center h-64 text-slate-500 w-full">
                Loading Document...
              </div>
            }
            error={
              <div className="flex justify-center items-center h-64 text-red-500 bg-white px-8 rounded">
                Failed to load PDF.
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              width={width > 0 ? (width > 800 ? 800 : width) : undefined}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="bg-white"
            />
          </Document>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="bg-blue-600 text-white p-3 shadow-lg z-20 flex items-center justify-between sticky bottom-0 border-t border-blue-700 pb-safe">
        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden">
          <button onClick={zoomOut} disabled={scale <= 0.5} className="p-3 disabled:opacity-50 hover:bg-slate-700 active:bg-slate-600 transition-colors">
            <ZoomOut size={20} />
          </button>
          <span className="w-12 text-center text-xs font-mono">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} disabled={scale >= 3} className="p-3 disabled:opacity-50 hover:bg-slate-700 active:bg-slate-600 transition-colors">
            <ZoomIn size={20} />
          </button>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-4">
          <button onClick={prevPage} disabled={pageNumber <= 1} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-medium">
            {pageNumber} <span className="text-slate-400">/</span> {numPages || '-'}
          </span>
          <button onClick={nextPage} disabled={pageNumber >= numPages} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
