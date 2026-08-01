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
  // Session ID is optional.
  // If the client doesn't provide one,
  // one will be generated when saving the event.
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

        uniqueSessions: {
          $addToSet: "$sessionId",
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

        ctaClicks: {
          $sum: {
            $cond: [{ $eq: ["$event", ANALYTICS_EVENTS.CTA_CLICK] }, 1, 0],
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
    return EMPTY_DASHBOARD;
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
 * Visitor Trend
 */
const getTraffic = async () => {
  return Analytics.aggregate([
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
 * Browser Breakdown
 */
const getBrowsers = async () => {
  return Analytics.aggregate([
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
 * Recent Activity
 */
const getRecentActivity = async () => {
  return Analytics.find()
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
 * Build Analytics Dashboard
 */
export const getDashboard = async () => {
  const [
    overview,
    traffic,
    devices,
    browsers,
    countries,
    topExperiences,
    recentActivity,
  ] = await Promise.all([
    getOverview(),
    getTraffic(),
    getDevices(),
    getBrowsers(),
    getCountries(),
    getTopExperiences(),
    getRecentActivity(),
  ]);

  return {
    overview,
    traffic,
    devices,
    browsers,
    countries,
    topExperiences,
    recentActivity,
  };
};
