import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WellGuide Health Management",
  description: "Next.js Health Management System",
};

// export default function RootLayout
// (
// {
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard
  {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <html lang="en">
          <body className={inter.className}>
            {children} <ToastContainer position="bottom-right" theme="dark" />
          </body>
        </html>
      </ClerkProvider>
    );
  }
}
