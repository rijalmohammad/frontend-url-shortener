import { useContext } from 'react';
import { UrlShortenerContext } from '@/context/UrlShortenerContext';
 
export function useUrlShortener() {
  const context = useContext(UrlShortenerContext);
  
  if (context === undefined) {
    throw new Error('useUrlShortener must be used within UrlShortenerProvider');
  }
  
  return context;
}