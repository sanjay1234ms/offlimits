"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ opacity: 0.7, maxWidth: "28rem" }}>
          A critical error occurred. {error?.digest ? `(${error.digest})` : null}
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "0.75rem",
            border: "1px solid currentColor",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
