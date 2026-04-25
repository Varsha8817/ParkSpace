import Link from "next/link";
import { Header } from "@/components/header";
import { SearchMarketplace } from "@/components/search-marketplace";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95";
const ghostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Airbnb for parking
            </span>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Find premium parking nearby or turn extra space into income.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-500 sm:text-xl">
                ParkSpace helps drivers book trusted spaces fast and gives homeowners a polished way to list garages,
                driveways, and covered spots.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link className={primaryButtonClass} href="/auth">
                Start with your role
              </Link>
              <Link className={ghostButtonClass} href="/dashboard">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">For drivers</p>
                <p className="text-sm leading-7 text-slate-500">
                  Search by location, compare prices, and move from discovery to booking in a clean three-step flow.
                </p>
              </div>
              <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">For hosts</p>
                <p className="text-sm leading-7 text-slate-500">
                  Publish your driveway or garage, manage pricing, and receive bookings without extra admin work.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5 text-sm leading-7 text-slate-600">
              Everything in the MVP stays intact: authentication, listings, bookings, mock UPI payments, reviews,
              and navigation-ready map views.
            </div>
          </div>
        </section>

        <SearchMarketplace />
      </main>
    </>
  );
}

