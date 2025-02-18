// Importation du writable depuis Svelte
import { writable } from 'svelte/store';

// Fonction personnalisée pour créer un store persistant
function createPersistedStore(key, initial) {
  const stored = localStorage.getItem(key);
  const data = stored ? JSON.parse(stored) : initial;
  const store = writable(data);

  // Sauvegarde automatique dans localStorage à chaque changement de valeur
  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

// Création d'un store persistant pour la page actuelle du cube
export const faceActuelle = createPersistedStore('faceActuelle', 'front');
