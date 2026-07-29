import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../services/analyticsService";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView({
      page: location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location]);

  return null;
};

export default AnalyticsTracker;
