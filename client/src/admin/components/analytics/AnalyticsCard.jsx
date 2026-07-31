import "./analytics.css";

function AnalyticsCard({ title, value = 0, description, icon }) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-icon">{icon}</div>
      </div>

      <p className="analytics-title">{title}</p>

      <h2 className="analytics-value">{formattedValue}</h2>

      <p className="analytics-description">{description}</p>
    </div>
  );
}

export default AnalyticsCard;
