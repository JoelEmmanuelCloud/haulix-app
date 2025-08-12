import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CredentialsProvider from 'next-auth/providers/credentials';

// NextAuth configuration options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@haulix.delivery',
            role: 'admin'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url.startsWith('/admin/login') && url.includes('callbackUrl')) {
        return `${baseUrl}/admin/dashboard`;
      }
      
      // Redirect to admin dashboard by default
      if (url === '/admin' || url === '/admin/') {
        return `${baseUrl}/admin/dashboard`;
      }
      
      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

// Server-side auth check
export async function getSession() {
  return await getServerSession(authOptions);
}

// Check if user is authenticated admin
export async function isAuthenticated() {
  const session = await getSession();
  return session?.user?.role === 'admin';
}

// Protect admin routes (use in server components)
export async function requireAuth() {
  const session = await getSession();
  
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }
  
  return session;
}

// Client-side auth utilities
export const authUtils = {
  // Check if user is logged in (client-side)
  isLoggedIn: (session) => {
    return session?.user?.role === 'admin';
  },
  
  // Get user info from session
  getUser: (session) => {
    return session?.user || null;
  },
  
  // Check admin permissions
  isAdmin: (session) => {
    return session?.user?.role === 'admin';
  }
};

// Middleware helper for API routes
export function withAuth(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Add session to request object
    req.session = session;
    return handler(req, res);
  };
}

// Password validation utility
export function validateAdminPassword(password) {
  return password === process.env.ADMIN_PASSWORD;
}

// Generate secure session token
export function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Session management utilities
export const sessionUtils = {
  // Create session data
  createSession: (user) => ({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }),
  
  // Validate session expiry
  isSessionValid: (session) => {
    if (!session || !session.expires) return false;
    return new Date() < new Date(session.expires);
  },
  
  // Refresh session
  refreshSession: (session) => ({
    ...session,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  })
};

// Error handlers for auth
export const authErrors = {
  INVALID_CREDENTIALS: 'Invalid password. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  MISSING_PASSWORD: 'Password is required.',
  INVALID_SESSION: 'Invalid session. Please log in again.'
};

// Rate limiting for login attempts (simple in-memory store)
const loginAttempts = new Map();

export function checkRateLimit(identifier) {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || [];
  
  // Remove attempts older than 15 minutes
  const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);
  
  // Allow max 5 attempts per 15 minutes
  if (recentAttempts.length >= 5) {
    return {
      allowed: false,
      resetTime: Math.min(...recentAttempts) + 15 * 60 * 1000
    };
  }
  
  // Add current attempt
  recentAttempts.push(now);
  loginAttempts.set(identifier, recentAttempts);
  
  return {
    allowed: true,
    attemptsLeft: 5 - recentAttempts.length
  };
}

// Clear rate limit for identifier
export function clearRateLimit(identifier) {
  loginAttempts.delete(identifier);
}

// Audit logging for authentication events
export function logAuthEvent(event, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };
  
  // In production, you'd want to send this to a proper logging service
  console.log('[AUTH]', JSON.stringify(logEntry));
}

export default authOptions;