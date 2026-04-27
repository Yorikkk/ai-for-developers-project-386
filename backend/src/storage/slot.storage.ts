import { Slot } from '../models';
import { generateId } from '../utils/id-generator';

/**
 * In-memory storage for slots
 */
class SlotStorage {
  private slots: Slot[] = [];

  /**
   * Get all slots
   */
  findAll(): Slot[] {
    return [...this.slots];
  }

  /**
   * Find slots by event type ID
   */
  findByEventTypeId(eventTypeId: string): Slot[] {
    return this.slots.filter(slot => slot.eventTypeId === eventTypeId);
  }

  /**
   * Find slot by ID
   */
  findById(id: string): Slot | undefined {
    return this.slots.find(slot => slot.id === id);
  }

  /**
   * Create a new slot
   */
  create(data: Omit<Slot, 'id'>): Slot {
    const slot: Slot = {
      id: generateId(),
      ...data
    };
    this.slots.push(slot);
    return slot;
  }

  /**
   * Delete slot
   */
  delete(id: string): boolean {
    const index = this.slots.findIndex(slot => slot.id === id);
    if (index === -1) {
      return false;
    }
    this.slots.splice(index, 1);
    return true;
  }

  /**
   * Clear all slots
   */
  clear(): void {
    this.slots = [];
  }
}

// Export singleton instance
export const slotStorage = new SlotStorage();
