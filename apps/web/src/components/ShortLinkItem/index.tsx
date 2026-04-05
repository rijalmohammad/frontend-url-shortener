import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShortLink } from '@/types';
 
interface ShortLinkItemProps {
  link: ShortLink;
}
 
export default function ShortLinkItem({ link }: ShortLinkItemProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
 
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
 
  const handleTest = () => {
    window.open(link.short_url, '_blank');
  };
 
  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-${link.id}`);
    if (!svg) return;
 
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
 
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
 
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${link.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
 
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };
 
  return (
    <div className="group bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:border-cyan-200 transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <p className="text-xs text-slate-500 font-medium flex-shrink-0 pt-0.5">Original:</p>
          <p className="text-sm text-slate-700 break-all flex-1">{link.original_url}</p>
        </div>
 
        <div className="flex items-start gap-2">
          <p className="text-xs text-cyan-700 font-medium flex-shrink-0 pt-2">Shortened:</p>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg px-3 py-2 border border-cyan-100">
              <p className="text-xs text-cyan-700 font-semibold break-all">{link.short_url}</p>
            </div>
            
            <button
              onClick={handleCopy}
              className="cursor-pointer flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={handleTest}
              className="cursor-pointer flex-shrink-0 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30"
              title="Open link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
 
            <button
              onClick={() => setShowQR(!showQR)}
              className="cursor-pointer flex-shrink-0 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Show QR Code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>
        </div>
 
        {showQR && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <QRCodeSVG
                  id={`qr-${link.id}`}
                  value={link.short_url}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 mb-2">QR Code</p>
                <p className="text-xs text-purple-700 mb-3">Scan to visit the shortened URL</p>
                <button
                  onClick={handleDownloadQR}
                  className="cursor-pointer text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR
                </button>
              </div>
            </div>
          </div>
        )}
 
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(link.created_at)}
        </p>
      </div>
    </div>
  );
}