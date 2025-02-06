<script>
  import { onMount } from 'svelte';
  // Logic goes here
</script>

<main>
  <section class="galerie">
   
    <div class="grid-container">
      <!-- Images will be added here -->
    </div>
  </section>
</main>

<style>
  .galerie {
    width: 100%;
    height: 60vh;
    background-color: var(--color-primary);
    background-image: url(../../../assets/img/Group.png);
    background-size: cover;
    background-position:20% 50%;
    background-repeat: no-repeat;
    margin-bottom: 100px;
  }



  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding: 0 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr;
    }
  }
</style>
