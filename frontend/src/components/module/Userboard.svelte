<script>
  // Imports
  import axios from 'axios';
  import { get } from "svelte/store";
  import { onMount } from 'svelte';
  import { utilisateurConnecte, estAuthentifie , infosUser} from '../../stores/sessionStore';
  import { faceActuelle } from '../../stores/cube';
  import UserInfo from '../../class/userClassInfo';
  onMount(async () => {    
    mounted = true;
    const userId = $utilisateurConnecte.id;
    try {
      const response = await axios.get(`http://localhost:3000/users/api/infos/get/${userId}`, { withCredentials: true });
      console.log("response.data", response.data.userProfile.firstName);
      infosUser.set(response.data.userProfile);
      console.log("getinfosUser", get(infosUser));
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
    }
   
    const res = await fetch('http://localhost:3000/csrf-token', { credentials: 'include' });
    const data = await res.json();
    csrfToken = data.csrfToken;
    console.info("Formulaire de login sécurisé avec token csrfToken pour infos user")
  });
  
  export let title = "Espaces utilisateur";
  let utilisateur;
  let buttonValiderEmail;
  let masqueInfoUser; 
  let divInfoMail;
  
  let inputNom;
  let inputPrenom;
  let inputTelephone;
  let inputAdresse;
  let inputDateDeNaissance;
  let buttonEnregistrerInfos;
  let csrfToken;
  let mounted = false;

  let getinfosUser;
  
   
  $: getinfosUser = $infosUser; // Cela met à jour getinfosUser automatiquement
  $: estConnecte = $estAuthentifie;
  $: face = $faceActuelle;
  $: {
    utilisateur = $utilisateurConnecte;
    // console.log('Utilisateur:', utilisateur);
    if (utilisateur.isvalid) {
      
      if(masqueInfoUser){
        masqueInfoUser.style.display = 'none';
        buttonValiderEmail.style.display = 'none';
        divInfoMail.innerHTML = 'Votre email est validé';
      }
    } else {
      // console.log('Utilisateur non valide:', utilisateur);
    }
  }

  function enregistrerInfos(event){
    event.preventDefault();
    buttonEnregistrerInfos.style.transform = "scale(0.9)";
    setTimeout(() => {
        buttonEnregistrerInfos.style.transform = "scale(1)";
    }, 150);
    console.log("csrfToken:", csrfToken);
    const userInfo = new UserInfo( utilisateur.id, inputNom.value, inputPrenom.value, inputAdresse.value, inputTelephone.value, inputDateDeNaissance.value, csrfToken);
    console.log("Enregistrement des informations:", userInfo);

    userInfo.saveInfosUser();

  }
  
  function validerEmail(event) {
    event.preventDefault();
    console.info("Envoi de l'email de validation");

    buttonValiderEmail.style.transform = "scale(0.9)";
    setTimeout(() => {
        buttonValiderEmail.style.transform = "scale(1)";
    }, 150);

    console.log("Utilisateur email:", utilisateur?.email); // Vérifie la présence de l'email

    if (!utilisateur?.email) {
        console.error("⚠️ L'email de l'utilisateur est introuvable !");
        return;
    }

    axios.post('http://localhost:3000/api/verify/mail', {
        email: utilisateur.email
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        console.log('✅ Réponse du serveur:', response.data);
    })
    .catch(error => {
        console.error('❌ Erreur lors de l\'envoi de la requête:', error);
    });
}


</script>

