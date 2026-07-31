"use client";

import { useEffect, useState } from "react";
import OldAdminDashboard from "./OldAdminDashboard";

export default function AdminGate() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("PRIVATE SITE CONTROL");

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("CHECKING…");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setStatus("WRONG PASSWORD");
      return;
    }
    setPassword("");
    setAuthenticated(true);
  }

  if (authenticated === null) {
    return <main className="legacy-loading">LOADING PLAY/EDIT CONTROL…</main>;
  }

  if (!authenticated) {
    return (
      <main className="legacy-login">
        <a href="/" className="legacy-login__brand">PLAY<span>/</span>EDIT <i>CONTROL</i></a>
        <form onSubmit={login}>
          <span>OWNER ACCESS</span>
          <h1>BACK TO THE<br /><em>CONTROL ROOM.</em></h1>
          <label>
            DASHBOARD PASSWORD
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit">OPEN DASHBOARD ↗</button>
          <p>{status}</p>
        </form>
      </main>
    );
  }

  return <OldAdminDashboard userName="Ahmed" userEmail="Vercel site owner" />;
}

