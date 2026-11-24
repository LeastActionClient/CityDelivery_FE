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

function franchiseAdminHeaders(apiKey, role = 'owner', json = false) {
  const headers = { 'x-api-key': apiKey, 'x-admin-role': role };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

export function getFranchiseConfig() {
  return request('/franchises/config');
}

export function submitFranchiseApplication(formData) {
  return request('/franchises/register', { method: 'POST', body: formData });
}

export function checkFranchiseStatus(applicationId) {
  return request('/franchises/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId }),
  });
}

export function createFranchisePaymentOrder(applicationId) {
  return request('/franchises/payment/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId }),
  });
}

export function verifyFranchisePayment(applicationId) {
  return request('/franchises/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId }),
  });
}

export function getAdminFranchises(apiKey, role, { page = 1, status = '', city = '', payment = '', q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: '25' });
  if (status) params.set('status', status);
  if (city) params.set('city', city);
  if (payment) params.set('payment', payment);
  if (q) params.set('q', q);
  return request(`/admin/franchises?${params.toString()}`, {
    headers: franchiseAdminHeaders(apiKey, role),
  });
}

export function getAdminFranchise(apiKey, role, id) {
  return request(`/admin/franchises/${encodeURIComponent(id)}`, {
    headers: franchiseAdminHeaders(apiKey, role),
  });
}

export function updateAdminFranchiseStatus(apiKey, role, id, payload) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: franchiseAdminHeaders(apiKey, role, true),
    body: JSON.stringify(payload),
  });
}

export function markAdminFranchiseFeePaid(apiKey, role, id, payload = {}) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/mark-paid`, {
    method: 'PATCH',
    headers: franchiseAdminHeaders(apiKey, role, true),
    body: JSON.stringify(payload),
  });
}

export function requestAdminFranchiseInfo(apiKey, role, id, message) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/request-info`, {
    method: 'PATCH',
    headers: franchiseAdminHeaders(apiKey, role, true),
    body: JSON.stringify({ message }),
  });
}

export function addAdminFranchiseNote(apiKey, role, id, text) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/notes`, {
    method: 'POST',
    headers: franchiseAdminHeaders(apiKey, role, true),
    body: JSON.stringify({ text }),
  });
}

export function getAdminFranchiseDocuments(apiKey, role, id) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/documents`, {
    headers: franchiseAdminHeaders(apiKey, role),
  });
}

export function getAdminFranchiseAudit(apiKey, role, id) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/audit`, {
    headers: franchiseAdminHeaders(apiKey, role),
  });
}

export function getAdminFranchiseSettings(apiKey, role = 'owner') {
  return request('/admin/franchises/settings', {
    headers: franchiseAdminHeaders(apiKey, role),
  });
}

export function updateAdminFranchiseSettings(apiKey, role, payload) {
  return request('/admin/franchises/settings', {
    method: 'PATCH',
    headers: franchiseAdminHeaders(apiKey, role, true),
    body: JSON.stringify(payload),
  });
}

export function retryAdminFranchiseNotifications(apiKey, role, id) {
  return request(`/admin/franchises/${encodeURIComponent(id)}/retry-notifications`, {
    method: 'POST',
    headers: franchiseAdminHeaders(apiKey, role),
  });
}
