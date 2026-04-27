import { EventType } from '../models';
import { generateId } from '../utils/id-generator';

/**
 * In-memory storage for event types
 */
class EventTypeStorage {
  private eventTypes: EventType[] = [];

  /**
   * Get all event types
   */
  findAll(): EventType[] {
    return [...this.eventTypes];
  }

  /**
   * Find event type by ID
   */
  findById(id: string): EventType | undefined {
    return this.eventTypes.find(et => et.id === id);
  }

  /**
   * Create a new event type
   */
  create(data: Omit<EventType, 'id'>): EventType {
    const eventType: EventType = {
      id: generateId(),
      ...data
    };
    this.eventTypes.push(eventType);
    return eventType;
  }

  /**
   * Create event type with specific ID (for initialization)
   */
  createWithId(eventType: EventType): EventType {
    this.eventTypes.push(eventType);
    return eventType;
  }

  /**
   * Update event type
   */
  update(id: string, data: Partial<Omit<EventType, 'id'>>): EventType | undefined {
    const index = this.eventTypes.findIndex(et => et.id === id);
    if (index === -1) {
      return undefined;
    }
    this.eventTypes[index] = { ...this.eventTypes[index], ...data };
    return this.eventTypes[index];
  }

  /**
   * Delete event type
   */
  delete(id: string): boolean {
    const index = this.eventTypes.findIndex(et => et.id === id);
    if (index === -1) {
      return false;
    }
    this.eventTypes.splice(index, 1);
    return true;
  }

  /**
   * Clear all event types (for testing)
   */
  clear(): void {
    this.eventTypes = [];
  }
}

// Export singleton instance
export const eventTypeStorage = new EventTypeStorage();
