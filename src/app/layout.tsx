import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neo4jサンプルApp',
  description: 'Next.js 15とNeo4jを使ったユーザー間の関係性可視化アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <div className="min-h-screen">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      ユーザー関係性アプリ
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Neo4j + Next.js 15 デモアプリケーション
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      powered by Neo4j
                    </span>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            
            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-sm text-gray-500">
                  Neo4j Driver + Next.js 15 を使ったシンプルなユーザー関係性管理アプリ
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
} 