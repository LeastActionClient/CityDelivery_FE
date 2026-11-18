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
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', {
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
