<script>
  import { onMount } from 'svelte';
  import { utilisateurConnecte, estAuthentifie } from '../stores/sessionStore.js';

  onMount(async () => {
      try {
          const response = await fetch('http://localhost:3000/api/verifySession', {
              method: 'GET',
              credentials: 'include'
          });
          console.log("response", response);
          if (response.status === 200) {
              const data = await response.json();
              utilisateurConnecte.set(data.data); // Mettre à jour le store avec les données utilisateur
              estAuthentifie.set(true); // Met à jour l'état d'authentification
          } else {
              throw new Error('Utilisateur non connecté');
          }
      } catch (error) {
          utilisateurConnecte.set(null); // Réinitialise le store
          estAuthentifie.set(false); // Indique que l'utilisateur n'est pas authentifié
          console.error('Erreur de session:', error.message);
      }
  });
</script>

<!-- Ce composant ne rend rien visuellement -->
<div style="display: none;"></div>
