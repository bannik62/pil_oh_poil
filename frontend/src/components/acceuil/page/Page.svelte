<script>
    import { onMount } from 'svelte';
    import Header from '../section/Header.svelte';
    import Presentation from '../section/Presentation.svelte';
    import Galerie from '../section/Galerie.svelte';
    import Caroussel from '../section/Caroussel.svelte';
    import Thesaloon from '../section/thesaloon.svelte';
    import Footer from '../section/Footeur.svelte';
</script>

<main>
  <Header />
  <Presentation />
  <Thesaloon />
  <Galerie />
  <Caroussel />
  <Footer />
</main>

<style>
  main {
    width: 100vw;
    height: auto;
    display: flex;
    flex-direction: column;
    
  }

  /* Styles go here */
</style>
