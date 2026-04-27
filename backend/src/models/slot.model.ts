/**
 * Slot entity - represents a time slot for booking
 */
export interface Slot {
  id: string;
  eventTypeId: string;
  ownerId: string;
  guestScenarioId: string;
  dateTime: string; // ISO 8601 date-time string
  isBooked?: boolean;
}

/**
 * Request model for creating a slot
 */
export interface CreateSlotRequest {
  eventTypeId: string;
  ownerId: string;
  guestScenarioId: string;
  dateTime: string; // ISO 8601 date-time string
}
