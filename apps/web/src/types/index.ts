export interface ShortLink {
  id: string;
  original_url: string;
  short_url: string;
  created_at: string;
}
 
export interface CreateShortLinkRequest {
  original_url: string;
}
 
export interface CreateShortLinkResponse {
  id: string;
  original_url: string;
  short_url: string;
  created_at: string;
}
 
export interface ErrorResponse {
  error: string;
}