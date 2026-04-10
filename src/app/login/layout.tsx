import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { AuthProvider } from "@/components/AuthProvider"
import "../globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sign In — CFA OS",
  description: "Sign in to your CFA OS study account",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
