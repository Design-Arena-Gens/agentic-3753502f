import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agentic Blogger',
  description: 'Auto-generate and post blogs to Google Blogger',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
