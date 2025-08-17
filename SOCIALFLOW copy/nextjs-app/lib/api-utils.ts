import { toast } from '@/components/ui/use-toast';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data
    );
  }
  
  return data as T;
}

export function handleApiError(error: unknown, defaultMessage = 'An error occurred') {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  let title = 'Error';
  
  if (error instanceof ApiError) {
    message = error.message || defaultMessage;
    
    if (error.status === 401) {
      title = 'Unauthorized';
      message = 'Please sign in to continue';
      // Optionally redirect to login
      // window.location.href = '/login';
    } else if (error.status === 403) {
      title = 'Forbidden';
      message = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      title = 'Not Found';
      message = 'The requested resource was not found';
    } else if (error.status >= 500) {
      title = 'Server Error';
      message = 'Something went wrong on our end. Please try again later.';
    }
  } else if (error instanceof Error) {
    message = error.message || defaultMessage;
  }
  
  toast({
    title,
    description: message,
    variant: 'destructive',
  });
  
  return message;
}
