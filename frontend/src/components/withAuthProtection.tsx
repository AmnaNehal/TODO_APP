import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

// Higher-order component for protecting routes that require authentication
export function withAuthProtection<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { session, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !session) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    }, [session, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    // Only render the component if the user is authenticated
    if (!session) {
      return null; // Will be redirected by the effect above
    }

    return <Component {...props} />;
  };
}