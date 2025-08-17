'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ErrorBoundary({
  error,
  reset,
  children,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-destructive dark:bg-destructive/10">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <Button
            variant="outline"
            onClick={() => reset()}
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
