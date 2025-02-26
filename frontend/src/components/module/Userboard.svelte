<script>
  // Imports
  import { onMount } from 'svelte';

  export let title = "Espaces utilisateur";

  // Variables
  let mounted = false;

  // Lifecycle
  onMount(() => {
    mounted = true;
    // Vérifier si le cookie de session SessionCookiePilOhPoil est présent

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
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 80%;
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
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 90%;
    background-color: aliceblue;
    color: black;
    box-sizing: border-box;
    border-radius: 10px 0px 0px 0px;
    border-bottom: 2px solid var(--color-primary);
  }
  .photo-profil{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 15px solid var(--color-primary);
  }
  .div-info-mail{
    width: 50%;
    height: 100%;
    background-color: aliceblue;
    color: black;
    border-radius: 0px 0px 0px 10px;
    padding: 1rem;
    box-sizing: border-box;
  }
  .column-bottom{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    height: 60%;
    background-color: aliceblue;
    color: black;
    border-radius: 0px 0px 0px 10px;
    padding: 1rem;
    box-sizing: border-box;
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
    height: 10vh;
    background-color: aliceblue;
    color: black;
    padding:  1rem;
    border-radius: 10px 10px 0 0;
  }
  .onglet:hover{    
    top: -18%;
    scale: 1.1;
    background-color: red;
  }
  .onglet1{
    top: -17%;
    background-color: blue;
  }
  .onglet2{
    top: -17%;
    left: 27%;
    background-color: blue;
  }

</style>
