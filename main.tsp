import "@typespec/rest";
import "@typespec/openapi3";
import "@typespec/versioning";

using TypeSpec.Rest;
using TypeSpec.Http;
using TypeSpec.Versioning;

@service(#{
  title: "Booking API",
})
@server("https://api.example.com", "Production server")
namespace BookingApi {
  /** Owner entity */
  model Owner {
    id: string;
    name: string;
  }

  /** Event type entity */
  model EventType {
    id: string;
    title: string;
    durationMinutes: int32;
  }

  /** Guest scenario entity */
  model GuestScenario {
    id: string;
    name: string;
  }

  /** Slot entity */
  model Slot {
    id: string;
    eventTypeId: string;
    ownerId: string;
    guestScenarioId: string;
    dateTime: utcDateTime;
  }

  /** Booking entity */
  model Booking {
    id: string;
    dateTime: utcDateTime;
    eventTypeId: string;
    ownerId: string;
    guestScenarioId: string;
  }

  /** Request for creating an event type */
  model CreateEventTypeRequest {
    title: string;
    durationMinutes: int32;
  }

  /** Request for creating a slot */
  model CreateSlotRequest {
    eventTypeId: string;
    ownerId: string;
    guestScenarioId: string;
    dateTime: utcDateTime;
  }

  /** Request for creating a booking */
  model CreateBookingRequest {
    dateTime: utcDateTime;
    eventTypeId: string;
    ownerId: string;
    guestScenarioId: string;
  }

  /** Error response model */
  model ErrorResponse {
    code: string;
    message: string;
  }

  interface EventTypes {
    /** Create a new event type */
    @post
    @route("/event-types")
    createEventType(
      @body request: CreateEventTypeRequest
    ): EventType | ErrorResponse;

    /** Get event type by ID */
    @get
    @route("/event-types/{eventTypeId}")
    getEventType(
      @path eventTypeId: string
    ): EventType | ErrorResponse;

    /** Get list of event types */
    @get
    @route("/event-types")
    listEventTypes(): EventType[] | ErrorResponse;
  }

  interface Slots {
    /** Get list of slots */
    @get
    @route("/slots")
    listSlots(@query eventTypeId?: string): Slot[] | ErrorResponse;
  }

  interface Bookings {
    /** Create a new booking */
    @post
    @route("/bookings")
    createBooking(
      @body request: CreateBookingRequest
    ): Booking | ErrorResponse;

    /** Get list of bookings */
    @get
    @route("/bookings")
    listBookings(@query date?: plainDate): Booking[] | ErrorResponse;
  }
}