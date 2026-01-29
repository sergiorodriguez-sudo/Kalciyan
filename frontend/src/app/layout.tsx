import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SGI Kalciyan',
    description: 'Sistema de Gestión Integrado - Assistant',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
                    {children}
                </main>
            </body>
        </html>
    )
}
