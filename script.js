import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const STORAGE_KEY = "simple-input-store:entries";

function loadEntries() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.text === "string");
  } catch (err) {
    return [];
  }
}

function saveEntries(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    // Storage may be unavailable (private mode, quota). Fail silently.
  }
}

function App() {
  const [entries, setEntries] = useState(loadEntries);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter some text before saving.");
      return;
    }
    const nextEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [nextEntry, ...prev]);
    setValue("");
    setError("");
  };

  const handleClearAll = () => {
    setEntries([]);
  };

  const handleRemove = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main style={styles.page}>
      <section style={styles.card} aria-labelledby="app-title">
        <header style={styles.header}>
          <h1 id="app-title" style={styles.title}>
            Simple Input Store
          </h1>
          <p style={styles.subtitle}>
            Save short notes to your browser. They persist between visits.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <label htmlFor="entry-input" style={styles.label}>
            New entry
          </label>
          <input
            id="entry-input"
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError("");
            }}
            placeholder="Type something to remember..."
            maxLength={280}
            style={styles.input}
            aria-describedby={error ? "entry-error" : undefined}
            aria-invalid={error ? "true" : "false"}
          />
          {error && (
            <p id="entry-error" style={styles.error} role="alert">
              {error}
            </p>
          )}
          <button type="submit" style={styles.button} aria-label="Save entry">
            Save entry
          </button>
        </form>

        <section aria-labelledby="entries-heading" style={styles.entriesSection}>
          <div style={styles.entriesHeader}>
            <h2 id="entries-heading" style={styles.entriesTitle}>
              Saved entries
            </h2>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                style={styles.clearButton}
                aria-label="Clear all entries"
              >
                Clear all
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <p style={styles.empty}>
              No entries yet. Add your first one above.
            </p>
          ) : (
            <ul style={styles.list}>
              {entries.map((entry) => (
                <li key={entry.id} style={styles.item}>
                  <div style={styles.itemBody}>
                    <p style={styles.itemText}>{entry.text}</p>
                    <time
                      style={styles.itemTime}
                      dateTime={entry.createdAt}
                    >
                      {new Date(entry.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    style={styles.removeButton}
                    aria-label={"Remove entry: " + entry.text}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "24px 16px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1f2937",
  },
  card: {
    maxWidth: "640px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
    padding: "24px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#4b5563",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
  },
  input: {
    padding: "10px 12px",
    fontSize: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
  },
  error: {
    margin: 0,
    fontSize: "13px",
    color: "#b91c1c",
  },
  button: {
    padding: "10px 14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  entriesSection: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "16px",
  },
  entriesHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
  },
  entriesTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
  },
  clearButton: {
    padding: "6px 10px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#b91c1c",
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    cursor: "pointer",
  },
  empty: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "10px 12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  itemBody: {
    flex: 1,
    minWidth: 0,
  },
  itemText: {
    margin: "0 0 4px 0",
    fontSize: "15px",
    color: "#111827",
    wordBreak: "break-word",
  },
  itemTime: {
    fontSize: "12px",
    color: "#6b7280",
  },
  removeButton: {
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
