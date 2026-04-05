import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShortLinkItem from '../index';
import { ShortLink } from '@/types';
 
// Mock qrcode.react
vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ id, value }: { id: string; value: string }) => (
    <svg data-testid="qr-code" id={id} data-value={value} />
  ),
}));
 
describe('ShortLinkItem', () => {
  const mockLink: ShortLink = {
    id: 'abc123',
    original_url: 'https://example.com/very/long/url',
    short_url: 'http://localhost:8080/shortlinks/abc123',
    created_at: '2024-01-15T10:30:00Z',
  };
 
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
 
    vi.stubGlobal('open', vi.fn());
  });
 
  it('should render link details with inline labels', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    expect(screen.getByText('Original:')).toBeInTheDocument();
    expect(screen.getByText(mockLink.original_url)).toBeInTheDocument();
    expect(screen.getByText('Shortened:')).toBeInTheDocument();
    expect(screen.getByText(mockLink.short_url)).toBeInTheDocument();
  });
 
  it('should copy short URL to clipboard when copy button is clicked', async () => {
    render(<ShortLinkItem link={mockLink} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    fireEvent.click(copyButton);
 
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockLink.short_url);
    });
  });
 
  it('should show checkmark icon after copying', async () => {
    const { container } = render(<ShortLinkItem link={mockLink} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    fireEvent.click(copyButton);

    await waitFor(() => {
      const checkIcon = container.querySelector('svg.text-emerald-600');
      expect(checkIcon).toBeInTheDocument();
    });
  });

  it('should reset copy state after 2 seconds', async () => {
    const { container } = render(<ShortLinkItem link={mockLink} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    fireEvent.click(copyButton);

    await waitFor(() => {
      const checkIcon = container.querySelector('svg.text-emerald-600');
      expect(checkIcon).toBeInTheDocument();
    });

    // Wait for the 2 second timeout to complete
    await new Promise(resolve => setTimeout(resolve, 2100));

    const checkIcon = container.querySelector('svg.text-emerald-600');
    expect(checkIcon).not.toBeInTheDocument();
  });
 
  it('should open link in new tab when open button is clicked', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    const openButton = screen.getByTitle('Open link');
    fireEvent.click(openButton);
 
    expect(window.open).toHaveBeenCalledWith(mockLink.short_url, '_blank');
  });
 
  it('should toggle QR code visibility', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    const qrButton = screen.getByTitle('Show QR Code');
    
    // QR code should not be visible initially
    expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
    
    // Click to show QR code
    fireEvent.click(qrButton);
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    
    // Click to hide QR code
    fireEvent.click(qrButton);
    expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
  });
 
  it('should render QR code with correct props', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    const qrButton = screen.getByTitle('Show QR Code');
    fireEvent.click(qrButton);

    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toHaveAttribute('id', `qr-${mockLink.id}`);
    expect(qrCode).toHaveAttribute('data-value', mockLink.short_url);
  });
 
  it('should format creation date in Indonesian locale', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    // Should contain date elements
    const dateText = screen.getByText(/15/);
    expect(dateText).toBeInTheDocument();
  });
 
  it('should have gradient background for short URL box', () => {
    const { container } = render(<ShortLinkItem link={mockLink} />);
    
    const shortUrlBox = container.querySelector('.bg-gradient-to-r.from-cyan-50.to-emerald-50');
    expect(shortUrlBox).toBeInTheDocument();
  });
 
  it('should display all action buttons', () => {
    render(<ShortLinkItem link={mockLink} />);
    
    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
    expect(screen.getByTitle('Open link')).toBeInTheDocument();
    expect(screen.getByTitle('Show QR Code')).toBeInTheDocument();
  });
 
  it('should handle copy error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Override the beforeEach clipboard mock with one that rejects
    const writeTextMock = vi.fn(() => Promise.reject(new Error('Copy failed')));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ShortLinkItem link={mockLink} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});