// store.js
import { writable } from 'svelte/store';

// Crée un store pour l'état de la Navbar
export const navbarState = writable({
  navbarIsOpen: false, // État initial : fermé
});