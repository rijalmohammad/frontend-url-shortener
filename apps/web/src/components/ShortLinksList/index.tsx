'use client';
 
import { useEffect } from 'react';
import { useUrlShortener } from '@/hooks/useUrlShortener';
import ShortLinkItem from '@/components/ShortLinkItem';
 
export default function ShortLinksList() {
  const { shortLinks, fetchAllLinks } = useUrlShortener();
 
  useEffect(() => {
    fetchAllLinks().catch((err) => {
      console.error('Failed to fetch links:', err);
    });
  }, [fetchAllLinks]);
 
  if (shortLinks.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 p-12 text-center border border-slate-100">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No links yet</h3>
        <p className="text-slate-500">Create your first shortened link above to get started</p>
      </div>
    );
  }
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
          Your Links
          <span className="text-sm font-normal text-slate-500 ml-1">({shortLinks.length})</span>
        </h2>
      </div>
      <div className="grid gap-4">
        {shortLinks.map((link) => (
          <ShortLinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}