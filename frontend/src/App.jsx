// src/App.jsx
import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuggestion("");
    setCopied(false);

    try {
      const response = await fetch("/api/ui-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Server responded with an error");

      const data = await response.json();
      setSuggestion(data.suggestion || "⚠️ No suggestion returned.");
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      setError("Failed to get response. Please check the server or try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "auto", padding: "2rem", fontFamily: "Arial" }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧠 AI UX Assistant</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          cols={70}
          placeholder="Describe the UI you want (e.g., 'a login form with email and password inputs')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          autoFocus
          required
          style={{ padding: "1rem", width: "100%", fontSize: "1rem" }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {loading ? "Generating..." : "Generate UI"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {suggestion && (
        <div style={{ marginTop: "2rem" }} aria-live="polite">
          <h3>🧩 Generated Suggestion:</h3>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              borderRadius: "5px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            <code>{suggestion}</code>
          </pre>
          <button
            onClick={copyToClipboard}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
