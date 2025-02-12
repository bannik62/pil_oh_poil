<script>
  import { onMount } from 'svelte';
  import boudah from '../../../assets/img/boudah.jpg';
  import tablemassage from '../../../assets/img/tablemassage.jpg';
</script>

<main>
  <h2 class="h2-galerie">Prestations</h2>
  <section class="galerie">
        <img class="boudah1" src={boudah} alt="boudah" />
        <img class="tablemassage" src={tablemassage} alt="tabledemassage" />
        <img class="boudah2" src={boudah} alt="boudah" />
     
        <!-- Images will be added here -->
  </section>
</main>

<style>
  main {
    position: relative;
  }
  .galerie {
    position: relative;
    overflow: hidden;
    margin:0 auto;
    border: 0px solid rgb(83, 88, 243);
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgb(220, 213, 213);
    background-image: url(../../../assets/img/marbrevert.jpg);
    background-size: cover;
    background-position:20% 50%;
    background-attachment: fixed;
    background-repeat: repeat;
    margin-bottom: 70px;
    box-shadow: inset 10px -10px 10px rgba(0, 0, 0, 0.3), 0px 20px 15px #00fcff52;
    z-index: 1;
    isolation: isolate;
  }
  h2 {
    position: absolute;
        top: -43%;
        left: 50%;
        translate: calc(-50%);
        margin-bottom: 1rem;
        color: var(--color-secondary);
        font-family: Lavishly Yours;
        color: #fff;
        font-size: clamp(3rem, 14vw, 10rem);
        filter: drop-shadow(10px -8px 2px rgba(0, 0, 0, 0.5));
        z-index: 3;
  }


  .boudah1{
    border: 2px solid gold;
    width: 250px;
    height: 300px;
    object-fit: cover;
    transform: rotate(-20deg);
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
    /* z-index: -1; */
  }

  .boudah2{
    border: 2px solid gold;
    width: 250px;
    height: 300px;
    object-fit: cover;
    transform: scaleX(-1);
    transform: rotate(20deg);
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
  }

  .tablemassage{
    border: 2px solid gold;
    width: 350px;
    height: 300px;
    object-fit: cover;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);  
  }
  @media (min-width: 376px) and (max-width: 400px) {
    .galerie {
      height: 200vh;
    }
    h2 {
      top: -6%;
    }
    }
  @media (min-width: 375px) and (max-width: 375px) {
    
    .galerie {
      height: 200vh;
      
      background-size: cover;

    }
    .h2-galerie {
      top: -6%;
    }
    .h2-galerie {
      top: -6%;
    }
  }
  @media (min-width: 414px) and (max-width: 415px) {
    .galerie {
      height: 185vh;
    }
    h2 {
      top: -6%;
    }
  }
  @media  (max-width: 600px) {
    .galerie {
      width: 99%;
      height: 200vh;
      flex-wrap: wrap;
    }
    .boudah1 {
      width: 100%;
      transform: rotate(0deg);
    }
    .boudah2 {
      width: 100%;
      transform: rotate(0deg);
    }
  }
  @media (max-width: 768px) {

  }
</style>
