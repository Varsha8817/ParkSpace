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
            <h1>Run your parking marketplace activity from one place</h1>
          </div>
        </section>
        <DashboardOverview />
      </main>
    </>
  );
}
