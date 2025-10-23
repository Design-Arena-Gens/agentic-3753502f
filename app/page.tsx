"use client";
import React from 'react';

export default function Page() {
  const [connected, setConnected] = React.useState(false);
  const [blogs, setBlogs] = React.useState<Array<{id: string; name: string}>>([]);
  const [blogId, setBlogId] = React.useState<string>("");
  const [topic, setTopic] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");

  async function handleConnect() {
    setStatus('Connecting to Google...');
    const res = await fetch('/api/auth/url');
    if (!res.ok) { setStatus('Failed to start auth'); return; }
    const data = await res.json();
    window.location.href = data.url; // OAuth redirect
  }

  async function loadBlogs() {
    setStatus('Fetching Blogger blogs...');
    const res = await fetch('/api/blogs');
    if (!res.ok) { setStatus('Failed to load blogs'); return; }
    const data = await res.json();
    setBlogs(data.blogs ?? []);
    if (data.blogs?.[0]) setBlogId(data.blogs[0].id);
    setConnected(true);
    setStatus('');
  }

  async function generateAndPost() {
    setStatus('Generating content...');
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, topic })
    });
    const data = await res.json();
    if (!res.ok) { setStatus(data.error || 'Failed'); return; }
    setStatus(`Posted: ${data.post?.url || 'success'}`);
  }

  React.useEffect(() => {
    // Try to load blogs on mount (if session exists)
    loadBlogs().catch(() => {});
  }, []);

  return (
    <main>
      <header>
        <h1>Agentic Blogger</h1>
        <button onClick={handleConnect}>Connect Google</button>
      </header>

      <div className="card">
        <p className="muted">Automatically generate and publish SEO-friendly blog posts to Google Blogger.</p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>1) Pick blog</h3>
          {!connected ? (
            <p className="muted">You need to connect Google first. Then your blogs will appear here.</p>
          ) : (
            <>
              <button onClick={loadBlogs}>Refresh Blogs</button>
              <div style={{height:8}} />
              <select value={blogId} onChange={(e) => setBlogId(e.target.value)}>
                {blogs.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="card">
          <h3>2) Topic</h3>
          <input placeholder="e.g., best budget travel tips 2025" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <div style={{height:8}} />
          <button disabled={!blogId} onClick={generateAndPost}>Generate & Post</button>
        </div>
      </div>

      <div className="card">
        <h3>Status</h3>
        <pre>{status || 'Ready'}</pre>
      </div>
    </main>
  );
}
