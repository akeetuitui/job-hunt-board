
/**
 * Security utilities for input validation and sanitization
 */

// XSS protection - sanitize HTML content
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Remove script tags and other dangerous HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Validate URLs to prevent malicious links
export const validateUrl = (url: string): boolean => {
  if (!url) return true; // Allow empty URLs
  
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Input length validation
export const validateLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};

// Company name validation
export const validateCompanyName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: '회사명을 입력해주세요.' };
  }
  
  if (!validateLength(name, 200)) {
    return { isValid: false, error: '회사명은 200자를 초과할 수 없습니다.' };
  }
  
  const sanitized = sanitizeHtml(name);
  if (sanitized !== name) {
    return { isValid: false, error: '허용되지 않는 문자가 포함되어 있습니다.' };
  }
  
  return { isValid: true };
};

// Position validation
export const validatePosition = (position: string): { isValid: boolean; error?: string } => {
  if (!position.trim()) {
    return { isValid: false, error: '직무를 입력해주세요.' };
  }
  
  if (!validateLength(position, 200)) {
    return { isValid: false, error: '직무는 200자를 초과할 수 없습니다.' };
  }
  
  const sanitized = sanitizeHtml(position);
  if (sanitized !== position) {
    return { isValid: false, error: '허용되지 않는 문자가 포함되어 있습니다.' };
  }
  
  return { isValid: true };
};

// Description validation
export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (!validateLength(description, 2000)) {
    return { isValid: false, error: '설명은 2000자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
};

// Application link validation
export const validateApplicationLink = (url: string): { isValid: boolean; error?: string } => {
  if (!url) return { isValid: true }; // Allow empty URLs
  
  if (!validateUrl(url)) {
    return { isValid: false, error: '올바른 URL 형식이 아닙니다. (http:// 또는 https://로 시작해야 함)' };
  }
  
  return { isValid: true };
};

// Cover letter content validation
export const validateCoverLetterContent = (content: string): { isValid: boolean; error?: string } => {
  if (!validateLength(content, 10000)) {
    return { isValid: false, error: '자기소개서 내용은 10,000자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
};

// Rate limiting for API calls (simple client-side implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the time window
    const recentRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter();

// Security headers for API requests
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
});

// Secure session storage
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to store item securely:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item securely:', error);
    }
  }
};
