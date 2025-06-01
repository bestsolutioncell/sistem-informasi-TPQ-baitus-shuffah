import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
// import { UserRole } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Mock user data for testing
        const mockUsers = [
          {
            id: '1',
            email: 'admin@rumahtahfidz.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Administrator',
            role: 'ADMIN',
            avatar: null
          },
          {
            id: '2',
            email: 'musyrif@rumahtahfidz.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Ustadz Abdullah',
            role: 'MUSYRIF',
            avatar: null
          },
          {
            id: '3',
            email: 'wali@rumahtahfidz.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Bapak Ahmad',
            role: 'WALI',
            avatar: null
          }
        ];

        const user = mockUsers.find(u => u.email === credentials.email);

        if (!user) {
          return null;
        }

        // For demo purposes, accept 'password' as password
        const isPasswordValid = credentials.password === 'password' ||
          await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    role: UserRole;
    avatar?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      avatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    avatar?: string;
  }
}
