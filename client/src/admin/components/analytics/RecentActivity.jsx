import {
  Eye,
  MousePointerClick,
  PlayCircle,
  Image,
  Send,
  FileText,
} from "lucide-react";

import "./analytics.css";
import { useAnalytics } from "../../context/AnalyticsContext";

const eventMap = {
  page_view: {
    label: "Page Viewed",
    icon: <FileText size={18} />,
  },
  experience_view: {
    label: "Experience Viewed",
    icon: <Eye size={18} />,
  },
  cta_click: {
    label: "CTA Clicked",
    icon: <MousePointerClick size={18} />,
  },
  video_play: {
    label: "Video Played",
    icon: <PlayCircle size={18} />,
  },
  gallery_open: {
    label: "Gallery Opened",
    icon: <Image size={18} />,
  },
  contact_submit: {
    label: "Contact Form Submitted",
    icon: <Send size={18} />,
  },
};

function RecentActivity() {
  const { dashboard } = useAnalytics();

  const activities = dashboard?.recentActivity || [];

  return (
    <div className="analytics-panel">
      <div className="analytics-panel-header">
        <div>
          <h2>Recent Activity</h2>
          <p>Latest visitor interactions on your website.</p>
        </div>
      </div>

      {!activities.length ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No activity recorded yet.
        </div>
      ) : (
        <div className="analytics-list">
          {activities.map((activity) => {
            const config = eventMap[activity.event] || {
              label: activity.event,
              icon: <Eye size={18} />,
            };

            return (
              <div key={activity._id} className="analytics-list-item">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#f5f2ef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#401e37",
                    }}
                  >
                    {config.icon}
                  </div>

                  <div>
                    <div className="analytics-list-title">{config.label}</div>

                    <div className="analytics-list-subtitle">
                      {activity.metadata?.experienceTitle ||
                        activity.title ||
                        activity.page}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 13,
                  }}
                >
                  {new Date(activity.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
