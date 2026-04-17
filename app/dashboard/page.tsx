import { DashboardOverview } from "@/components/dashboard-overview";
import { Header } from "@/components/header";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="shell stack">
        <section className="section-heading">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>A quieter workspace for your parking activity</h1>
            <p className="muted">Track the essentials, then move straight into your next action.</p>
          </div>
        </section>
        <DashboardOverview />
      </main>
    </>
  );
}
