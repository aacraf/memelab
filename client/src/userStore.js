
import { writable } from 'svelte/store';

export const user = writable(localStorage.getItem("user") || "");

user.subscribe(val => localStorage.setItem("user", val));

