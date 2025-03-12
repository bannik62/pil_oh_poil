import { writable } from 'svelte/store';

// Fonction pour créer un store persistant
function createPersistentStore(key, initialValue) {
    // Récupérer la valeur depuis localStorage ou utiliser la valeur initiale
    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;

    const store = writable(initial);

    // Souscrire aux changements et mettre à jour localStorage
    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

// Créer les stores persistants
export const estAuthentifie = createPersistentStore('estAuthentifie', false);
export const utilisateurConnecte = createPersistentStore('utilisateurConnecte', null);
export const infosUser = createPersistentStore('infosUser', null);
export const isValid = createPersistentStore('isValid', false);
console.log('estAuthentifie store', estAuthentifie);
console.log('utilisateurConnecte store', utilisateurConnecte);
console.log('infosUser store', infosUser);
