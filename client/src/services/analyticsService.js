import api from "./api";
import { getVisitorId, getSessionId } from "../utils/visitorIdentity";

/**
 * Record a custom analytics event.
 */
export const trackEvent = async (payload) => {
  return api.post("/analytics/events", {
    page: payload.page || window.location.pathname,

    title: payload.title || document.title,

    referrer: payload.referrer || document.referrer,

    source: "website",

    ...payload,

    visitorId: getVisitorId(),

    sessionId: getSessionId(),
  });
};

/**
 * Track a page view.
 */
export const trackPageView = async ({
  page,
  title,
  referrer = document.referrer,
}) => {
  return trackEvent({
    event: "page_view",
    page,
    title,
    referrer,
  });
};

/**
 * Track an experience page.
 */
export const trackExperienceView = async ({ slug, title, page }) => {
  return trackEvent({
    event: "experience_view",
    page,
    title,
    experienceSlug: slug,
    experienceTitle: title,
  });
};

/**
 * Track gallery open.
 */
export const trackGalleryOpen = async ({ experienceSlug, experienceTitle }) => {
  return trackEvent({
    event: "gallery_open",
    experienceSlug,
    experienceTitle,
  });
};

/**
 * Track gallery image view.
 */
export const trackGalleryImageView = async ({
  experienceSlug,
  experienceTitle,
  imageIndex,
}) => {
  return trackEvent({
    event: "gallery_image_view",
    experienceSlug,
    experienceTitle,
    imageIndex,
  });
};

/**
 * Track video play.
 */
export const trackVideoPlay = async ({ title, duration = 0 }) => {
  return trackEvent({
    event: "video_play",
    videoTitle: title,
    duration,
  });
};

/**
 * Track CTA click.
 */
export const trackCTAClick = async ({
  buttonName,
  section,
  experienceSlug = "",
  experienceTitle = "",
}) => {
  return trackEvent({
    event: "cta_click",

    buttonName,

    section,

    experienceSlug,

    experienceTitle,
  });
};

/**
 * Track contact form submission.
 */
export const trackContactSubmission = async () => {
  return trackEvent({
    event: "contact_submit",
  });
};

/**
 * Retrieve dashboard analytics.
 */
export const getDashboard = async () => {
  const { data } = await api.get("/analytics/dashboard");

  return data.data;
};

/**
 * Retrieve dashboard overview KPIs.
 */
export const getOverview = async () => {
  const response = await api.get("/analytics/dashboard/overview");

  return response.data;
};

/**
 * Track video pause.
 */
export const trackVideoPause = async ({ title, duration = 0 }) => {
  return trackEvent({
    event: "video_pause",
    videoTitle: title,
    duration,
  });
};

/**
 * Track video complete.
 */
export const trackVideoComplete = async ({ title, duration = 0 }) => {
  return trackEvent({
    event: "video_complete",
    videoTitle: title,
    duration,
  });
};

/**
 * Track video watch progress.
 */
export const trackVideoProgress = async ({
  title,
  watchPercentage,
  duration = 0,
}) => {
  return trackEvent({
    event: "video_progress",
    videoTitle: title,
    watchPercentage,
    duration,
  });
};
