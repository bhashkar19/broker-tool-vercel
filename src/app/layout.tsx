import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FacebookPixelInit from "@/components/FacebookPixelInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Your Perfect Trading Broker in 60 Seconds | Free Personalized Recommendations",
  description: "Sick of high brokerage fees? Bad trading tools? Poor customer support? Get a free personalized broker recommendation based on your trading style. Compare Zerodha, Angel One, Upstox, Groww & more.",
  keywords: "best trading broker India, lowest brokerage charges, broker comparison, Zerodha vs Angel One, stock broker recommendation, trading platform review",

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "Find Your Perfect Trading Broker in 60 Seconds",
    description: "Answer 5 quick questions and discover which broker matches your trading needs. Free personalized recommendations.",
    url: "https://findbroker.paisowala.com",
    siteName: "FindBroker by Paisowala",
    images: [
      {
        url: "https://findbroker.paisowala.com/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "FindBroker - Get Your Perfect Trading Broker Match"
      }
    ],
    locale: "en_IN",
    type: "website"
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Find Your Perfect Trading Broker in 60 Seconds",
    description: "Answer 5 quick questions and discover which broker matches your trading needs.",
    images: ["https://findbroker.paisowala.com/og-image.png"]
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimization - Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Facebook Domain Verification - Add when you have the code */}
        {/* <meta name="facebook-domain-verification" content="your_verification_code_here" /> */}

        {/* Google Analytics 4 - G-VWS8RVQ18T */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VWS8RVQ18T"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VWS8RVQ18T', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Facebook Pixel - Only loads when properly configured */}
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID &&
         process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID !== 'YOUR_PIXEL_ID' &&
         process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID !== 'your_facebook_pixel_id_here' && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                `,
              }}
            />
            <noscript>
              <img
                height={1}
                width={1}
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookPixelInit />
        {children}
      </body>
    </html>
  );
}
