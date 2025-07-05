import {makeAutoObservable} from 'mobx';

// Define class for counting stores
export default class CounterStore {
    title = 'Counter store';
    count = 42;
    events: string[] = [
        `Initial count is ${this.count}`
    ]

    // title and count are marked as observable, 
    // meaning any component that uses them will automatically re-render when they change.
    // increment & decrement are specified as actions
    // meaning they will do something when being called (i.e. increment or decrement)
    // makeAutoObservable recognizes this automatically
    constructor() {
        makeAutoObservable(this)
    }

    // increment function
    // arrow function will automatically bound the method to the class
    increment = (amount = 1) => {
        this.count += amount;
        this.events.push(`Incremented by ${amount} - count is now ${this.count}`);
    }

    // decrement function
    decrement = (amount = 1) => {
        this.count -= amount;
        this.events.push(`Decremented by ${amount} - count is now ${this.count}`);
    }

    // Computed property
    get eventCount() {
        return this.events.length;
    }
}
