import { writable } from 'svelte/store';

export const systemInfo = writable(null);
export const diskUsage = writable(null);
export const cpuUsage = writable(null);
export const networkUsage = writable(null);
export const memoryUsage = writable(null);
export const storageUsage = writable(null);
