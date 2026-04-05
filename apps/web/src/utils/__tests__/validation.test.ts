import { describe, it, expect } from 'vitest';
import { isValidUrl, validateUrl } from '../validation';
 
describe('Validation Utils', () => {
  describe('isValidUrl', () => {
    it('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://www.example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
    });
 
    it('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
    });
 
    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
    });
 
    it('should return false for non-HTTP(S) protocols', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
      expect(isValidUrl('mailto:test@example.com')).toBe(false);
    });
 
    it('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });
 
    it('should return false for whitespace-only string', () => {
      expect(isValidUrl('   ')).toBe(false);
    });
  });
 
  describe('validateUrl', () => {
    it('should return error message for empty URL', () => {
      expect(validateUrl('')).toBe('URL is required');
    });
 
    it('should return error message for whitespace-only URL', () => {
      expect(validateUrl('   ')).toBe('URL is required');
    });
 
    it('should return error message for invalid URL format', () => {
      const result = validateUrl('invalid-url');
      expect(result).toContain('valid URL');
      expect(result).toContain('http://');
    });
 
    it('should return error message for URL without protocol', () => {
      const result = validateUrl('example.com');
      expect(result).toContain('valid URL');
    });
 
    it('should return null for valid HTTP URL', () => {
      expect(validateUrl('http://example.com')).toBeNull();
    });
 
    it('should return null for valid HTTPS URL', () => {
      expect(validateUrl('https://example.com')).toBeNull();
      expect(validateUrl('https://www.example.com/path')).toBeNull();
    });
 
    it('should handle URLs with query parameters', () => {
      expect(validateUrl('https://example.com?param=value')).toBeNull();
    });
 
    it('should handle URLs with fragments', () => {
      expect(validateUrl('https://example.com#section')).toBeNull();
    });
  });
});
