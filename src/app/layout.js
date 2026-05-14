import './globals.css'

export const metadata = {
    title: 'Pocket Monster Database',
    description: 'A Next.js application using PokeAPI',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-gray-100">{children}</body>
        </html>
    )
}