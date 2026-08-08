import Analytics from "../models/Analytics.js";
import ANALYTICS_EVENTS from "../config/analyticsEvents.js";
import {
  detectBrowser,
  detectDevice,
  detectOS,
  getIPAddress,
  getLanguage,
} from "../utils/analyticsHelpers.js";
import crypto from "node:crypto";

/**
 * Supported analytics events.
 */
const VALID_EVENTS = Object.values(ANALYTICS_EVENTS);

const EMPTY_DASHBOARD = {
  totalEvents: 0,
  uniqueVisitors: 0,
  sessions: 0,
  pageViews: 0,
  experienceViews: 0,
  videoPlays: 0,
  ctaClicks: 0,
  contactSubmissions: 0,
};

/**
 * Validate analytics payload.
 */
const validatePayload = (payload = {}) => {
  if (!payload.event) {
    throw new Error("Analytics event is required.");
  }

  if (!VALID_EVENTS.includes(payload.event)) {
    throw new Error(`Unsupported analytics event: ${payload.event}`);
  }
};

/**
 * Build visitor object from request.
 */
const buildVisitor = (req) => {
  const userAgent = req.headers["user-agent"] || "";

  return {
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    device: detectDevice(userAgent),

    language: getLanguage(req),

    ipAddress: getIPAddress(req),

    country: "",
    region: "",
    city: "",

    screenResolution:
      req.body.screenResolution || req.headers["x-screen-resolution"] || "",
  };
};

/**
 * Track analytics event.
 */
export const trackEvent = async (req) => {
  const payload = req.body;

  validatePayload(payload);

  const analytics = await Analytics.create({
    event: payload.event,

    sessionId: payload.sessionId || crypto.randomUUID(),

    visitorId: payload.visitorId || crypto.randomUUID(),

    source: payload.source || "website",

    page: payload.page || "",

    title: payload.title || "",

    referrer: payload.referrer || "",

    visitor: buildVisitor(req),

    metadata: {
      experienceSlug: payload.experienceSlug || "",
      experienceTitle: payload.experienceTitle || "",
      videoTitle: payload.videoTitle || "",
      buttonName: payload.buttonName || "",
      section: payload.section || "",
      searchQuery: payload.searchQuery || "",
      fileName: payload.fileName || "",
      imageIndex: payload.imageIndex || 0,
      duration: payload.duration || 0,
      watchPercentage: payload.watchPercentage || 0,

      utmSource: payload.utmSource || "",
      utmMedium: payload.utmMedium || "",
      utmCampaign: payload.utmCampaign || "",
      utmContent: payload.utmContent || "",
      utmTerm: payload.utmTerm || "",
    },
  });

  return analytics;
};

/**
 * Get date range boundaries.
 *
 * All dates are handled in UTC to keep
 * aggregation behaviour consistent.
 */
