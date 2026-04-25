import { DashboardOverview } from "@/components/dashboard-overview";
import { Header } from "@/components/header";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="space-y-3">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Dashboard
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">A calmer workspace for your parking activity</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-500">
            Track the essentials, review what matters, and move straight into the next action.
          </p>
        </section>
        <DashboardOverview />
      </main>
    </>
  );
}

