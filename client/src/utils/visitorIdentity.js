const VISITOR_KEY = "cc_visitor_id";
const SESSION_KEY = "cc_session_id";

/**
 * Generate UUID
 */
const generateId = () => {
  return crypto.randomUUID();
};

/**
 * Persistent Visitor
 * Lives in localStorage
 */
export const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_KEY);

  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  return visitorId;
};

/**
 * Browser Session
 * Lives in sessionStorage
 */
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Optional helper
 */
export const resetSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};
