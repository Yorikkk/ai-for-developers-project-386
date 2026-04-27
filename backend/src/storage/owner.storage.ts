import { Owner } from '../models';

/**
 * In-memory storage for owners
 */
class OwnerStorage {
  private owners: Owner[] = [];

  /**
   * Get all owners
   */
  findAll(): Owner[] {
    return [...this.owners];
  }

  /**
   * Find owner by ID
   */
  findById(id: string): Owner | undefined {
    return this.owners.find(owner => owner.id === id);
  }

  /**
   * Create a new owner
   */
  create(owner: Owner): Owner {
    this.owners.push(owner);
    return owner;
  }

  /**
   * Clear all owners
   */
  clear(): void {
    this.owners = [];
  }
}

// Export singleton instance
export const ownerStorage = new OwnerStorage();
