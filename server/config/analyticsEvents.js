/**
 * Analytics Event Definitions
 *
 * Centralised list of all analytics events used throughout
 * the application. This prevents string duplication and
 * eliminates typos across the frontend and backend.
 */

export const ANALYTICS_EVENTS = {
  // ===========================
  // Page Tracking
  // ===========================
  PAGE_VIEW: "page_view",

  // ===========================
  // Experience Tracking
  // ===========================
  EXPERIENCE_VIEW: "experience_view",

  // ===========================
  // Gallery Tracking
  // ===========================
  GALLERY_OPEN: "gallery_open",
  GALLERY_IMAGE_VIEW: "gallery_image_view",

  // ===========================
  // Video Tracking
  // ===========================
  VIDEO_PLAY: "video_play",
  VIDEO_PAUSE: "video_pause",
  VIDEO_COMPLETE: "video_complete",

  // ===========================
  // Contact Tracking
  // ===========================
  CONTACT_FORM_VIEW: "contact_form_view",
  CONTACT_SUBMIT: "contact_submit",

  // ===========================
  // CTA Tracking
  // ===========================
  CTA_CLICK: "cta_click",

  // ===========================
  // Newsletter
  // ===========================
  NEWSLETTER_SUBSCRIBE: "newsletter_subscribe",

  // ===========================
  // Downloads
  // ===========================
  FILE_DOWNLOAD: "file_download",

  // ===========================
  // External Links
  // ===========================
  EXTERNAL_LINK_CLICK: "external_link_click",

  // ===========================
  // Search
  // ===========================
  SEARCH: "search",

  // ===========================
  // Errors
  // ===========================
  ERROR: "error",
};

export default ANALYTICS_EVENTS;
