import api from "./api";

/**
 * Record a custom analytics event.
 */
export const trackEvent = async (payload) => {
  try {
    await api.post("/analytics/events", payload);
  } catch (error) {
    // Analytics should never interrupt the user experience.
    console.error("[Analytics]", error);
  }
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
export const trackCTAClick = async ({ buttonName, section }) => {
  return trackEvent({
    event: "cta_click",
    buttonName,
    section,
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
  const response = await api.get("/analytics/dashboard");

  return response.data;
};
