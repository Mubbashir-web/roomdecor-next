import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  title: 'RoomAI - Free AI Room Decorator | Transform Your Room Instantly',
  description: 'Upload your room photo and let AI decorate it for free! Get instant interior design suggestions for modern, classic, minimalist and bohemian styles.',
  keywords: 'room decorator, AI room design, interior design, free room makeover, home decor AI, room transformation',
  openGraph: {
    title: 'RoomAI - Free AI Room Decorator',
    description: 'Transform your room with AI for free!',
    type: 'website',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={poppins.className}>{children}</body>
      
    </html>
  )
}