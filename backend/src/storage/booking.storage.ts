import { Booking } from '../models';
import { generateId } from '../utils/id-generator';
import { extractDate } from '../utils/date-utils';

/**
 * In-memory storage for bookings
 */
class BookingStorage {
  private bookings: Booking[] = [];

  /**
   * Get all bookings
   */
  findAll(): Booking[] {
    return [...this.bookings];
  }

  /**
   * Find bookings by date (YYYY-MM-DD format)
   */
  findByDate(date: string): Booking[] {
    return this.bookings.filter(booking => {
      const bookingDate = extractDate(booking.dateTime);
      return bookingDate === date;
    });
  }

  /**
   * Find booking by ID
   */
  findById(id: string): Booking | undefined {
    return this.bookings.find(booking => booking.id === id);
  }

  /**
   * Create a new booking
   */
  create(data: Omit<Booking, 'id'>): Booking {
    const booking: Booking = {
      id: generateId(),
      ...data
    };
    this.bookings.push(booking);
    return booking;
  }

  /**
   * Delete booking
   */
  delete(id: string): boolean {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) {
      return false;
    }
    this.bookings.splice(index, 1);
    return true;
  }

  /**
   * Clear all bookings
   */
  clear(): void {
    this.bookings = [];
  }
}

// Export singleton instance
export const bookingStorage = new BookingStorage();
