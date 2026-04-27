/**
 * Booking entity - represents a confirmed booking
 */
export interface Booking {
  id: string;
  dateTime: string; // ISO 8601 date-time string
  eventTypeId: string;
  ownerId: string;
  guestScenarioId: string;
}

/**
 * Request model for creating a booking
 */
export interface CreateBookingRequest {
  dateTime: string; // ISO 8601 date-time string
  eventTypeId: string;
  ownerId: string;
  guestScenarioId: string;
}
