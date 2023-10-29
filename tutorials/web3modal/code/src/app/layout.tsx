import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import './globals.css'
import { Web3Modal } from '../context/Web3Modal'

export const metadata: Metadata = {
  title: 'Web3Modal & zkSync',
  description: 'Web3Modal & zkSync Tutorial',
}

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang='en'>
      <body>
        <Web3Modal>
          {children}
        </Web3Modal>
      </body>
    </html>
  )
}