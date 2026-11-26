const STORAGE_KEY = 'city-delivery-request-history-v1';
const MAX_ITEMS = 50;

function isRequestId(value) {
  return /^CDS-\d{8}-[A-Z0-9]{6}$/.test(String(value || '').toUpperCase());
}

export function getRequestHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && isRequestId(item.requestId))
      .map((item) => ({
        requestId: String(item.requestId).toUpperCase(),
        savedAt: item.savedAt || new Date().toISOString(),
      }))
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function rememberRequest(requestId) {
  if (!isRequestId(requestId)) return getRequestHistory();
  const id = String(requestId).toUpperCase();
  const items = [
    { requestId: id, savedAt: new Date().toISOString() },
    ...getRequestHistory().filter((item) => item.requestId !== id),
  ].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* storage unavailable */ }
  return items;
}

export function forgetRequest(requestId) {
  const items = getRequestHistory().filter((item) => item.requestId !== String(requestId).toUpperCase());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* storage unavailable */ }
  return items;
}

export function clearRequestHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
  return [];
}
