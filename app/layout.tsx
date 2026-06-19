import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Food Tracker Dashboard',
  description: 'Track daily food product quantities across June-July 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
