import { useState, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me something about your documents.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState(null);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    queueMicrotask(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    addMessage({ role: "user", content: question });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      addMessage({
        role: "assistant",
        content: data.error
          ? `Error: ${data.error}`
          : data.answer || "No answer",
      });
    } catch (err) {
      addMessage({ role: "assistant", content: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploadStatus({ message: `Uploading ${file.name}...`, type: "info" });

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setUploadStatus({ message: "Uploaded successfully", type: "success" });
        setTimeout(() => setUploadStatus(null), 3000); // Clear success message after 3s
      } else {
        setUploadStatus({
          message: `Upload failed: ${data.error}`,
          type: "error",
        });
      }
    } catch (err) {
      setUploadStatus({ message: "Upload network error", type: "error" });
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">R</div>
        <div>
          <h1>RAG ChatBot </h1>
          <div className="muted">Ask questions over your knowledge base</div>
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            gap: "4px",
          }}
        >
          <label className={`upload-label ${loading ? "disabled" : ""}`}>
            <input
              type="file"
              onChange={handleUpload}
              style={{ display: "none" }}
              disabled={loading}
              accept=".pdf,.txt,.md"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Upload</span>
          </label>
          {uploadStatus && (
            <div
              style={{
                fontSize: "12px",
                color: uploadStatus.type === "error" ? "#ff6b6b" : "#9a6bff",
              }}
            >
              {uploadStatus.message}
            </div>
          )}
        </div>
      </header>

      <main className="card">
        <div id="chat" ref={chatRef} className="chat">
          {messages.map((m, i) => (
            <div className={`msg ${m.role}`} key={i}>
              <div className={`avatar ${m.role}`}>
                {m.role === "user" ? "U" : "A"}
              </div>
              <div className={`bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="form">
          <textarea
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            required
          />
          <button type="submit" disabled={loading}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 4L12 20L11 13L4 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
