// Mock API utilities
export const mockApiDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API response wrapper
export const mockApiResponse = <T>(data: T, delay: number = 1000): Promise<T> => {
  return mockApiDelay(delay).then(() => data);
};

// API configuration
export const API_CONFIG = {
  REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY || '',
  REMOVE_BG_API_URL: 'https://api.remove.bg/v1.0/removebg',
  HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY || '',
  HUGGING_FACE_API_URL: 'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
};

// API error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API request function
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      url
    );
  }
};
