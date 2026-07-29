import Analytics from "../models/Analytics.js";
import ANALYTICS_EVENTS from "../config/analyticsEvents.js";
import {
  detectBrowser,
  detectDevice,
  detectOS,
  getIPAddress,
  getLanguage,
} from "../utils/analyticsHelpers.js";

/**
 * Supported analytics events.
 */
const VALID_EVENTS = Object.values(ANALYTICS_EVENTS);

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

  if (!payload.sessionId) {
    throw new Error("Session ID is required.");
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

    sessionId: payload.sessionId,

    visitorId: payload.visitorId || "",

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
 * Dashboard Overview
 */
const getOverview = async () => {
  const overview = await Analytics.aggregate([
    {
      $group: {
        _id: null,

        totalEvents: {
          $sum: 1,
        },

        uniqueVisitors: {
          $addToSet: "$visitorId",
        },

        pageViews: {
          $sum: {
            $cond: [{ $eq: ["$event", ANALYTICS_EVENTS.PAGE_VIEW] }, 1, 0],
          },
        },

        experienceViews: {
          $sum: {
            $cond: [
              { $eq: ["$event", ANALYTICS_EVENTS.EXPERIENCE_VIEW] },
              1,
              0,
            ],
          },
        },

        videoPlays: {
          $sum: {
            $cond: [{ $eq: ["$event", ANALYTICS_EVENTS.VIDEO_PLAY] }, 1, 0],
          },
        },

        contactSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$event", ANALYTICS_EVENTS.CONTACT_SUBMIT] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (!overview.length) {
    return {
      totalVisitors: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      experienceViews: 0,
      videoPlays: 0,
      contactSubmissions: 0,
    };
  }

  return {
    totalVisitors: overview[0].totalEvents,
    uniqueVisitors: overview[0].uniqueVisitors.length,
    pageViews: overview[0].pageViews,
    experienceViews: overview[0].experienceViews,
    videoPlays: overview[0].videoPlays,
    contactSubmissions: overview[0].contactSubmissions,
  };
};

/**
 * Visitor Trend
 */
const getTraffic = async () => {
  return Analytics.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        visitors: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

/**
 * Device Breakdown
 */
const getDevices = async () => {
  return Analytics.aggregate([
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
  ]);
};

/**
 * Country Breakdown
 */
const getCountries = async () => {
  return Analytics.aggregate([
    {
      $match: {
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
  ]);
};

/**
 * Top Experiences
 */
const getTopExperiences = async () => {
  return Analytics.aggregate([
    {
      $match: {
        event: ANALYTICS_EVENTS.EXPERIENCE_VIEW,
      },
    },
    {
      $group: {
        _id: "$metadata.experienceSlug",

        title: {
          $first: "$metadata.experienceTitle",
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
  ]);
};

/**
 * Recent Activity
 */
const getRecentActivity = async () => {
  return Analytics.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .select(
      "event page title metadata.experienceTitle metadata.buttonName createdAt",
    )
    .lean();
};

/**
 * Build Analytics Dashboard
 */
export const getDashboard = async () => {
  const [
    overview,
    traffic,
    devices,
    countries,
    topExperiences,
    recentActivity,
  ] = await Promise.all([
    getOverview(),
    getTraffic(),
    getDevices(),
    getCountries(),
    getTopExperiences(),
    getRecentActivity(),
  ]);

  return {
    overview,
    traffic,
    devices,
    countries,
    topExperiences,
    recentActivity,
  };
};
