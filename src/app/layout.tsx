import Header from "@/components/Header"
import "./globals.css"
import { Providers } from "./providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-full bg-sky-300 ">
        <Header />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
