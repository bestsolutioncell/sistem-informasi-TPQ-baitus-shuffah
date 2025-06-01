import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import NotificationProvider from '@/contexts/NotificationContext';
import NavigationProvider from '@/components/providers/NavigationProvider';
import AuthProvider from '@/components/providers/AuthProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rumah Tahfidz - Sistem Informasi Manajemen",
  description: "Sistem Informasi Manajemen Rumah Tahfidz yang modern dan terintegrasi untuk mengelola santri, hafalan, absensi, dan keuangan.",
  keywords: "rumah tahfidz, sistem informasi, manajemen santri, hafalan quran, islamic boarding school",
  authors: [{ name: "Rumah Tahfidz Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Rumah Tahfidz - Sistem Informasi Manajemen",
    description: "Sistem Informasi Manajemen Rumah Tahfidz yang modern dan terintegrasi",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#008080" />
      </head>
      <body
        className={`${inter.variable} ${amiri.variable} min-h-screen bg-gray-50 font-sans antialiased`}
      >
        <AuthProvider>
          <NavigationProvider>
            <NotificationProvider>
              <div id="root">
                {children}
              </div>
          <div id="modal-root" />
          <div id="toast-root" />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '14px',
                maxWidth: '400px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
            </NotificationProvider>
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
