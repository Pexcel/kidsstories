"use client";

import { FormEvent, useState } from "react";

export default function NotifyPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentId, setContentId] = useState("");
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function sendNotification(event: FormEvent) {
    event.preventDefault();

    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-notify-secret": secret,
        },
        body: JSON.stringify({
          title,
          body,
          contentType,
          contentId,
        }),
      });

      const raw = await response.text();

      let result: any = {};

      try {
        result = JSON.parse(raw);
      } catch {
        result = { error: raw };
      }

      if (!response.ok || !result.success) {
        setStatus(
          `ERROR ${response.status}: ${
            result.error || raw || "Unknown server error"
          }`
        );
        return;
      }

      setStatus(
        `SUCCESS: Notification sent. Message ID: ${result.messageId || "sent"}`
      );
    } catch (error) {
      setStatus(
        `BROWSER ERROR: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <h1 className="text-3xl font-bold">Send App Notification</h1>

      <p className="mt-2 text-slate-600">
        Send an update to Animated Bible TV users.
      </p>

      <form
        onSubmit={sendNotification}
        className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="font-semibold">Notification title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold">Message</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 min-h-28 w-full rounded-xl border px-4 py-3"
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold">Open this section when tapped</span>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          >
            <option value="">Just open the app</option>
            <option value="prayer">Prayer</option>
            <option value="story">Bible Story</option>
            <option value="chapter">Animated Chapter</option>
            <option value="bible">Bible Reading</option>
          </select>
        </label>

        <label className="block">
          <span className="font-semibold">Content ID</span>
          <input
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Notification secret</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            required
          />
        </label>

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>

        {status && (
          <pre className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-sm">
            {status}
          </pre>
        )}
      </form>
    </main>
  );
}