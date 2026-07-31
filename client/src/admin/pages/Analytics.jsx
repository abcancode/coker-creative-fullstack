import AdminLayout from "../layouts/AdminLayout";
import { AnalyticsProvider } from "../context/AnalyticsContext";

import KPICards from "../components/analytics/KPICards";
import TrafficChart from "../components/analytics/TrafficChart";

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
        </div>
      </AnalyticsProvider>
    </AdminLayout>
  );
};

export default Analytics;
