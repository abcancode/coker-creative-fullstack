import { CalendarDays } from "lucide-react";

import "./analytics.css";

import { useAnalytics } from "../../context/AnalyticsContext";

const options = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7d",
    label: "Last 7 Days",
  },
  {
    value: "30d",
    label: "Last 30 Days",
  },
  {
    value: "thisMonth",
    label: "This Month",
  },
  {
    value: "lastMonth",
    label: "Last Month",
  },
  {
    value: "lifetime",
    label: "Lifetime",
  },
];

function AnalyticsDateFilter() {
  const { range, changeRange } = useAnalytics();

  return (
    <div className="analytics-date-filter">
      <CalendarDays size={18} />

      <select
        value={range}
        onChange={(event) => changeRange(event.target.value)}
        aria-label="Analytics date range"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AnalyticsDateFilter;
