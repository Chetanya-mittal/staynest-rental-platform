// Calculate number of nights between two dates
export const calculateNights = (checkIn: string | Date, checkOut: string | Date) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  const diffNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffNights;
};