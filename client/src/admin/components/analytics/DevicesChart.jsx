import "./analytics.css";
import { MonitorSmartphone } from "lucide-react";
import { useAnalytics } from "../../context/AnalyticsContext";

function DevicesChart() {
  const { dashboard } = useAnalytics();

  const devices = dashboard?.devices || [];

  const total = devices.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Device Breakdown</h2>
          <p>Devices visitors used to access your website.</p>
        </div>
      </div>

      {!devices.length ? (
        <div className="analytics-empty">No device data available yet.</div>
      ) : (
        <div className="analytics-progress-list">
          {devices.map((device) => {
            const percentage =
              total === 0 ? 0 : Math.round((device.total / total) * 100);

            return (
              <div key={device.name} className="analytics-progress-item">
                <div className="analytics-progress-header">
                  <div className="analytics-progress-label">
                    <MonitorSmartphone size={16} />
                    <span>{device.name || "Unknown"}</span>
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
                  {device.total.toLocaleString()} visits
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DevicesChart;
