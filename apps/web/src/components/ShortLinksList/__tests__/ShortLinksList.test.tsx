import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ShortLinksList from '../index';
import { UrlShortenerProvider } from '@/context/UrlShortenerContext';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <UrlShortenerProvider>
      {component}
    </UrlShortenerProvider>
  );
};

describe('ShortLinksList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state when no links exist', async () => {
    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      expect(screen.getByText('No links yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first shortened link above to get started')).toBeInTheDocument();
    });
  });

  it('should fetch and display links on mount', async () => {
    const mockLinks = [
      {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        id: 'def456',
        original_url: 'https://google.com',
        short_url: 'http://localhost:8080/shortlinks/def456',
        created_at: '2024-01-15T11:00:00Z',
      },
    ];

    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockResolvedValue(mockLinks);

    renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      expect(screen.getByText('Your Links')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
      expect(screen.getByText('https://google.com')).toBeInTheDocument();
    });
  });

  it('should display link count', async () => {
    const mockLinks = [
      {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockResolvedValue(mockLinks);

    renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });
  });

  it('should handle fetch error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Fetch failed'));

    renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch links:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('should render ShortLinkItem for each link', async () => {
    const mockLinks = [
      {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        id: 'def456',
        original_url: 'https://google.com',
        short_url: 'http://localhost:8080/shortlinks/def456',
        created_at: '2024-01-15T11:00:00Z',
      },
    ];

    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockResolvedValue(mockLinks);

    renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      expect(screen.getAllByText('Original:')).toHaveLength(2);
      expect(screen.getAllByText('Shortened:')).toHaveLength(2);
    });
  });

  it('should have gradient accent in header', async () => {
    const mockLinks = [
      {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    (api.getAllShortLinks as ReturnType<typeof vi.fn>).mockResolvedValue(mockLinks);

    const { container } = renderWithProvider(<ShortLinksList />);

    await waitFor(() => {
      const gradientBar = container.querySelector('.bg-gradient-to-b.from-cyan-500.to-emerald-500');
      expect(gradientBar).toBeInTheDocument();
    });
  });
});