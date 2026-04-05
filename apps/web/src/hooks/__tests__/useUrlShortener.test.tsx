import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUrlShortener } from '../useUrlShortener';
import { UrlShortenerProvider } from '@/context/UrlShortenerContext';
import { ReactNode } from 'react';
 
describe('useUrlShortener', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
 
    expect(() => {
      renderHook(() => useUrlShortener());
    }).toThrow('useUrlShortener must be used within UrlShortenerProvider');
 
    spy.mockRestore();
  });
 
  it('should return context when used within provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <UrlShortenerProvider>{children}</UrlShortenerProvider>
    );
 
    const { result } = renderHook(() => useUrlShortener(), { wrapper });
 
    expect(result.current).toBeDefined();
    expect(result.current.shortLinks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.createShortLink).toBe('function');
    expect(typeof result.current.fetchAllLinks).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });
});