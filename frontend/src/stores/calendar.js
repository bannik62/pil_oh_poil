import { writable } from 'svelte/store';

export const selectedDay = writable('null');
export const selectedTimeSlot = writable(null);
export const currentWeek = writable([]);
export const weekOffset = writable(0);

export const joursFermes = writable([0, 3]); // Dimanche (0) et Mercredi (3)
