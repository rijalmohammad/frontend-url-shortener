import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UrlShortenerForm from '../index';
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
 
describe('UrlShortenerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
 
  it('should render form with label and input', () => {
    renderWithProvider(<UrlShortenerForm />);
    
    expect(screen.getByText('Paste your long URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/example.com/)).toBeInTheDocument();
    expect(screen.getByText('Shorten Link')).toBeInTheDocument();
  });
 
  it('should show validation error for empty URL', async () => {
    renderWithProvider(<UrlShortenerForm />);
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    await waitFor(() => {
      expect(screen.getByText('URL is required')).toBeInTheDocument();
    });
  });
 
  it('should show validation error for invalid URL', async () => {
    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'invalid-url');
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    await waitFor(() => {
      expect(screen.getByText(/valid URL/)).toBeInTheDocument();
    });
  });
 
  it('should show checkmark for valid URL', async () => {
    const { container } = renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'https://example.com');
 
    await waitFor(() => {
      const checkIcon = container.querySelector('svg.text-emerald-500');
      expect(checkIcon).toBeInTheDocument();
    });
  });
 
  it('should NOT show checkmark for invalid URL', async () => {
    const { container } = renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'invalid-url');
 
    const checkIcon = container.querySelector('svg.text-emerald-500');
    expect(checkIcon).not.toBeInTheDocument();
  });
 
  it('should submit form and show success message', async () => {
    const mockLink = {
      id: 'abc123',
      original_url: 'https://example.com',
      short_url: 'http://localhost:8080/shortlinks/abc123',
      created_at: new Date().toISOString(),
    };
 
    (api.createShortLink as ReturnType<typeof vi.fn>).mockResolvedValue(mockLink);
 
    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'https://example.com');
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    await waitFor(() => {
      expect(screen.getByText('✨ Link shortened successfully!')).toBeInTheDocument();
      expect(screen.getByText(mockLink.short_url)).toBeInTheDocument();
    });
  });
 
  it('should clear input after successful submission', async () => {
    const mockLink = {
      id: 'abc123',
      original_url: 'https://example.com',
      short_url: 'http://localhost:8080/shortlinks/abc123',
      created_at: new Date().toISOString(),
    };
 
    (api.createShortLink as ReturnType<typeof vi.fn>).mockResolvedValue(mockLink);
 
    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/) as HTMLInputElement;
    await userEvent.type(input, 'https://example.com');
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
 
  it('should show loading state during submission', async () => {
    (api.createShortLink as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'https://example.com');
    
    const submitButton = screen.getByRole('button', { name: /Shorten Link/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
 
  it('should disable input during loading', async () => {
    (api.createShortLink as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
 
    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/) as HTMLInputElement;
    await userEvent.type(input, 'https://example.com');
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    expect(input).toBeDisabled();
  });
 
  it('should clear validation error when typing', async () => {
    renderWithProvider(<UrlShortenerForm />);
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);
 
    await waitFor(() => {
      expect(screen.getByText('URL is required')).toBeInTheDocument();
    });
 
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'h');
 
    expect(screen.queryByText('URL is required')).not.toBeInTheDocument();
  });
 
  it('should auto-hide success message after 5 seconds', async () => {
    const mockLink = {
      id: 'abc123',
      original_url: 'https://example.com',
      short_url: 'http://localhost:8080/shortlinks/abc123',
      created_at: new Date().toISOString(),
    };

    (api.createShortLink as ReturnType<typeof vi.fn>).mockResolvedValue(mockLink);

    renderWithProvider(<UrlShortenerForm />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/);
    await userEvent.type(input, 'https://example.com');
    
    const submitButton = screen.getByText('Shorten Link');
    fireEvent.click(submitButton);

    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText('✨ Link shortened successfully!')).toBeInTheDocument();
    });

    // Wait for the 5 second timeout to complete
    await new Promise(resolve => setTimeout(resolve, 5100));

    // Check that message is gone
    expect(screen.queryByText('✨ Link shortened successfully!')).not.toBeInTheDocument();
  }, 10000);
});