const getDateRange = ({ range = "30d", startDate = "", endDate = "" } = {}) => {
  const now = new Date();

  // Lifetime
  if (range === "lifetime") {
    return {
      key: "lifetime",
      startDate: null,
      endDate: null,
      previousStartDate: null,
      previousEndDate: null,
    };
  }

  // Custom range
  if (range === "custom") {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate are required for a custom range.");
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T00:00:00.000Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error("Invalid custom analytics date range.");
    }

    if (end < start) {
      throw new Error("Analytics end date cannot be before the start date.");
    }

    // End is exclusive, so include the complete end day.
    end.setUTCDate(end.getUTCDate() + 1);

    const duration = end.getTime() - start.getTime();

    return {
      key: "custom",

      startDate: start,
      endDate: end,

      previousStartDate: new Date(start.getTime() - duration),

      previousEndDate: start,
    };
  }

  // Today
  if (range === "today") {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const previousStart = new Date(start);
    previousStart.setUTCDate(previousStart.getUTCDate() - 1);

    return {
      key: "today",
      startDate: start,
      endDate: end,
      previousStartDate: previousStart,
      previousEndDate: start,
    };
  }

  // Last 7 days
  if (range === "7d") {
    const end = now;

    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - 7);

    const duration = end.getTime() - start.getTime();

    return {
      key: "7d",
      startDate: start,
      endDate: end,

      previousStartDate: new Date(start.getTime() - duration),

      previousEndDate: start,
    };
  }

  // Last 30 days
  if (range === "30d") {
    const end = now;

    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - 30);

    const duration = end.getTime() - start.getTime();

    return {
      key: "30d",
      startDate: start,
      endDate: end,

      previousStartDate: new Date(start.getTime() - duration),

      previousEndDate: start,
    };
  }

  // This month
  if (range === "thisMonth") {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const duration = end.getTime() - start.getTime();

    return {
      key: "thisMonth",
      startDate: start,
      endDate: end,

      previousStartDate: new Date(start.getTime() - duration),

      previousEndDate: start,
    };
  }

  // Last month
  if (range === "lastMonth") {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
    );

    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const duration = end.getTime() - start.getTime();

    return {
      key: "lastMonth",
      startDate: start,
      endDate: end,

      previousStartDate: new Date(start.getTime() - duration),

      previousEndDate: start,
    };
  }

  throw new Error(`Unsupported analytics range: ${range}`);
};

/**
 * Build MongoDB date filter.
 */
const buildDateMatch = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return {};
  }

  return {
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  };
};

/**
 * Dashboard Overview.
 */
