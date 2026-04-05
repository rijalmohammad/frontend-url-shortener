export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
 
export const validateUrl = (url: string): string | null => {
  if (!url.trim()) {
    return 'URL is required';
  }
 
  if (!isValidUrl(url)) {
    return 'Please enter a valid URL (must start with http:// or https://)';
  }
 
  return null;
};