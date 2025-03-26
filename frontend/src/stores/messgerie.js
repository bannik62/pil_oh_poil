import { writable } from 'svelte/store';

export const posts = writable([]);
export const author = writable('');
export const content = writable('');