const getOverview = async (dateMatch = {}) => {
  const overview = await Analytics.aggregate([
    {
      $match: dateMatch,
    },

    {
      $group: {
        _id: null,

        totalEvents: {
          $sum: 1,
        },

        uniqueVisitors: {
          $addToSet: "$visitorId",
        },

        uniqueSessions: {
          $addToSet: "$sessionId",
        },

        pageViews: {
          $sum: {
            $cond: [
              {
                $eq: ["$event", ANALYTICS_EVENTS.PAGE_VIEW],
              },
              1,
              0,
            ],
          },
        },

        experienceViews: {
          $sum: {
            $cond: [
              {
                $eq: ["$event", ANALYTICS_EVENTS.EXPERIENCE_VIEW],
              },
              1,
              0,
            ],
          },
        },

        videoPlays: {
          $sum: {
            $cond: [
              {
                $eq: ["$event", ANALYTICS_EVENTS.VIDEO_PLAY],
              },
              1,
              0,
            ],
          },
        },

        ctaClicks: {
          $sum: {
            $cond: [
              {
                $eq: ["$event", ANALYTICS_EVENTS.CTA_CLICK],
              },
              1,
              0,
            ],
          },
        },

        contactSubmissions: {
          $sum: {
            $cond: [
              {
                $eq: ["$event", ANALYTICS_EVENTS.CONTACT_SUBMIT],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  if (!overview.length) {
    return { ...EMPTY_DASHBOARD };
  }

  return {
    totalEvents: overview[0].totalEvents,
    uniqueVisitors: overview[0].uniqueVisitors.length,
    sessions: overview[0].uniqueSessions.length,
    pageViews: overview[0].pageViews,
    experienceViews: overview[0].experienceViews,
    videoPlays: overview[0].videoPlays,
    ctaClicks: overview[0].ctaClicks,
    contactSubmissions: overview[0].contactSubmissions,
  };
};

/**
 * Visitor Traffic.
 */
const getTraffic = async (dateMatch = {}) => {
  return Analytics.aggregate([
    {
      $match: dateMatch,
    },

    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          sessionId: "$sessionId",
        },
      },
    },

    {
      $group: {
        _id: "$_id.date",

        visitors: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        visitors: 1,
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
  ]);
};

/**
 * Device Breakdown.
 */
const getDevices = async (dateMatch = {}) => {
  return Analytics.aggregate([
    {
      $match: dateMatch,
    },

    {
      $group: {
        _id: "$visitor.device",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        total: -1,
      },
    },

    {
      $project: {
        _id: 0,
        name: "$_id",
        total: 1,
      },
    },
  ]);
};

/**
 * Browser Breakdown.
 */
const getBrowsers = async (dateMatch = {}) => {
  return Analytics.aggregate([
    {
      $match: dateMatch,
    },

    {
      $group: {
        _id: "$visitor.browser",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        total: -1,
      },
    },

    {
      $project: {
        _id: 0,
        name: "$_id",
        total: 1,
      },
    },
  ]);
};

/**
 * Country Breakdown.
 */
const getCountries = async (dateMatch = {}) => {
  return Analytics.aggregate([
    {
      $match: {
        ...dateMatch,

        "visitor.country": {
          $ne: "",
        },
      },
    },

    {
      $group: {
        _id: "$visitor.country",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        total: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        _id: 0,
        name: "$_id",
        total: 1,
      },
    },
  ]);
};

/**
 * Top Experiences.
 */
const getTopExperiences = async (dateMatch = {}) => {
  return Analytics.aggregate([
    {
      $match: {
        ...dateMatch,

        event: ANALYTICS_EVENTS.EXPERIENCE_VIEW,
      },
    },

    {
      $group: {
        _id: "$metadata.experienceSlug",

        title: {
          $first: "$metadata.experienceTitle",
        },

        page: {
          $first: "$page",
        },

        views: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        views: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        _id: 0,
        slug: "$_id",
        title: 1,
        page: 1,
        views: 1,
      },
    },
  ]);
};

/**
 * Recent Activity.
 */
const getRecentActivity = async (dateMatch = {}) => {
  return Analytics.find(dateMatch)
    .sort({ createdAt: -1 })
    .limit(20)
    .select(
      `
        event
        page
        title
        metadata.experienceSlug
        metadata.experienceTitle
        metadata.buttonName
        metadata.section
        metadata.videoTitle
        metadata.imageIndex
        createdAt
      `,
    )
    .lean();
};

/**
 * Calculate percentage change.
 */
const calculateChange = (current, previous) => {
  if (previous === 0) {
    if (current === 0) return 0;

    return 100;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

/**
 * Build comparison object.
 */
const buildComparison = (current, previous) => {
  const comparison = {};

  Object.keys(current).forEach((key) => {
    if (typeof current[key] === "number" && typeof previous[key] === "number") {
      comparison[key] = {
        current: current[key],
        previous: previous[key],
        change: calculateChange(current[key], previous[key]),
      };
    }
  });

  return comparison;
};

/**
 * Build Analytics Dashboard.
 */
export const getDashboard = async ({
  range = "30d",
  startDate = "",
  endDate = "",
} = {}) => {
  const dateRange = getDateRange({
    range,
    startDate,
    endDate,
  });

  const currentMatch = buildDateMatch(dateRange.startDate, dateRange.endDate);

  const previousMatch = buildDateMatch(
    dateRange.previousStartDate,
    dateRange.previousEndDate,
  );

  const [
    overview,
    previousOverview,
    traffic,
    devices,
    browsers,
    countries,
    topExperiences,
    recentActivity,
  ] = await Promise.all([
    getOverview(currentMatch),

    dateRange.key === "lifetime"
      ? Promise.resolve({
          ...EMPTY_DASHBOARD,
        })
      : getOverview(previousMatch),

    getTraffic(currentMatch),
    getDevices(currentMatch),
    getBrowsers(currentMatch),
    getCountries(currentMatch),
    getTopExperiences(currentMatch),
    getRecentActivity(currentMatch),
  ]);

  return {
    range: {
      key: dateRange.key,

      startDate: dateRange.startDate,

      endDate: dateRange.endDate,

      previousStartDate: dateRange.previousStartDate,

      previousEndDate: dateRange.previousEndDate,
    },

    overview,

    comparison:
      dateRange.key === "lifetime"
        ? null
        : buildComparison(overview, previousOverview),

    traffic,
    devices,
    browsers,
    countries,
    topExperiences,
    recentActivity,
  };
};
