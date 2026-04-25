"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/app-provider";

const navLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900";
const buttonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95";
const ghostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout, demoMode } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-base font-bold text-white shadow-sm">
            P
          </span>
          <div>
            <strong className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              ParkSpace
            </strong>
            <p className="text-sm text-slate-500">Urban parking, simplified.</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link className={`${navLinkClass} ${pathname === "/" ? "bg-slate-100 text-slate-900" : ""}`} href="/">
            Home
          </Link>
          <Link
            className={`${navLinkClass} ${pathname === "/dashboard" ? "bg-slate-100 text-slate-900" : ""}`}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link className={`${navLinkClass} ${pathname === "/auth" ? "bg-slate-100 text-slate-900" : ""}`} href="/auth">
            {currentUser ? "Account" : "Login"}
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {demoMode ? "Demo mode" : "Supabase live"}
          </span>
          {currentUser ? (
            <>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                {currentUser.name}
              </span>
              <button className={ghostButtonClass} onClick={() => logout()}>
                Logout
              </button>
            </>
          ) : (
            <Link className={buttonClass} href="/auth">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

