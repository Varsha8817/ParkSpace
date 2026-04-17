import Link from "next/link";
import { Header } from "@/components/header";
import { SearchMarketplace } from "@/components/search-marketplace";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="shell stack">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Airbnb for parking</span>
            <h1>Book trusted parking nearby or turn your unused driveway into income.</h1>
            <p>
              ParkSpace helps drivers find safe spots fast and lets homeowners monetize empty garages,
              covered bays, and open driveways.
            </p>
            <div className="inline-row">
              <Link className="primary-button" href="/auth">
                Start with your role
              </Link>
              <Link className="ghost-button" href="/dashboard">
                Open dashboard
              </Link>
            </div>
          </div>
          <div className="hero-panel card">
            <div className="hero-note">
              <strong>For drivers</strong>
              <p>Search by area, compare prices, and complete the booking flow in minutes.</p>
            </div>
            <div className="hero-note">
              <strong>For hosts</strong>
              <p>Publish a driveway, garage, or covered slot and manage availability from one dashboard.</p>
            </div>
            <div className="hero-divider" />
            <p className="hero-support">
              Built for a straightforward MVP: authentication, listings, bookings, payments, reviews, and maps.
            </p>
          </div>
        </section>

        <SearchMarketplace />
      </main>
    </>
  );
}
