/**
 * Analytics Helper Functions
 *
 * Reusable utility functions used throughout
 * the Analytics module.
 */

/**
 * Detect device type from User-Agent
 */
export const detectDevice = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  if (/tablet|ipad/.test(ua)) {
    return "Tablet";
  }

  if (/mobile|android|iphone|ipod/.test(ua)) {
    return "Mobile";
  }

  return "Desktop";
};

/**
 * Detect browser
 */
export const detectBrowser = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";

  return "Unknown";
};

/**
 * Detect operating system
 */
export const detectOS = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("linux")) return "Linux";

  return "Unknown";
};

/**
 * Generate Session ID
 */
export const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
};

/**
 * Generate Visitor ID
 */
export const generateVisitorId = () => {
  return (
    "visitor_" +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
};

/**
 * Format date for charts
 *
 * Example:
 * 2026-07-27
 */
export const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Return today's date
 */
export const getToday = () => {
  return formatDate(new Date());
};

/**
 * Group records by day
 */
export const groupByDay = (records = []) => {
  return records.reduce((acc, record) => {
    const day = formatDate(record.createdAt);

    acc[day] = (acc[day] || 0) + 1;

    return acc;
  }, {});
};

/**
 * Extract UTM parameters
 */
export const extractUTM = (query = {}) => {
  return {
    utmSource: query.utm_source || "",
    utmMedium: query.utm_medium || "",
    utmCampaign: query.utm_campaign || "",
    utmContent: query.utm_content || "",
    utmTerm: query.utm_term || "",
  };
};

/**
 * Get client IP Address
 */
export const getIPAddress = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    ""
  );
};

/**
 * Safely get request language
 */
export const getLanguage = (req) => {
  return req.headers["accept-language"]?.split(",")[0] || "";
};
