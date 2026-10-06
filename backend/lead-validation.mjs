export function validateLead(data, now = Date.now()) {
  if (!data || typeof data !== 'object') return false
  const bounded = (key, min, max) => typeof data[key] === 'string' && data[key].trim().length >= min && data[key].length <= max
  return bounded('requestId', 16, 80) && /^[\w-]+$/.test(data.requestId) && bounded('name', 2, 80) &&
    bounded('phone', 10, 30) && /^\+?[\d ()-]+$/.test(data.phone) && /^[78]\d{10}$/.test(data.phone.replace(/\D/g, '')) &&
    bounded('model', 0, 160) && bounded('comment', 0, 1500) && bounded('page', 8, 600) && data.consent === true &&
    data.website === '' && Number.isFinite(data.startedAt) && now - data.startedAt >= 3000 && now - data.startedAt < 86400000
}
