import axios from "axios";
import { store } from "../stores/store";

// delay function
const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}

// define base url
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Show a loading functionality while waiting for a request
agent.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
})

// Target the response and delay it with 1 second
agent.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    } finally {
        store.uiStore.isIdle();
    }
});

export default agent;