import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

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
agent.interceptors.response.use(
    async response => {
        await sleep(1000);
        store.uiStore.isIdle();
        return response;
    },
    async error => {
        await sleep(1000);
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
                toast.error('Unauthorised');
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