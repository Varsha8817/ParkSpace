"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useApp } from "@/providers/app-provider";
import { UserRole } from "@/lib/types";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95";

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
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Welcome
            </span>
            <div className="mt-6 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {currentUser ? `You are signed in as ${currentUser.name}` : "Join ParkSpace"}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-500">
                Choose whether you want to book parking as a driver or publish parking as a host.
              </p>
            </div>
            <div className="mt-8 space-y-4 rounded-[2rem] bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">Demo driver</span>
                <strong className="text-slate-900">driver@parkspace.demo</strong>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">Demo host</span>
                <strong className="text-slate-900">host@parkspace.demo</strong>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">Backend mode</span>
                <strong className="text-slate-900">{demoMode ? "Demo data + local state" : "Supabase live"}</strong>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  <span>Full name</span>
                  <input
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </label>
              ) : null}
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>Email</span>
                <input
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>Password</span>
                <input
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>
              <div className="space-y-3">
                <span className="block text-sm font-medium text-slate-700">Choose your role</span>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${role === "driver" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    onClick={() => setRole("driver")}
                  >
                    Driver
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${role === "host" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    onClick={() => setRole("host")}
                  >
                    Host
                  </button>
                </div>
              </div>
              <button className={`${primaryButtonClass} w-full`} type="submit">
                {mode === "signup" ? "Create account" : "Login"}
              </button>
              {message ? <p className="text-sm font-medium text-indigo-600">{message}</p> : null}
            </form>
          </article>
        </section>
      </main>
    </>
  );
}

