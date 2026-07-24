import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${s.name} — ${s.role}`,
      template: `%s · ${s.name}`,
    },
    description: site.description,
    alternates: {
      types: {
        "application/rss+xml": [{ url: "/rss.xml", title: `${s.name} — Blog` }],
      },
    },
    openGraph: {
      title: `${s.name} — ${s.role}`,
      description: site.description,
      url: site.url,
      siteName: s.name,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(s.name)}&subtitle=${encodeURIComponent(s.role)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: s.name,
            jobTitle: s.role,
            url: site.url,
            email: s.email,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Lynnwood",
              addressRegion: "WA",
              addressCountry: "US",
            },
            sameAs: [s.githubUrl, s.linkedinUrl],
          }}
        />
        <Navbar siteName={s.name} socials={s.socials} />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={s.name}
          role={s.role}
          location={s.location}
          socials={s.socials}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
