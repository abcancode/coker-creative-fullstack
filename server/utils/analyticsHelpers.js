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

/**
 * IP Geolocation
 *
 * Resolves a public IP address into country, region and city.
 */
export const getIPGeolocation = async (ipAddress = "") => {
  if (!ipAddress) {
    return {
      country: "",
      region: "",
      city: "",
    };
  }

  // Ignore local/private addresses.
  if (
    ipAddress === "127.0.0.1" ||
    ipAddress === "::1" ||
    ipAddress.startsWith("10.") ||
    ipAddress.startsWith("192.168.") ||
    ipAddress.startsWith("172.16.") ||
    ipAddress.startsWith("172.17.") ||
    ipAddress.startsWith("172.18.") ||
    ipAddress.startsWith("172.19.") ||
    ipAddress.startsWith("172.20.") ||
    ipAddress.startsWith("172.21.") ||
    ipAddress.startsWith("172.22.") ||
    ipAddress.startsWith("172.23.") ||
    ipAddress.startsWith("172.24.") ||
    ipAddress.startsWith("172.25.") ||
    ipAddress.startsWith("172.26.") ||
    ipAddress.startsWith("172.27.") ||
    ipAddress.startsWith("172.28.") ||
    ipAddress.startsWith("172.29.") ||
    ipAddress.startsWith("172.30.") ||
    ipAddress.startsWith("172.31.")
  ) {
    return {
      country: "",
      region: "",
      city: "",
    };
  }

  const token = process.env.IPINFO_TOKEN;

  if (!token) {
    console.warn("[Analytics] IPINFO_TOKEN is not configured.");

    return {
      country: "",
      region: "",
      city: "",
    };
  }

  try {
    const response = await fetch(
      `https://ipinfo.io/${encodeURIComponent(ipAddress)}/json?token=${token}`,
    );

    if (!response.ok) {
      console.warn(
        `[Analytics] IP geolocation failed with status ${response.status}`,
      );

      return {
        country: "",
        region: "",
        city: "",
      };
    }

    const data = await response.json();

    return {
      country: data.country || "",
      region: data.region || "",
      city: data.city || "",
    };
  } catch (error) {
    console.error("[Analytics] IP geolocation error:", error);

    return {
      country: "",
      region: "",
      city: "",
    };
  }
};
