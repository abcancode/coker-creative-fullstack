import AdminLayout from "../layouts/AdminLayout";
import { AnalyticsProvider } from "../context/AnalyticsContext";

import KPICards from "../components/analytics/KPICards";
import TrafficChart from "../components/analytics/TrafficChart";
import TopExperiences from "../components/analytics/TopExperiences";
import RecentActivity from "../components/analytics/RecentActivity";
import DevicesChart from "../components/analytics/DevicesChart";
import BrowsersChart from "../components/analytics/BrowsersChart";
import CountriesChart from "../components/analytics/CountriesChart";

const Analytics = () => {
  return (
    <AdminLayout
      title="Analytics"
      subtitle="Understand how visitors discover, explore and engage with your website."
    >
      <AnalyticsProvider>
        <div className="space-y-8">
          <KPICards />

          <TrafficChart />

          <TopExperiences />

          <DevicesChart />

          <BrowsersChart />

          <CountriesChart />

          <RecentActivity />
        </div>
      </AnalyticsProvider>
    </AdminLayout>
  );
};

export default Analytics;
