import { CreateShortLinkRequest, CreateShortLinkResponse, ShortLink } from '@/types';
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
 
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
 
export const api = {
  async createShortLink(originalUrl: string): Promise<CreateShortLinkResponse> {
    const response = await fetch(`${API_BASE_URL}/api/shortlinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: originalUrl } as CreateShortLinkRequest),
    });
 
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create short link' }));
      throw new ApiError(response.status, error.error || 'Failed to create short link');
    }
 
    return response.json();
  },
 
  async getShortLink(id: string): Promise<ShortLink> {
    const response = await fetch(`${API_BASE_URL}/api/shortlinks/${id}`);
 
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Short link not found' }));
      throw new ApiError(response.status, error.error || 'Short link not found');
    }
 
    return response.json();
  },
 
  async getAllShortLinks(): Promise<ShortLink[]> {
    const response = await fetch(`${API_BASE_URL}/api/shortlinks`);
 
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch short links' }));
      throw new ApiError(response.status, error.error || 'Failed to fetch short links');
    }
 
    return response.json();
  },
};