"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ url, code }),
      body: JSON.stringify({ longUrl: url, customCode: code }),

    });

    if (res.status === 409) {
      setError("Code already exists!");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setUrl("");
    setCode("");
    setLoading(false);
    fetchLinks();
  };

  const handleDelete = async (c: string) => {
    await fetch(`/api/links/${c}`, { method: "DELETE" });
    fetchLinks();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔗 TinyLink — URL Shortener</h1>

      <input
        className="border p-3 w-full mb-3"
        placeholder="Enter original URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        className="border p-3 w-full mb-3"
        placeholder="Custom short code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded mb-6"
      >
        {loading ? "Creating..." : "Create Short Link"}
      </button>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Original URL</th>
            <th className="p-2 border">Clicks</th>
            <th className="p-2 border">Last Clicked</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No links yet
              </td>
            </tr>
          ) : (
            links.map((l) => (
              <tr key={l.code} className="border">
                <td className="p-2 border">{l.code}</td>
                <td className="p-2 border">{l.longUrl}</td>
                <td className="p-2 border">{l.clicks}</td>
                <td className="p-2 border">{l.lastClicked || "-"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(l.code)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
