/**
 * Event type entity - represents a type of event that can be booked
 */
export interface EventType {
  id: string;
  title: string;
  durationMinutes: number;
  text?: string;
}

/**
 * Request model for creating an event type
 */
export interface CreateEventTypeRequest {
  title: string;
  durationMinutes: number;
  text?: string;
}
