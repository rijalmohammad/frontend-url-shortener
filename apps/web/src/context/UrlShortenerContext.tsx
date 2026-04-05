'use client';
 
import { createContext, useState, useCallback, ReactNode } from 'react';
import { ShortLink } from '@/types';
import { api } from '@/lib/api';
 
interface UrlShortenerContextType {
  shortLinks: ShortLink[];
  isLoading: boolean;
  error: string | null;
  createShortLink: (url: string) => Promise<ShortLink>;
  fetchAllLinks: () => Promise<void>;
  clearError: () => void;
}
 
export const UrlShortenerContext = createContext<UrlShortenerContextType | undefined>(undefined);
 
export function UrlShortenerProvider({ children }: { children: ReactNode }) {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const createShortLink = useCallback(async (originalUrl: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newLink = await api.createShortLink(originalUrl);
      setShortLinks(prev => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create short link';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  const fetchAllLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const links = await api.getAllShortLinks();
      setShortLinks(links.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch links';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  const clearError = useCallback(() => {
    setError(null);
  }, []);
 
  const value = {
    shortLinks,
    isLoading,
    error,
    createShortLink,
    fetchAllLinks,
    clearError,
  };
 
  return (
    <UrlShortenerContext.Provider value={value}>
      {children}
    </UrlShortenerContext.Provider>
  );
}