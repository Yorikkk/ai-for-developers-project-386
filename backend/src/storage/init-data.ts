import { eventTypeStorage } from './event-type.storage';
import { ownerStorage } from './owner.storage';
import { guestScenarioStorage } from './guest-scenario.storage';

/**
 * Initialize storage with predefined data
 */
export function initializeData(): void {
  console.log('Initializing storage with predefined data...');

  // Initialize event types (as per requirements)
  eventTypeStorage.createWithId({
    id: 'event-type-1',
    title: 'Короткий тип событий для быстрого слота',
    durationMinutes: 15,
  });

  eventTypeStorage.createWithId({
    id: 'event-type-2',
    title: 'Базовый тип события для бронирования',
    durationMinutes: 30,
  });

  // Initialize owners (predefined)
  ownerStorage.create({
    id: 'owner-1',
    name: 'Иван Иванов',
  });

  ownerStorage.create({
    id: 'owner-2',
    name: 'Мария Петрова',
  });

  // Initialize guest scenarios (predefined)
  guestScenarioStorage.create({
    id: 'guest-scenario-1',
    name: 'Первая встреча',
  });

  guestScenarioStorage.create({
    id: 'guest-scenario-2',
    name: 'Повторная консультация',
  });

  console.log('Storage initialized successfully.');
  console.log(`- Event types: ${eventTypeStorage.findAll().length}`);
  console.log(`- Owners: ${ownerStorage.findAll().length}`);
  console.log(`- Guest scenarios: ${guestScenarioStorage.findAll().length}`);
}
