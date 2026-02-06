import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth/auth-provider";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Boreas - Automatización WhatsApp para Pequeños Negocios",
    template: "%s | Boreas"
  },
  description: "Automatiza tu WhatsApp Business y duplica tus citas en 30 días. Solución especializada para salones de belleza, restaurantes y clínicas en México.",
  keywords: [
    "automatización whatsapp",
    "whatsapp business",
    "salón de belleza automatización",
    "restaurante reservas whatsapp",
    "clínica citas automáticas"
  ],
  authors: [{ name: "Boreas Team" }],
  creator: "Boreas",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://boreas.mx",
    siteName: "Boreas",
    title: "Boreas - Duplica tus citas con WhatsApp automático",
    description: "Salones aumentan 40% sus citas, restaurantes reducen 50% las llamadas. Automatización WhatsApp hecha simple.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boreas - Automatización WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automatiza WhatsApp y duplica tus citas - Boreas",
    description: "Casos reales: Salón Carmen +40% citas, Restaurante Miguel +60% reservas",
    images: ["/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        {/* PostHog Analytics Provider */}
        <PostHogProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}