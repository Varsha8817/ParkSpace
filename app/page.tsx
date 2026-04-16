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
          <div className="hero-panel">
            <div className="hero-card">
              <strong>Driver flow</strong>
              <p>Login ? Search ? View on map ? Book ? Pay ? Navigate</p>
            </div>
            <div className="hero-card">
              <strong>Host flow</strong>
              <p>Login ? Add space ? Set pricing ? Publish ? Receive bookings</p>
            </div>
            <div className="hero-card accent">
              <strong>MVP ready</strong>
              <p>Auth, listings, booking, mock UPI, reviews, and maps in one deployable project.</p>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <article className="feature-card">
            <strong>3-step booking</strong>
            <p>Pick a slot, confirm payment, and jump straight into navigation.</p>
          </article>
          <article className="feature-card">
            <strong>Flexible pricing</strong>
            <p>Support hourly, daily, and monthly stays for commuters and residents.</p>
          </article>
          <article className="feature-card">
            <strong>Trust signals</strong>
            <p>Ratings, reviews, amenities, and space type help guests decide faster.</p>
          </article>
        </section>

        <SearchMarketplace />
      </main>
    </>
  );
}
