<script>
    import { onMount } from 'svelte';
    import Header from '../section/Header.svelte';
    import Presentation from '../section/Presentation.svelte';
    import Galerie from '../section/Galerie.svelte';
</script>

<main>
  <Header />
  <Presentation />
  <Galerie />
</main>

<style>
  main {
    width: 99vw;
    height: auto;
    background-color: var(--color-primary);
    display: flex;
    flex-direction: column;
    
  }

  /* Styles go here */
</style>
