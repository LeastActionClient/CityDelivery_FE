export const FRANCHISE_STATUSES = [
  'Payment Pending',
  'Payment Successful',
  'Under Review',
  'Approved',
  'Rejected',
  'Agreement Pending',
  'Active Franchise',
];

export const FRANCHISE_INVESTMENT_CAPACITIES = [
  'Below ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
];

export const FRANCHISE_VEHICLE_TYPES = [
  'Bike',
  'Scooter',
  'Electric Bike',
  'Car',
  'Three Wheeler',
  'Pickup Van',
  'Delivery Van',
  'Lorry',
  'Other',
];

export const FRANCHISE_DOCUMENTS = [
  {
    key: 'businessProof',
    label: 'Business proof (optional)',
    hint: 'Registration, licence or previous business proof, if available.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
  },
  {
    key: 'addressProof',
    label: 'Address proof (optional)',
    hint: 'Proof for the proposed office or operating area, if available.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
  },
  {
    key: 'otherProof',
    label: 'Other supporting document (optional)',
    hint: 'Anything else you would like our team to review.',
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
  },
];

export function vehicleRowsFromCounts(counts, otherType = '', types = FRANCHISE_VEHICLE_TYPES) {
  return types
    .map((type) => ({
      type,
      otherType: type === 'Other' ? String(otherType || '').trim() : '',
      count: String(counts?.[type] ?? ''),
    }))
    .filter((row) => row.count !== '');
}

export function franchiseFieldError(errors, path) {
  if (!errors) return '';
  return errors[path] || '';
}

export function franchiseStatusClass(status) {
  return {
    'Payment Pending': 'bg-amber-100 text-amber-900',
    'Payment Successful': 'bg-sky-100 text-sky-900',
    'Under Review': 'bg-blue-100 text-blue-900',
    Approved: 'bg-emerald-100 text-emerald-900',
    Rejected: 'bg-red-100 text-red-900',
    'Agreement Pending': 'bg-violet-100 text-violet-900',
    'Active Franchise': 'bg-emerald-600 text-white',
  }[status] || 'bg-brand-light text-brand-dark';
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function formatApplicationFee(amount, currency = 'INR') {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}
