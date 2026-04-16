"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/app-provider";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout, demoMode } = useApp();

  return (
    <header className="shell">
      <div className="nav">
        <Link href="/" className="brand">
          <span className="brand-mark">P</span>
          <div>
            <strong>ParkSpace</strong>
            <p>Urban parking, simplified.</p>
          </div>
        </Link>

        <nav className="nav-links">
          <Link className={pathname === "/" ? "active" : ""} href="/">
            Home
          </Link>
          <Link className={pathname === "/dashboard" ? "active" : ""} href="/dashboard">
            Dashboard
          </Link>
          <Link className={pathname === "/auth" ? "active" : ""} href="/auth">
            {currentUser ? "Account" : "Login"}
          </Link>
        </nav>

        <div className="nav-actions">
          {demoMode ? <span className="badge warm">Demo mode</span> : <span className="badge">Supabase live</span>}
          {currentUser ? (
            <>
              <span className="user-pill">{currentUser.name}</span>
              <button className="ghost-button" onClick={() => logout()}>
                Logout
              </button>
            </>
          ) : (
            <Link className="primary-button" href="/auth">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
