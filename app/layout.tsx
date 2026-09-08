import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer, Header, ThemeProvider, TipJar } from "@/components";

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
  title: {
    default:
      "OffLimits | Free Online Party Games for Groups (No Download)",
    template: "%s · OffLimits",
  },
  description:
    "Play uncensored party games, rapid-fire trivia, and drinking games instantly on any phone. Zero app download, zero signup.",
  keywords: [
    "OffLimits party game",
    "play offlimits online",
    "free party games for groups",
    "phone party games no download",
    "house party icebreaker games",
  ],
};

// Applies the saved theme (default: dark) before first paint to avoid a flash.
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
        <ThemeProvider>
          <Header />
          {children}
          <TipJar />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
