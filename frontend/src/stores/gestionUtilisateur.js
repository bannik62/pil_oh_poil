import { writable } from 'svelte/store';
let numberOfUsers = writable(0);
let searchQuery = writable('');
let searchType = writable('name');
let erreurMessage = writable('');
let users = writable([]);
let usersWithProfiles = writable([]);

export {users, numberOfUsers, searchQuery, searchType, erreurMessage, usersWithProfiles };
