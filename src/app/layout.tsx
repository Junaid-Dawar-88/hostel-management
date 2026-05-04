import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Sidebar from "./components/sidebar";
import { ThemeScript } from "./components/theme-toggle";
import { QueryProvider } from "@/lib/query-provider";
import { verifyJWT } from "@/lib/jwt";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hostel Management",
  description: "Admin dashboard for hostel operations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const warden = token ? await verifyJWT(token) : null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          {warden && <Sidebar warden={{ name: warden.name, email: warden.email }} />}
          <main className={warden ? "lg:ml-64 min-h-screen pt-14 lg:pt-0" : "min-h-screen"}>
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
