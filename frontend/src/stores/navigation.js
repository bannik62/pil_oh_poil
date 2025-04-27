// store.js
import { writable } from 'svelte/store';

// Fonction pour synchroniser l'état avec le localStorage
function syncWithLocalStorage(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const store = writable(storedValue ? JSON.parse(storedValue) : initialValue);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

// Crée un store pour l'état de la Navbar et le synchronise avec le localStorage
export const navbarState = syncWithLocalStorage('navbarState', {
    navbarIsOpen: false, // État initial : fermé
});

