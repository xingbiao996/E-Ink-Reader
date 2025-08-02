import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/Header'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '电子墨水阅读器',
  description: '一个为Kindle电子墨水浏览器优化的网页阅读平台。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="sticky bottom-0 w-full bg-background/95 p-2 border-t backdrop-blur">
             <div className="container mx-auto max-w-6xl flex justify-center">
                 <Button asChild variant="ghost">
                    <Link href="/">
                        <Home className="w-5 h-5 mr-2" />
                        返回书架
                    </Link>
                </Button>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
