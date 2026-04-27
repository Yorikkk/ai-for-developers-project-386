import { Slot, EventType, Booking } from '../models';
import { generateId } from './id-generator';

/**
 * Working hours constants
 */
const WORK_START_HOUR = 10; // 10:00
const WORK_END_HOUR = 18;   // 18:00

/**
 * Default values for generated slots
 */
const DEFAULT_OWNER_ID = 'owner-1';
const DEFAULT_GUEST_SCENARIO_ID = 'guest-scenario-1';

/**
 * Generate time slots for a specific date and event type
 * @param eventType - The event type configuration
 * @param date - Date in YYYY-MM-DD format
 * @returns Array of generated slots
 */
export function generateSlotsForDate(eventType: EventType, date: string): Slot[] {
  const slots: Slot[] = [];
  const durationMinutes = eventType.durationMinutes;

  // Calculate the last possible start time
  const lastStartHour = WORK_END_HOUR;
  const lastStartMinute = -durationMinutes; // Minutes before WORK_END_HOUR

  // Generate slots starting from WORK_START_HOUR:00
  let currentHour = WORK_START_HOUR;
  let currentMinute = 0;

  while (true) {
    // Check if we've exceeded the last possible start time
    const totalMinutes = currentHour * 60 + currentMinute;
    const lastTotalMinutes = lastStartHour * 60 + lastStartMinute;

    if (totalMinutes > lastTotalMinutes) {
      break;
    }

    // Create slot dateTime in ISO 8601 format (Moscow timezone UTC+3)
    const hourStr = String(currentHour).padStart(2, '0');
    const minuteStr = String(currentMinute).padStart(2, '0');
    const dateTime = `${date}T${hourStr}:${minuteStr}:00+03:00`;

    const slot: Slot = {
      id: generateId(),
      eventTypeId: eventType.id,
      ownerId: DEFAULT_OWNER_ID,
      guestScenarioId: DEFAULT_GUEST_SCENARIO_ID,
      dateTime,
    };

    slots.push(slot);

    // Move to next slot
    currentMinute += durationMinutes;
    
    // Handle minute overflow
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
}

/**
 * Check if a slot overlaps with any booking
 * @param slot - The slot to check
 * @param bookings - List of existing bookings
 * @param eventTypeDuration - Duration of the event type in minutes
 * @returns true if the slot is booked (overlaps with a booking), false otherwise
 */
export function checkSlotAvailability(
  slot: Slot,
  bookings: Booking[],
  eventTypeDuration: number
): boolean {
  const slotStart = new Date(slot.dateTime);
  const slotEnd = new Date(slotStart.getTime() + eventTypeDuration * 60 * 1000);

  for (const booking of bookings) {
    const bookingStart = new Date(booking.dateTime);
    const bookingEnd = new Date(bookingStart.getTime() + eventTypeDuration * 60 * 1000);

    // Check for overlap
    // Slots overlap if: slotStart < bookingEnd AND slotEnd > bookingStart
    if (slotStart < bookingEnd && slotEnd > bookingStart) {
      return true; // Slot is booked (overlaps)
    }
  }

  return false; // Slot is available
}

/**
 * Generate slots with availability information
 * @param eventType - The event type configuration
 * @param date - Date in YYYY-MM-DD format
 * @param bookings - List of existing bookings for this date and event type
 * @returns Array of slots with isBooked flag
 */
export function generateSlotsWithAvailability(
  eventType: EventType,
  date: string,
  bookings: Booking[]
): Slot[] {
  const slots = generateSlotsForDate(eventType, date);

  return slots.map(slot => ({
    ...slot,
    isBooked: checkSlotAvailability(slot, bookings, eventType.durationMinutes),
  }));
}
