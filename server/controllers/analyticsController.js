import * as analyticsService from "../services/analyticsService.js";

/**
 * POST /api/analytics/event
 * Record an analytics event
 */
export const trackEvent = async (req, res) => {
  try {
    const analytics = await analyticsService.trackEvent(req);

    return res.status(201).json({
      success: true,
      message: "Analytics event recorded successfully.",
      data: analytics,
    });
  } catch (error) {
    console.error("[Analytics] trackEvent:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to record analytics event.",
    });
  }
};

/**
 * GET /api/analytics/dashboard
 * Retrieve analytics dashboard data
 */
export const getDashboard = async (req, res) => {
  try {
    const dashboard = await analyticsService.getDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("[Analytics] getDashboard:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve analytics dashboard.",
    });
  }
};
