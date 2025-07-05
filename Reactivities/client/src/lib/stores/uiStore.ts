import { makeAutoObservable } from "mobx";

export class UiStore {
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    // set loading to true
    isBusy() {
        this.isLoading = true;
    }

    // set loading to false
    isIdle() {
        this.isLoading = false;
    }
}