import { createContext, useContext, useEffect, useState } from "react";

import { getDashboard } from "../../services/analyticsService";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getDashboard();

      console.log("Analytics Response:", response);

      setDashboard(response);
      setError(null);
    } catch (err) {
      console.error("Failed to load analytics overview:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        dashboard,
        loading,
        error,
        refreshDashboard: loadDashboard,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
};
