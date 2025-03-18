<script>
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    let title = "Messagerie";
    let mounted = false;
    onMount(() => {
        mounted = true;
        console.log("Messagerie component mounted");
    });
  </script>
  
  <div class="rdv-container" transition:fade>
    <h1>{title}</h1>
    <p>Composant de messagerie en construction...</p>
  </div>
  
  <style>
    .rdv-container {
        width: 100%;
        height: 100%;
        padding: 1rem;
        background-color: #f0f0f0;
    }
    
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
  </style>
  