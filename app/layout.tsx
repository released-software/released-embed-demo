import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Released Embed Example",
  description: "Demo of Released embed integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://embed-staging.released.so/1/embed.js"
          strategy="beforeInteractive"
        />
        <style>{`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #000000;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
