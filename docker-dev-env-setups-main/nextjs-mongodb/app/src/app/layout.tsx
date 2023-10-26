import { Navbar } from '@/components/nav-bar/navbar';
import './globals.css'
import { Inter } from 'next/font/google'
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NextJs',
  description: 'Template project',
}

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
