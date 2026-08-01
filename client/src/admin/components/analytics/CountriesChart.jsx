import "./analytics.css";
import { MapPin } from "lucide-react";
import { useAnalytics } from "../../context/AnalyticsContext";

function CountriesChart() {
  const { dashboard } = useAnalytics();

  const countries = dashboard?.countries || [];

  const total = countries.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Top Countries</h2>
          <p>Where your visitors are coming from.</p>
        </div>
      </div>

      {!countries.length ? (
        <div className="analytics-empty">No country data available yet.</div>
      ) : (
        <div className="analytics-progress-list">
          {countries.map((country) => {
            const percentage =
              total === 0 ? 0 : Math.round((country.total / total) * 100);

            return (
              <div key={country.name} className="analytics-progress-item">
                <div className="analytics-progress-header">
                  <div className="analytics-progress-label">
                    <MapPin size={16} />
                    <span>{country.name}</span>
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
                  {country.total.toLocaleString()} visitors
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CountriesChart;
