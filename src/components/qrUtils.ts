import { v4 as uuidv4 } from 'uuid';

export function generateBookingQR(bookingId: string): string {
  // You can encode more info if needed
  return uuidv4() + '-' + bookingId;
}
