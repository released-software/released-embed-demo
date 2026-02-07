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
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const colors = theme === "dark" ? darkColors : lightColors;

  if (loading) {
    return (
      <div style={{ ...styles.loadingContainer, backgroundColor: colors.bg }}>
        <div style={{ ...styles.spinner, borderColor: colors.spinnerBg, borderTopColor: colors.spinnerFg }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.errorContainer, backgroundColor: colors.bg }}>
        <p style={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  const channelId = process.env.NEXT_PUBLIC_RELEASED_CHANNEL_ID;

  return (
    <div style={{ ...styles.container, backgroundColor: colors.bg }}>
      <nav className="nav-container" style={styles.nav}>
        <a href="https://released.so" target="_blank" rel="noopener noreferrer">
          <img
            src={theme === "dark" ? "/released-logo.svg" : "/released-logo-dark.svg"}
            alt="Released"
            className="nav-logo"
            style={styles.logo}
          />
        </a>
        <div className="nav-links" style={styles.navLinks}>
          <a
            href="https://docs.released.so/guide/getting-started/setup-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="doc-link"
            style={{ ...styles.docLink, color: colors.mutedText }}
          >
            Documentation
          </a>
          <a
            href="https://github.com/released-software/released-embed-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="github-button"
            style={{ ...styles.githubButton, backgroundColor: colors.buttonBg, color: colors.buttonText }}
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
          <button
            onClick={toggleTheme}
            style={{ ...styles.themeToggle, backgroundColor: colors.toggleBg, color: colors.toggleText }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <header className="hero-section" style={styles.hero}>
        <p style={{ ...styles.greeting, color: colors.mutedText }}>Welcome back, {currentUser.name}</p>
        <h1 style={{ ...styles.headline, color: colors.text }}>
          Embed <span style={styles.gradientText}>Demo</span>
        </h1>
        <p className="hero-subtitle" style={{ ...styles.subtitle, color: colors.mutedText }}>
          You're viewing this as John Doe—a demo user automatically authenticated via server-side token. No login required.
        </p>
      </header>

      <main style={styles.main}>
        {token && (
          <released-page 
            channel-id={channelId} 
            auth-token={token} 
            color-scheme={theme}
            style={{ width: "100%", minHeight: "800px" }}
          ></released-page>
        )}
      </main>
    </div>
  );
}

const darkColors = {
  bg: "#000000",
  text: "#ffffff",
  mutedText: "#888888",
  buttonBg: "#ffffff",
  buttonText: "#000000",
  toggleBg: "#333333",
  toggleText: "#ffffff",
  spinnerBg: "#333333",
  spinnerFg: "#ffffff",
};

const lightColors = {
  bg: "#ffffff",
  text: "#000000",
  mutedText: "#666666",
  buttonBg: "#000000",
  buttonText: "#ffffff",
  toggleBg: "#e5e5e5",
  toggleText: "#000000",
  spinnerBg: "#e5e5e5",
  spinnerFg: "#000000",
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    transition: "background-color 0.3s ease",
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
    cursor: "pointer",
  },
  themeToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  githubButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "background-color 0.2s, color 0.2s",
    cursor: "pointer",
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
