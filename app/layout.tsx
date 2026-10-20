import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Footer, Header, ThemeProvider, TipJar } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION_JSON_LD } from "@/lib/site";

const GA_ID = "G-ZVT3JPNBLF";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://playofflimits.com"),
  title: {
    default:
      "OffLimits | Free Online Party Games for Groups (No Download)",
    template: "%s | OffLimits",
  },
  description:
    "Free party games for any group on any phone: Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades and more. No download, no signup.",
  keywords: [
    "free party games",
    "would you rather questions",
    "never have i ever questions",
    "truth or dare online",
    "OffLimits party game",
    "play offlimits online",
    "free party games for groups",
    "phone party games no download",
    "house party icebreaker games",
  ],
  openGraph: {
    title:
      "OffLimits | Free Online Party Games for Groups (No Download)",
    description:
      "Free party games for any group on any phone: Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades and more. No download, no signup.",
    url: "https://playofflimits.com",
    siteName: "OffLimits",
    images: [
      {
        url: "/og-image.png?v=3",
        width: 1200,
        height: 630,
        alt: "OffLimits Party Games Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "OffLimits | Free Online Party Games for Groups (No Download)",
    description:
      "Free party games for any group on any phone: Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades and more. No download, no signup.",
    images: ["/og-image.png?v=3"],
  },
};

// Applies the saved theme (default: dark) before first paint to avoid a flash.
// Sets up gtag() and the dataLayer right away so early events queue up; the
// gtag.js library itself loads after the page is idle (lazyOnload).
const gaInitScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`;

const noFlashScript = `(function(){try{var t=localStorage.getItem('antics-theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';var p=localStorage.getItem('offlimits_party_theme');if(p&&p!=='default'&&['velvet','crimson','midnight'].indexOf(p)>-1){document.documentElement.setAttribute('data-party',p);}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <ThemeProvider>
          <Header />
          {children}
          <TipJar />
          <Footer />
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{ __html: gaInitScript }} />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
