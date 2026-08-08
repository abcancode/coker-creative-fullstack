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
 *
 * Supported ranges:
 * - today
 * - 7d
 * - 30d
 * - thisMonth
 * - lastMonth
 * - lifetime
 *
 * Custom range:
 * ?range=custom&startDate=2026-08-01&endDate=2026-08-08
 */
export const getDashboard = async (req, res) => {
  try {
    const { range = "30d", startDate = "", endDate = "" } = req.query;

    const dashboard = await analyticsService.getDashboard({
      range,
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("[Analytics] getDashboard:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to retrieve analytics dashboard.",
    });
  }
};
