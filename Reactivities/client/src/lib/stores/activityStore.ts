import { action, makeObservable, observable } from "mobx";

/**
 * MobX store for managing activity list filters and start date.
 *
 * Observables:
 * - `filter` (`string`): Current filter applied to the activities list
 *   - `"all"`: Show all activities
 *   - `"isGoing"`: Show activities the current user is attending
 *   - `"isHost"`: Show activities the current user is hosting
 * - `startDate` (`string`): ISO date string for filtering activities by start date
 *
 * Actions:
 * - `setFilter(filter: string)`: Updates the current filter
 * - `setStartDate(date: Date)`: Updates the start date as an ISO string
 *
 * @example
 * const store = new ActivityStore();
 * store.setFilter('isGoing'); // Show only activities I'm going to
 * store.setStartDate(new Date(2025, 0, 1)); // Filter activities starting Jan 1, 2025
 */
export class ActivityStore {
    filter = 'all';
    startDate = new Date().toISOString();

    constructor() {
        makeObservable(this, {
            filter: observable,
            startDate: observable,
            setFilter: action,
            setStartDate: action
        });
    }

    setFilter = (filter: string) => {
        this.filter = filter
    }

    setStartDate = (date: Date) => {
        this.startDate = date.toISOString()
    }
}