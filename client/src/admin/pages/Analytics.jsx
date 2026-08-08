import AdminLayout from "../layouts/AdminLayout";
import { AnalyticsProvider } from "../context/AnalyticsContext";

import AnalyticsDateFilter from "../components/analytics/AnalyticsDateFilter";
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
      subtitle="Track visitor engagement and website performance."
    >
      <AnalyticsProvider>
        <div className="analytics-page">
          <div className="analytics-toolbar">
            <div>
              <p className="analytics-eyebrow">PERFORMANCE OVERVIEW</p>

              <h2 className="analytics-page-heading">Website Analytics</h2>

              <p className="analytics-page-description">
                Understand how visitors discover, explore, and interact with
                Coker Creative.
              </p>
            </div>

            <AnalyticsDateFilter />
          </div>

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
