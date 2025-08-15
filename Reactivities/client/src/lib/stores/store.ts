import { createContext } from "react";
import CounterStore from "./counterStore";
import { UiStore } from "./uiStore";
import { ActivityStore } from "./activityStore";

// Store is a TypeScript interface that defines the shape of your global store object
interface Store {
    counterStore: CounterStore
    uiStore: UiStore
    activityStore: ActivityStore
}

// store is an instance of that interface, containing counterStore, uiStore and activityStore.
export const store: Store = {
    counterStore: new CounterStore(),
    uiStore: new UiStore(),
    activityStore: new ActivityStore()
}

// StoreContext is a React context that holds the store and the uiStore, 
// allowing you to access it from any component using useContext.
export const StoreContext = createContext(store);
