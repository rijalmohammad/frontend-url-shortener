import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, ApiError } from '../api';
 
const mockFetch = vi.fn();
global.fetch = mockFetch;
 
describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });
 
  afterEach(() => {
    vi.clearAllMocks();
  });
 
  describe('createShortLink', () => {
    it('should create a short link successfully', async () => {
      const mockResponse = {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      };
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
 
      const result = await api.createShortLink('https://example.com');
 
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/shortlinks',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ original_url: 'https://example.com' }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
 
    it('should throw ApiError on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid URL' }),
      });

      await expect(api.createShortLink('invalid')).rejects.toThrow(ApiError);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid URL' }),
      });

      await expect(api.createShortLink('invalid')).rejects.toThrow('Invalid URL');
    });
 
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
 
      await expect(api.createShortLink('https://example.com')).rejects.toThrow('Network error');
    });
  });
 
  describe('getShortLink', () => {
    it('should fetch a short link by ID', async () => {
      const mockResponse = {
        id: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8080/shortlinks/abc123',
        created_at: '2024-01-15T10:30:00Z',
      };
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
 
      const result = await api.getShortLink('abc123');
 
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/shortlinks/abc123');
      expect(result).toEqual(mockResponse);
    });
 
    it('should throw ApiError when link not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Short link not found' }),
      });

      await expect(api.getShortLink('invalid')).rejects.toThrow(ApiError);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Short link not found' }),
      });

      await expect(api.getShortLink('invalid')).rejects.toThrow('Short link not found');
    });
  });
 
  describe('getAllShortLinks', () => {
    it('should fetch all short links', async () => {
      const mockResponse = [
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
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
 
      const result = await api.getAllShortLinks();
 
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/shortlinks');
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
    });
 
    it('should return empty array when no links exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
 
      const result = await api.getAllShortLinks();
      expect(result).toEqual([]);
    });
 
    it('should throw ApiError on server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });
 
      await expect(api.getAllShortLinks()).rejects.toThrow(ApiError);
    });
  });
 
  describe('ApiError', () => {
    it('should create ApiError with status and message', () => {
      const error = new ApiError(404, 'Not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.name).toBe('ApiError');
    });
  });
});
