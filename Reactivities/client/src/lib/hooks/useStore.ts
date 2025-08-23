import { useContext } from "react";
import { StoreContext } from "../stores/store";

/**
 * A custom React hook for accessing the application-wide state store.
 *
 * This hook simplifies the process of consuming the `StoreContext` from anywhere
 * in the component tree, providing access to the centralized application state
 * and its associated actions.
 *
 * Features:
 * - Uses `useContext` to retrieve the store context.
 * - Provides a clear, concise way to access the store without needing to
 * directly import `StoreContext` in every component.
 *
 * Example usage:
 * ```tsx
 * const { someState, someAction } = useStore();
 *
 * // ... inside a component
 * <button onClick={() => someAction()}>Do something</button>
 * ```
 */
export function useStore() {
    return useContext(StoreContext)
}