<h1>{title}</h1>
<div class="userboard-module">
  {#if mounted}
    <div class="content-left">
        <div class="column-top">
           
          <div class="photo-profil">
            </div>
           
            <div bind:this={divInfoMail} class="div-info-mail">
              {#if utilisateur.firstName}
                <p>{utilisateur.email}</p>
              {:else}
                <p>Pour accéder à nos services, veuillez valider votre adresse email.</p>
                <button id="button-valider-email" bind:this={buttonValiderEmail} on:click={validerEmail}>Valider mon email</button>
              {/if}
            </div>
        </div>

        
        <div class="column-bottom">
    
          <div bind:this={masqueInfoUser} class="masque-info-user">

            </div>
            {#if getinfosUser}
            <p>Nom: {getinfosUser.firstName}</p>
            <p>Prénom: {getinfosUser.lastName}</p>
            <p>Adresse: {getinfosUser.address}</p>
            <p>Date de Naissance: {getinfosUser.dateOfBirth}</p>
          {:else}
            
          
            <form class="user-form">
                <div class="form-group">
                    <label for="nom">Nom :</label>
                    <input bind:this={inputNom} type="text" id="nom" name="nom" placeholder="Votre nom">
                </div>
                <div class="form-group">
                    <label for="prenom">Prénom :</label>
                    <input bind:this={inputPrenom} type="text" id="prenom" name="prenom" placeholder="Votre prénom">
                </div>
                <div class="form-group">
                      <label for="adresse">Adresse :</label>
                    <input bind:this={inputAdresse} type="text" id="adresse" name="adresse" placeholder="Votre adresse">
                </div>
                <div class="form-group">
                    <label for="telephone">Téléphone :</label>
                    <input bind:this={inputTelephone} type="text" id="telephone" name="telephone" placeholder="Votre téléphone">
                </div>
                <div class="form-group">
                  <label for="dateDeNaissance">Date de naissance :</label>
                  <input bind:this={inputDateDeNaissance} type="date" id="dateDeNaissance" name="dateDeNaissance" placeholder="Votre date de naissance">
                </div>
                <button bind:this={buttonEnregistrerInfos} on:click={enregistrerInfos} class="submit-btn">Enregistrer</button>
            </form>
{/if}          

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
    flex-wrap: wrap;
    height: 75%;
    width: 100%;
    min-width: 550px;
    padding: 1rem;
    border-radius: 10px;
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
    width: 100%;
    height: 60%;
    background-color: rgb(92, 162, 223);
    color: black;
    padding: 0.5rem;
    border-radius: 10px 10px 0 0;
  }
  .photo-profil{
    width: 40%;
    height: 100%;
    background-color: aliceblue;
    color: black;
    border-radius: 50%;
    background-image: url('../../assets/img/profile.jpg');
    background-size: cover;
    background-position: center top;
  }
  .div-info-mail{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    width: 50%;
    height: 100%;
    background-color: aliceblue;
    color: black;
    padding: 0.5rem;
    border-radius: 10px;
  }
  .div-info-mail button{
    all: unset;
    background-color: rgb(92, 162, 223);
    color: black;
    padding: 0.6rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
  }
  .column-bottom{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    height: 55%;
    background-color: aliceblue;
    color: black;
  }
  .masque-info-user{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(83, 74, 74, 0.396);
    color: black;
    z-index: 100;
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
    width: 50%;
    height: 100%;
    background-color: aliceblue;
    color: black;
  }
  .onglet{
    position: absolute;
    width: auto;
    height: 50px;
    background-color: aliceblue;
    color: black;
    padding:  1rem;
    border-radius: 10px 10px 0 0;
  }
  .onglet:hover{    
    top: -20px;
    scale: 1.1;
    background-color: red;
  }
  .onglet1{
    top: -50px;
    background-color: blue;
  }
  .onglet2{
    top: -50px;
    left: 27%;
    background-color: blue;
  }

  .user-form {
    display: flex;
    /* flex-direction: column; */

    align-items: flex-start;
    flex-wrap: wrap;
    margin: 0 auto;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin: 5px;
  }

  label {
    margin-bottom: 0.5rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  .submit-btn {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: #5ca2df;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-inline: 10px;
    margin-bottom: 5px;
  }

  .submit-btn:hover {
    background-color: #4a90d9;
  }
</style>
