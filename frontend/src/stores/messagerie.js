import { writable } from 'svelte/store';

export const posts = writable([]);
export const author = writable('');
export const content = writable('');
export const messageStatus = writable("");
export const messageStatusType = writable(""); // "success" ou "error"


