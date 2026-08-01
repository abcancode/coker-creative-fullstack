import "./analytics.css";
import { Globe } from "lucide-react";
import { useAnalytics } from "../../context/AnalyticsContext";

function BrowsersChart() {
  const { dashboard } = useAnalytics();

  const browsers = dashboard?.browsers || [];

  const total = browsers.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Browser Breakdown</h2>
          <p>Browsers visitors used to access your website.</p>
        </div>
      </div>

      {!browsers.length ? (
        <div className="analytics-empty">No browser data available yet.</div>
      ) : (
        <div className="analytics-progress-list">
          {browsers.map((browser) => {
            const percentage =
              total === 0 ? 0 : Math.round((browser.total / total) * 100);

            return (
              <div key={browser.name} className="analytics-progress-item">
                <div className="analytics-progress-header">
                  <div className="analytics-progress-label">
                    <Globe size={16} />
                    <span>{browser.name || "Unknown"}</span>
                  </div>

                  <strong>{percentage}%</strong>
                </div>

                <div className="analytics-progress-track">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="analytics-progress-count">
                  {browser.total.toLocaleString()} visits
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BrowsersChart;
