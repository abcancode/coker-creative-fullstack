import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./analytics.css";
import { useAnalytics } from "../../context/AnalyticsContext";

function TrafficChart() {
  const { dashboard } = useAnalytics();

  const traffic = dashboard?.traffic || [];

  // Show an empty state if no traffic has been recorded yet.
  if (!traffic.length) {
    return (
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>Website Traffic</h2>
            <p>Visitor activity over time.</p>
          </div>
        </div>

        <div
          style={{
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          No traffic data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Website Traffic</h2>
          <p>Visitor activity over time.</p>
        </div>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <AreaChart data={traffic}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#401e37" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#401e37" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })
              }
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />

            <Tooltip
              formatter={(value) => [value, "Visitors"]}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
            />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#401e37"
              strokeWidth={3}
              fill="url(#trafficGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficChart;
