<script>
  // Imports
  import { onMount } from 'svelte';

  // Props
  export let title = "Espaces utilisateur";

  // Variables
  let mounted = false;

  // Lifecycle
  onMount(() => {
    mounted = true;
  });
</script>

<h1>{title}</h1>
<div class="userboard-module">
  {#if mounted}
    <div class="content-left">
        <div class="column-top">
            <div class="photo-profil">

            </div>
           
            <div class="div-info-mail">
              <p>hello</p>
            </div>
        </div>
        <div class="column-bottom">
            <p><span>nom :</span></p>
            <p><span>prenom :</span></p>
            <p><span>adresse :  </span></p>
            <p><span>telephone :</span></p>
        </div>
      <!-- Content goes here -->
    </div>

    <div class="content-right">
        <div class="onglet onglet1">
            <p>Prendre rendez vous </p>
        </div>
        <div class="onglet onglet2">
            <p>Informations Pile oh poil </p>
        </div>
        <div class="module-rdv">
            <p>Rdv</p>
        </div>
    </div>
  {/if}
</div>

<style>
  .userboard-module {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 75%;
    width: 100%;
    padding: 1rem;
  }
  .content-left{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    width: 50%;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .column-top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    height: 40%;
    background-color: aliceblue;
    color: black;
  }
  .photo-profil{
    width: 100%;
    height: 100%;
    background-color: aliceblue;
    color: black;
    border-radius: 50%;
  }
  .column-bottom{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 90%;
    height: 50%;
    background-color: aliceblue;
    color: black;
  }
  p{
    all: unset;
  }
  .content-right{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    height: 100%;
    background-color: aliceblue;
    color: black;
  }
  .onglet{
    position: absolute;
    width: auto;
    height: 10%;
    background-color: aliceblue;
    color: black;
    padding:  1rem;
    border-radius: 10px 10px 0 0;
  }
  .onglet:hover{    
    top: -19%;
    scale: 1.1;
    background-color: red;
  }
  .onglet1{
    top: -18%;
    background-color: blue;
  }
  .onglet2{
    top: -18%;
    left: 27%;
    background-color: blue;
  }

</style>
