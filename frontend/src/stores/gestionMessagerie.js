import { writable } from 'svelte/store';

export let messagesUsers = writable([]);
export let readMessageUsers = writable([]);

