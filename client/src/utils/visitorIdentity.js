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
    console.log("Created visitorId:", visitorId);
  }

  return visitorId;
};

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    console.log("Created sessionId:", sessionId);
  }

  return sessionId;
};
