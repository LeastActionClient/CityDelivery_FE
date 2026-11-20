import { SITE } from '../utils/config.js';

export class ApiError extends Error {
  constructor(message, { status, fieldErrors, network = false } = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.network = network;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${SITE.apiUrl}${path}`, options);
  } catch {
    throw new ApiError(
      'We could not reach the server. Please check your connection and try again — your details are still in the form.',
      { network: true }
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || data?.success === false) {
    const fieldSummary = data?.errors
      ? ` ${Object.entries(data.errors).map(([field, error]) => `${field}: ${error}`).join(' ' )}`
      : '';
    throw new ApiError(`${data?.message || 'Something went wrong. Please try again.'}${fieldSummary}`, {
      status: res.status,
      fieldErrors: data?.errors,
    });
  }
  return data;
}

/** formData must already contain every field (+ optional productImage file + submissionKey). */
export function submitProductRequest(formData) {
  return request('/requests', { method: 'POST', body: formData });
}

export function submitContactMessage(payload) {
  return request('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getRequestStatus(requestId) {
  return request(`/requests/${encodeURIComponent(requestId)}/status`);
}

export function getAdminRequests(apiKey, { page = 1, status = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: '25' });
  if (status) params.set('status', status);
  return request(`/admin/requests?${params.toString()}`, {
    headers: { 'x-api-key': apiKey },
  });
}

export function updateAdminRequestStatus(apiKey, requestId, status) {
  return request(`/admin/requests/${encodeURIComponent(requestId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ status }),
  });
}

function riderAdminHeaders(apiKey, sensitiveKey = '', json = false) {
  const headers = { 'x-api-key': apiKey };
  if (sensitiveKey) headers['x-rider-sensitive-key'] = sensitiveKey;
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

export function getRiderConfig() {
  return request('/riders/config');
}

export function submitRiderApplication(formData) {
  return request('/riders/register', { method: 'POST', body: formData });
}

export function checkRiderStatus(applicationId) {
  return request('/riders/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId }),
  });
}

export function getAdminRiders(apiKey, sensitiveKey, { page = 1, status = '', q = '', area = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: '25' });
  if (status) params.set('status', status);
  if (q) params.set('q', q);
  if (area) params.set('area', area);
  return request(`/admin/riders?${params.toString()}`, {
    headers: riderAdminHeaders(apiKey, sensitiveKey),
  });
}

export function getAdminRider(apiKey, sensitiveKey, id) {
  return request(`/admin/riders/${encodeURIComponent(id)}`, {
    headers: riderAdminHeaders(apiKey, sensitiveKey),
  });
}

export function updateAdminRiderStatus(apiKey, sensitiveKey, id, payload) {
  return request(`/admin/riders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: riderAdminHeaders(apiKey, sensitiveKey, true),
    body: JSON.stringify(payload),
  });
}

export function requestAdminRiderDocuments(apiKey, sensitiveKey, id, message) {
  return request(`/admin/riders/${encodeURIComponent(id)}/request-documents`, {
    method: 'PATCH',
    headers: riderAdminHeaders(apiKey, sensitiveKey, true),
    body: JSON.stringify({ message }),
  });
}

export function setAdminRiderActivation(apiKey, sensitiveKey, id, active) {
  return request(`/admin/riders/${encodeURIComponent(id)}/activation`, {
    method: 'PATCH',
    headers: riderAdminHeaders(apiKey, sensitiveKey, true),
    body: JSON.stringify({ active }),
  });
}

export function getAdminRiderDocuments(apiKey, sensitiveKey, id) {
  return request(`/admin/riders/${encodeURIComponent(id)}/documents`, {
    headers: riderAdminHeaders(apiKey, sensitiveKey),
  });
}

export function getAdminRiderAudit(apiKey, sensitiveKey, id) {
  return request(`/admin/riders/${encodeURIComponent(id)}/audit`, {
    headers: riderAdminHeaders(apiKey, sensitiveKey),
  });
}

export function getAdminRiderSettings(apiKey) {
  return request('/admin/riders/settings', { headers: { 'x-api-key': apiKey } });
}

export function updateAdminRiderSettings(apiKey, payload) {
  return request('/admin/riders/settings', {
    method: 'PATCH',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function retryAdminRiderNotifications(apiKey, sensitiveKey, id) {
  return request(`/admin/riders/${encodeURIComponent(id)}/retry-notifications`, {
    method: 'POST',
    headers: riderAdminHeaders(apiKey, sensitiveKey),
  });
}
