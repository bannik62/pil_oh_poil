import { writable } from 'svelte/store';
let allAppointments = writable([]);
let setUserAppointment = writable([]);
let userInfo = writable([]);
let messageStatus = writable([]);

export { allAppointments, setUserAppointment, userInfo, messageStatus };