"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useApp } from "@/providers/app-provider";
import { UserRole } from "@/lib/types";

export default function AuthPage() {
  const { login, signup, currentUser, demoMode } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("driver");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      role
    };

    const result = mode === "signup" ? await signup(payload) : await login(payload);
    setMessage(result.message);
  }

  return (
    <>
      <Header />
      <main className="shell">
        <section className="auth-grid">
          <article className="card stack">
            <span className="eyebrow">Welcome</span>
            <h1>{currentUser ? `You are signed in as ${currentUser.name}` : "Join ParkSpace"}</h1>
            <p>
              Choose whether you want to find parking as a driver or publish parking as a host.
            </p>
            <div className="summary-block">
              <div className="summary-row">
                <span>Demo driver</span>
                <strong>driver@parkspace.demo</strong>
              </div>
              <div className="summary-row">
                <span>Demo host</span>
                <strong>host@parkspace.demo</strong>
              </div>
              <div className="summary-row">
                <span>Backend mode</span>
                <strong>{demoMode ? "Demo data + local state" : "Supabase live"}</strong>
              </div>
            </div>
          </article>

          <article className="card stack">
            <div className="segmented-control">
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
                Sign up
              </button>
            </div>

            <form className="stack" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label>
                  Full name
                  <input name="name" placeholder="Your name" required />
                </label>
              ) : null}
              <label>
                Email
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input name="password" type="password" placeholder="Minimum 6 characters" required />
              </label>
              <div className="stack compact">
                <span className="label">Choose your role</span>
                <div className="tag-list">
                  <button
                    type="button"
                    className={`filter-chip ${role === "driver" ? "active" : ""}`}
                    onClick={() => setRole("driver")}
                  >
                    Driver
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${role === "host" ? "active" : ""}`}
                    onClick={() => setRole("host")}
                  >
                    Host
                  </button>
                </div>
              </div>
              <button className="primary-button" type="submit">
                {mode === "signup" ? "Create account" : "Login"}
              </button>
              {message ? <p className="success-text">{message}</p> : null}
            </form>
          </article>
        </section>
      </main>
    </>
  );
}
