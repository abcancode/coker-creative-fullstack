import "./analytics.css";
import { Eye } from "lucide-react";

import { useAnalytics } from "../../context/AnalyticsContext";

function TopExperiences() {
  const { dashboard } = useAnalytics();

  const experiences = dashboard?.topExperiences || [];

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Top Experiences</h2>
          <p>Most viewed experience pages.</p>
        </div>
      </div>

      {!experiences.length ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No experience views recorded yet.
        </div>
      ) : (
        <div className="analytics-list">
          {experiences.map((item, index) => (
            <div key={item.slug || index} className="analytics-list-item">
              <div className="analytics-list-content">
                <div className="analytics-list-title">
                  {item.title || "Untitled Experience"}
                </div>

                <div className="analytics-list-subtitle">{item.page}</div>
              </div>

              <div className="analytics-list-value">
                <Eye size={16} />
                <span>{item.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopExperiences;
