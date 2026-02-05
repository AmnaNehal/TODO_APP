// Mock authentication implementation with Better Auth compatible interface
// In a real application, this would connect to your authentication API

// Mock auth client that matches Better Auth interface
export const authClient = {
  signIn: {
    email: async (credentials: { email: string; password: string; callbackURL?: string }) => {
      // Simulate API call to backend for authentication
      try {
        // Make request to backend login endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store the JWT token
          localStorage.setItem('auth-token', data.access_token);
          localStorage.setItem('user-id', data.user.id);
          localStorage.setItem('user-email', credentials.email);
          localStorage.setItem('user-name', credentials.email.split('@')[0]);

          // Redirect if callbackURL is provided
          if (credentials.callbackURL) {
            window.location.href = credentials.callbackURL;
          }

          return { data: { user: data.user }, error: null };
        } else {
          const errorData = await response.json();
          return { data: null, error: { message: errorData.detail || 'Login failed' } };
        }
      } catch (error) {
        return { data: null, error: { message: 'Network error occurred' } };
      }
    },
  },
  signUp: {
    email: async (credentials: { email: string; password: string; name: string; callbackURL?: string }) => {
      // Simulate API call to backend for registration
      try {
        // Make request to backend register endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store the JWT token
          localStorage.setItem('auth-token', data.access_token);
          localStorage.setItem('user-id', data.user.id);
          localStorage.setItem('user-email', credentials.email);
          localStorage.setItem('user-name', credentials.name);

          // Redirect if callbackURL is provided
          if (credentials.callbackURL) {
            window.location.href = credentials.callbackURL;
          }

          return { data: { user: data.user }, error: null };
        } else {
          const errorData = await response.json();
          return { data: null, error: { message: errorData.detail || 'Registration failed' } };
        }
      } catch (error) {
        return { data: null, error: { message: 'Network error occurred' } };
      }
    },
  },
  signOut: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-id');
      localStorage.removeItem('user-email');
      localStorage.removeItem('user-name');

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  },
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  // Check if there's a token in localStorage
  const token = localStorage.getItem('auth-token');
  return !!token && token.length > 0;
};

// Helper function to get user session
export const getUserSession = async () => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    // In a real implementation, you'd decode the JWT or make an API call to get user info
    return {
      user: {
        id: localStorage.getItem('user-id') || 'mock-user-id',
        email: localStorage.getItem('user-email') || 'mock@example.com',
        name: localStorage.getItem('user-name') || 'Mock User',
      },
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
  }
  return null;
};

// Individual helper functions for backward compatibility
export const signIn = async (email: string, password: string) => {
  try {
    // Make request to backend login endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store the JWT token
      localStorage.setItem('auth-token', data.access_token);
      localStorage.setItem('user-id', data.user.id);
      localStorage.setItem('user-email', email);
      localStorage.setItem('user-name', email.split('@')[0]);

      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-name');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

// Export types
export type UserSession = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  expiresAt: Date;
};