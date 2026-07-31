import {
  Users,
  Eye,
  MousePointerClick,
  PlayCircle,
  FileText,
  Send,
  Activity,
  Clock3,
} from "lucide-react";

import "./analytics.css";
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import { useAnalytics } from "../../context/AnalyticsContext";

function KPICards() {
  const { dashboard, loading, error } = useAnalytics();

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "24px",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #f1f1f1",
          color: "#b91c1c",
        }}
      >
        Failed to load analytics.
      </div>
    );
  }

  const overview = dashboard?.overview || {};

  const cards = [
    {
      title: "Unique Visitors",
      value: overview.uniqueVisitors ?? 0,
      description: "People who visited your website.",
      icon: <Users size={22} />,
    },
    {
      title: "Sessions",
      value: overview.sessions ?? 0,
      description: "Browsing sessions started.",
      icon: <Clock3 size={22} />,
    },
    {
      title: "Page Views",
      value: overview.pageViews ?? 0,
      description: "Pages viewed across the website.",
      icon: <FileText size={22} />,
    },
    {
      title: "Experience Views",
      value: overview.experienceViews ?? 0,
      description: "Experience pages viewed.",
      icon: <Eye size={22} />,
    },
    {
      title: "CTA Clicks",
      value: overview.ctaClicks ?? 0,
      description: "Calls-to-action clicked.",
      icon: <MousePointerClick size={22} />,
    },
    {
      title: "Video Plays",
      value: overview.videoPlays ?? 0,
      description: "Videos started by visitors.",
      icon: <PlayCircle size={22} />,
    },
    {
      title: "Contact Forms",
      value: overview.contactSubmissions ?? 0,
      description: "Contact form submissions.",
      icon: <Send size={22} />,
    },
    {
      title: "Total Events",
      value: overview.totalEvents ?? 0,
      description: "All tracked analytics events.",
      icon: <Activity size={22} />,
    },
  ];

  return (
    <div className="analytics-grid">
      {cards.map((card) => (
        <AnalyticsCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

export default KPICards;
