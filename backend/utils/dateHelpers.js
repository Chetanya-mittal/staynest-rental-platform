// Calculate number of nights between two dates
export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  const diffNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffNights;
};

// Check if dates are valid for booking
export const validateDates = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0); // strip time component

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format';
  }
  if (start < today) {
    return 'Check-in date cannot be in the past';
  }
  if (end <= start) {
    return 'Check-out must be after check-in';
  }
  return null; // null means no error
};