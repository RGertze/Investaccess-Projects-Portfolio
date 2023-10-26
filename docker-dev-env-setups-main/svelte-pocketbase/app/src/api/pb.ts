
import PocketBase from "pocketbase";
import { writable } from "svelte/store";

const pocketbase = new PocketBase("http://0.0.0.0:8090");

export const isAuthenticated = writable(pocketbase.authStore.isValid);

pocketbase.authStore.onChange(() => {
    isAuthenticated.set(pocketbase.authStore.isValid);
});

export default pocketbase;