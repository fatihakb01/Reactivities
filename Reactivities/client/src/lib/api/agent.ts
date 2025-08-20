import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

/**
 * Simulates an artificial delay.
 * Useful for testing UI loading states or slow network simulation.
 * @param delay - Time in milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}

// Create Axios instance with default settings
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

/**
 * Request interceptor.
 * - Triggers `isBusy()` on every outgoing request to set UI loading state.
 */
agent.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
})

/**
 * Response interceptor.
 * - On success: delays response and resets loading state.
 * - On error: handles global HTTP errors and routing.
 */
agent.interceptors.response.use(
    async response => {
        if (import.meta.env.DEV) {
            await sleep(500);
        }        
        store.uiStore.isIdle();
        return response;
    },
    async error => {
        if (import.meta.env.DEV) {
            await sleep(500);
        }
        store.uiStore.isIdle();
        const {status, data} = error.response;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    console.error("400 error data:", data);
                    toast.error(typeof data === 'string' ? data : JSON.stringify(data));
                }
                break;
            case 401:
                if (data.detail === 'NotAllowed') {
                    throw new Error(data.detail)
                } else {
                    toast.error('Unauthorised');
                }
                break;    
            case 404:
                router.navigate('/not-found');
                break;     
            case 500:
                router.navigate('/server-error', {state: {error: data}});
                break;     
            default:
                break; 
        }

        return Promise.reject(error);
    }
);

export default agent;
