import { writable } from 'svelte/store';

export const allAppointments = writable([]);
export const currentWeek = writable([]);
export const selectedDay = writable(null);
export const selectedTimeSlots = writable([]);
export const weekOffset = writable(0);
// export const joursFermes = writable([0, 3]);
