import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f6f8",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "40px 16px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      color: "#1f2933",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      padding: "24px",
      boxSizing: "border-box",
    },
    heading: {
      margin: "0 0 16px",
      fontSize: "20px",
      fontWeight: "600",
    },
    row: {
      display: "flex",
      gap: "8px",
      marginBottom: "20px",
    },
    input: {
      flex: "1 1 auto",
      padding: "10px 12px",
      fontSize: "15px",
      border: "1px solid #cbd2d9",
      borderRadius: "8px",
      outline: "none",
    },
    button: {
      flex: "0 0 auto",
      padding: "10px 16px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#ffffff",
      background: "#2563eb",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    list: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    listItem: {
      padding: "10px 12px",
      background: "#eef2f7",
      borderRadius: "8px",
      fontSize: "15px",
      wordBreak: "break-word",
    },
    empty: {
      color: "#6b7280",
      fontSize: "14px",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.page}>
      <main style={styles.card}>
        <h1 style={styles.heading}>Add to list</h1>
        <section style={styles.row} aria-label="Add a new item">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
            aria-label="Text to add to the list"
            style={styles.input}
          />
          <button type="button" onClick={handleAdd} aria-label="Add item to list" style={styles.button}>
            Add
          </button>
        </section>
        <section aria-label="List of added items">
          {items.length === 0 ? (
            <p style={styles.empty}>Nothing added yet.</p>
          ) : (
            <ul style={styles.list}>
              {items.map((item, index) => (
                <li key={index + "-" + item} style={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
