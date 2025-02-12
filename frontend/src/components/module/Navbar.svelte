<script>
  import { onMount } from 'svelte';

  let navbarElement;
  let isOpen = false;

  onMount(() => {
    navbarElement = document.querySelector('.navbar');
  });


</script>

<div class="content-system-nav">
    <div class="navbar">
      <a href="#"
        >Epilation
        <div class="epilation icone"></div></a
      >
      <a href="#"
        >Soins
        <div class="soins icone"></div></a
      >
      <a href="#"
        >Sourcils
        <div class="sourcil icone"></div></a
      >
      <a href="#"
        >Massages
        <div class="massage icone"></div></a
      >
    </div>
  </div>
<style>
    .content-system-nav {
    position: relative;
    width: 50%;
    height: 10vh;
    
  }
 .navbar {
    z-index: 1;
    position: absolute;
    top: 10px;
    left: 0;
    transform: translateX(-100%);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    border: 1px solid var(--color-secondary);
    border-radius: 10px;
    transition: transform 0.3s ease;
    z-index: 2;
    background-color: rgba(
      240,
      248,
      255,
      0.374
    ); /* aliceblue with 0.8 opacity */
    backdrop-filter: blur(5px);
  }
  .navbar a {
    display: flex;
    align-items: center;
    gap: 10px;
    color: black;
  }
  .navbar a:hover {
    filter: drop-shadow(20px -20px 10px rgba(122, 236, 126, 0.5));
    text-decoration: underline;
    color: white;
  }
  .massage {
    background-image: url(../../assets/img/massagecouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
  .epilation {
    background-image: url(../../assets/img/epilationCouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    isolation: isolate;
  }
  .soins {
    background-image: url(../../assets/img/soinsCouleurs.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
  .sourcil {
    background-image: url(../../assets/img/sourcilcouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }



</style>
