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

  // Keep the page title fixed (prevent embed from changing it)
  useEffect(() => {
    document.title = "Released Embed Example";
    const observer = new MutationObserver(() => {
      if (document.title !== "Released Embed Example") {
        document.title = "Released Embed Example";
      }
    });
    const titleElement = document.querySelector("title");
    if (titleElement) {
      observer.observe(titleElement, { childList: true });
    }
    return () => observer.disconnect();
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
        <a href="https://released.so" target="_blank" rel="noopener noreferrer">
          <img
            src="/released-logo.svg"
            alt="Released"
            style={styles.logo}
          />
        </a>
        <div style={styles.navLinks}>
          <a
            href="https://docs.released.so/guide/getting-started/setup-guide"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.docLink}
          >
            Documentation
          </a>
          <a
            href="https://github.com/released-software/released-embed-demo"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.githubButton}
          >
            <svg
              height="20"
              width="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ marginRight: "8px" }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  docLink: {
    color: "#888888",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  },
  githubButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    color: "#000000",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "background-color 0.2s",
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
