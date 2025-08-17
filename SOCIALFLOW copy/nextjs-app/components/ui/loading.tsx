import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingPage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-screen w-full items-center justify-center bg-background',
        className
      )}
      {...props}
    >
      <LoadingSpinner className="h-12 w-12" />
    </div>
  );
}

export function LoadingButton({
  isLoading,
  loadingText = 'Loading...',
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
        'transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="h-4 w-4" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
