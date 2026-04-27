import { GuestScenario } from '../models';

/**
 * In-memory storage for guest scenarios
 */
class GuestScenarioStorage {
  private guestScenarios: GuestScenario[] = [];

  /**
   * Get all guest scenarios
   */
  findAll(): GuestScenario[] {
    return [...this.guestScenarios];
  }

  /**
   * Find guest scenario by ID
   */
  findById(id: string): GuestScenario | undefined {
    return this.guestScenarios.find(gs => gs.id === id);
  }

  /**
   * Create a new guest scenario
   */
  create(guestScenario: GuestScenario): GuestScenario {
    this.guestScenarios.push(guestScenario);
    return guestScenario;
  }

  /**
   * Clear all guest scenarios
   */
  clear(): void {
    this.guestScenarios = [];
  }
}

// Export singleton instance
export const guestScenarioStorage = new GuestScenarioStorage();
