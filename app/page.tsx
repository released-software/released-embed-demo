"use client";

import { useEffect, useState } from "react";

// Mock user - in a real app, get this from your auth context
const currentUser = {
  name: "John Doe",
  avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/released-token", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  const channelId = process.env.NEXT_PUBLIC_RELEASED_CHANNEL_ID;

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <img
          src="/released-logo.svg"
          alt="Released"
          style={styles.logo}
        />
      </nav>

      <header style={styles.hero}>
        <p style={styles.greeting}>Welcome back, {currentUser.name}</p>
        <h1 style={styles.headline}>
          Embed <span style={styles.gradientText}>Demo</span>
        </h1>
        <p style={styles.subtitle}>
This site shows how to embed a Released portal and implement your own user verification, enabling users to access it without needing to log in.
        </p>
      </header>

      <main style={styles.main}>
        {token && (
          <released-page 
            channel-id={channelId} 
            auth-token={token} 
            color-scheme="dark"
            style={{ width: "100%", minHeight: "800px" }}
          ></released-page>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000000",
  },
  nav: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px 24px",
  },
  logo: {
    height: "80px",
    width: "auto",
  },
  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 24px 80px",
    textAlign: "center" as const,
  },
  greeting: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "500",
    color: "#888888",
    letterSpacing: "0.5px",
  },
  headline: {
    margin: "0",
    fontSize: "clamp(48px, 10vw, 80px)",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.03em",
    lineHeight: "1.1",
  },
  gradientText: {
    background: "linear-gradient(135deg, #ff0080, #7928ca, #ff0080)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    margin: "24px auto 0",
    fontSize: "20px",
    fontWeight: "400",
    color: "#888888",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  main: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#000000",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "2px solid #333333",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#000000",
  },
  errorText: {
    color: "#ff6369",
    fontSize: "14px",
    padding: "12px 20px",
    backgroundColor: "rgba(255, 99, 105, 0.1)",
    borderRadius: "6px",
    border: "1px solid rgba(255, 99, 105, 0.2)",
  },
};

// TypeScript declaration for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "released-page": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "channel-id"?: string;
          "auth-token"?: string;
          "color-scheme"?: string;
        },
        HTMLElement
      >;
    }
  }
}
