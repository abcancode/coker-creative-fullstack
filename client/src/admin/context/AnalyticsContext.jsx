import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { getDashboard } from "../../services/analyticsService";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);

  const [range, setRange] = useState("30d");

  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const loadDashboard = useCallback(
    async (selectedRange = range, selectedCustomRange = customRange) => {
      try {
        setLoading(true);

        const response = await getDashboard({
          range: selectedRange,

          startDate: selectedCustomRange.startDate,

          endDate: selectedCustomRange.endDate,
        });

        setDashboard(response);

        setError(null);
      } catch (err) {
        console.error("Failed to load analytics:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load analytics.",
        );
      } finally {
        setLoading(false);
      }
    },
    [range, customRange],
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  const changeRange = async (nextRange) => {
    setRange(nextRange);

    await loadDashboard(nextRange, customRange);
  };

  const changeCustomRange = async ({ startDate, endDate }) => {
    const nextCustomRange = {
      startDate,
      endDate,
    };

    setCustomRange(nextCustomRange);

    setRange("custom");

    await loadDashboard("custom", nextCustomRange);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        dashboard,

        loading,

        error,

        range,

        customRange,

        changeRange,

        changeCustomRange,

        refreshDashboard: () => loadDashboard(range, customRange),
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
