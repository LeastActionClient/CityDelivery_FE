export const RIDER_STATUSES = [
  'Submitted',
  'Under Review',
  'Additional Documents Required',
  'Approved',
  'Rejected',
  'Inactive',
];

export const RIDER_WORK_TYPES = ['Full Time', 'Part Time', 'Flexible'];

export const RIDER_VEHICLE_TYPES = ['Motorcycle', 'Scooter', 'Electric Bike', 'Three Wheeler', 'Mini Truck'];

export const RIDER_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const RIDER_AVAILABILITY_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const RIDER_DOCUMENTS = [
  { key: 'profilePhoto', label: 'Profile photo', hint: 'A clear recent photo of yourself.', accept: 'image/jpeg,image/png,image/webp', always: true },
  { key: 'licenceFront', label: 'Driving licence — front', hint: 'Plain, readable scan or photo.', accept: 'image/jpeg,image/png,image/webp,application/pdf', always: true },
  { key: 'licenceBack', label: 'Driving licence — back', hint: 'Plain, readable scan or photo.', accept: 'image/jpeg,image/png,image/webp,application/pdf', always: true },
  { key: 'vehicleRcFront', label: 'Vehicle RC — front', hint: 'Required if you own a vehicle.', accept: 'image/jpeg,image/png,image/webp,application/pdf', when: 'ownsVehicle' },
  { key: 'vehicleRcBack', label: 'Vehicle RC — back', hint: 'Required if you own a vehicle.', accept: 'image/jpeg,image/png,image/webp,application/pdf', when: 'ownsVehicle' },
  { key: 'vehiclePhoto', label: 'Vehicle photo', hint: 'Show the full vehicle and number plate.', accept: 'image/jpeg,image/png,image/webp', when: 'ownsVehicle' },
  { key: 'insuranceDocument', label: 'Insurance proof', hint: 'Required if insurance is enabled or marked available.', accept: 'image/jpeg,image/png,image/webp,application/pdf', when: 'insurance' },
  { key: 'aadhaarDocument', label: 'Aadhaar proof', hint: 'Only if requested or provided.', accept: 'image/jpeg,image/png,image/webp,application/pdf', when: 'aadhaar', sensitive: true },
  { key: 'panDocument', label: 'PAN proof', hint: 'PAN card or proof showing your PAN.', accept: 'image/jpeg,image/png,image/webp,application/pdf', sensitive: true },
  { key: 'cancelledCheque', label: 'Cancelled cheque / passbook', hint: 'Optional bank proof.', accept: 'image/jpeg,image/png,image/webp,application/pdf', optional: true, sensitive: true },
  { key: 'additionalDocument1', label: 'Additional document 1', hint: 'Only if requested.', accept: 'image/jpeg,image/png,image/webp,application/pdf', optional: true, sensitive: true },
  { key: 'additionalDocument2', label: 'Additional document 2', hint: 'Only if requested.', accept: 'image/jpeg,image/png,image/webp,application/pdf', optional: true, sensitive: true },
];

export const RIDER_STEPS = ['Personal details', 'Address', 'Driving & vehicle', 'Work preferences', 'Verification & payment', 'Documents'];

export function riderFieldError(errors, path) {
  if (!errors) return '';
  return errors[path] || '';
}

export function riderStatusClass(status) {
  return {
    Submitted: 'bg-amber-100 text-amber-900',
    'Under Review': 'bg-blue-100 text-blue-900',
    'Additional Documents Required': 'bg-violet-100 text-violet-900',
    Approved: 'bg-emerald-100 text-emerald-900',
    Active: 'bg-emerald-600 text-white',
    Rejected: 'bg-red-100 text-red-900',
    Inactive: 'bg-slate-200 text-slate-700',
  }[status] || 'bg-brand-light text-brand-dark';
}
