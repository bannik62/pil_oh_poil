<script>
  // Imports
  import axios from "axios";
  import { onMount } from "svelte";
  import {
    utilisateurConnecte,
    estAuthentifie,
    infosUser,
    isValid,
    displayService,
  } from "../../stores/sessionStore";
  import { faceActuelle } from "../../stores/cube";
  import UserInfo from "../../class/userClassInfo";
  import Rdv from "./services/Rdv.svelte";
  import Messagerie from "./services/Messagerie.svelte";

  let csrfToken;
  let mounted = false;

  const fetchIsValide = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/checkisvalid/${userId}`,
        { withCredentials: true }
      );

      console.log("response.data", response.data.isValid);
      isValid.set(response.data.isValid);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'utilisateur:",
        error
      );
    }
  };
 
  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/api/infos/get/${userId}`,
        { withCredentials: true }
      );
      console.log("setInfosInTheStore:", response.data.userProfile);
      infosUser.set(response.data.userProfile);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'utilisateur:",
        error
      );
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const res = await fetch("http://localhost:3000/csrf-token", {
        credentials: "include",
      });
      const data = await res.json();
      csrfToken = data.csrfToken;
      console.info(
        "Formulaire de login sécurisé avec token csrfToken pour infos user"
      );
    } catch (error) {
      console.error("Erreur lors de la récupération du token CSRF:", error);
    }
  };

  onMount(async () => {
    mounted = true;
    const userId = $utilisateurConnecte.id;
    console.log("utilisateurConnectepourrole", $utilisateurConnecte.role);
    if ($utilisateurConnecte.role === "user") {
      fetchUserInfo(userId);  
      await fetchCsrfToken();
      await fetchIsValide(userId);
    console.log("utilisateur.role", $utilisateurConnecte.role);
  }

  });

  export let title = "Espaces utilisateur";
  let utilisateur;
  let utilisateurMailIsValid;
  let buttonValiderEmail;
  let masqueInfoUser;
  let masqueService;
  export let divInfoMail;
  let inputNom;
  let inputPrenom;
  let inputTelephone;
  let inputAdresse;
  let inputDateDeNaissance;
  let buttonEnregistrerInfos;
  let buttonUpdateInfos;
  let getinfosUser;
  let registrer = false;
  let ongletRdv;
  let ongletMessagerie;
  // les erreurs
  let erreurMiseAJour;

  function setDisplayService(service) {
    displayService.set(service);
    console.log("displayService:", $displayService);
  }

  $: utilisateur = $utilisateurConnecte;
  $: getinfosUser = $infosUser;
  console.log("getinfosUser:", $getinfosUser);
  $: estConnecte = $estAuthentifie;
  $: face = $faceActuelle;
  $: {
    utilisateurMailIsValid = $isValid;
    console.log("UtilisateurmailisValid:", utilisateurMailIsValid);
    if (utilisateurMailIsValid === true) {
      if (masqueInfoUser) {
        masqueInfoUser.style.display = "none";
        buttonValiderEmail.style.display = "none";
        divInfoMail.innerHTML = `
        <p>Votre email</p>
        <p> ${utilisateur.email}</p>
        <p>  est validé ✅</p>
        <p>Vous pouvez maintenant accéder à nos services</p>
        `;
        console.log("message:", erreurMiseAJour);
        // if (masqueInfoUser && erreurMiseAJour !== "") {

        //   const p = document.createElement('p');
        //   p.textContent = `status: ${erreurMiseAJour}`;
        //   p.classList.add('error-message');
        //   divInfoMail.appendChild(p);
        //   divInfoMail.classList.add('error-message');
        // } else if (getinfosUser) {
        //   const p = document.createElement('p');
        //   p.textContent = `Vos informations ont été mises à jour avec succès ${getinfosUser.firstName}`;
        //   p.classList.add('success-message');
        //   divInfoMail.appendChild(p);
        //    }
      }
    } else {
      // console.log('Utilisateur non valide:', utilisateur);
    }
  }

  function enregistrerInfos(event) {
    event.preventDefault();
    erreurMiseAJour = "";

    // Animation du bouton
    buttonEnregistrerInfos.style.transform = "scale(0.9)";
    setTimeout(() => {
      buttonEnregistrerInfos.style.transform = "scale(1)";
    }, 150);

    console.log("csrfToken userboard:", csrfToken);

    // Création de l'objet userInfo
    const userInfo = new UserInfo(
      utilisateur.id,
      inputNom.value,
      inputPrenom.value,
      inputAdresse.value,
      inputTelephone.value,
      inputDateDeNaissance.value,
      csrfToken
    );

    console.log("Enregistrement des informations:", userInfo);

    try {
      // Tente d'enregistrer les infos utilisateur
      const result = userInfo.saveInfosUser();
      erreurMiseAJour = ""; // Réinitialisation de l'erreur si succès

      // Récupération des nouvelles infos après enregistrement réussi
      setTimeout(() => {
        fetchUserInfo(utilisateur.id);
      }, 2000);
    } catch (error) {
      // Capture et affichage de l'erreur
      console.error("Erreur lors de l'enregistrement :", error);
      erreurMiseAJour =
        error || "Une erreur est survenue lors de la mise à jour.";

      // Efface le message d'erreur après 5 secondes
      setTimeout(() => {
        erreurMiseAJour = "";
      }, 5000);
    }
  }

  // À l'intérieur de la fonction modifierInfos
  async function modifierInfos(event) {
    event.preventDefault();
    console.log("🔹 Début de modifierInfos");

    // Animation du bouton
    buttonUpdateInfos.style.transform = "scale(0.9)";
    setTimeout(() => {
      buttonUpdateInfos.style.transform = "scale(1)";
    }, 150);

    console.log("🔹 csrfToken:", csrfToken);

    let updatedFields = {};
    let erreurs = []; // Tableau pour stocker les erreurs

    updatedFields.userId = utilisateur.id;
    updatedFields.csrfToken = csrfToken;

    // Validation et ajout des champs modifiés
    if (inputNom.value.trim() !== utilisateur.firstName) {
      if (inputNom.value.length >= 2 || inputNom.value.length === 0) {
        updatedFields.firstName = inputNom.value;
      } else {
        erreurs.push("Le nom doit contenir au moins 2 caractères.");
      }
    }

    if (inputPrenom.value.trim() !== utilisateur.lastName) {
      if (inputPrenom.value.length >= 2 || inputPrenom.value.length === 0) {
        updatedFields.lastName = inputPrenom.value;
      } else {
        erreurs.push("Le prénom doit contenir au moins 2 caractères.");
      }
    }

    if (inputAdresse.value.trim() !== utilisateur.address) {
      if (inputAdresse.value.length >= 2 || inputAdresse.value.length === 0) {
        updatedFields.address = inputAdresse.value;
      } else {
        erreurs.push("L'adresse doit contenir au moins 2 caractères.");
      }
    }

    if (inputTelephone.value.trim() !== utilisateur.telephone) {
      if (
        /^\d{10}$/.test(inputTelephone.value) ||
        inputTelephone.value.length === 0
      ) {
        updatedFields.telephone = inputTelephone.value;
      } else {
        erreurs.push(
          "Le numéro de téléphone doit contenir exactement 10 chiffres."
        );
      }
    }

    if (inputDateDeNaissance.value.trim() !== utilisateur.dateOfBirth) {
      if (
        inputDateDeNaissance.value.length >= 2 ||
        inputDateDeNaissance.value.length === 0
      ) {
        updatedFields.dateOfBirth = inputDateDeNaissance.value;
      } else {
        erreurs.push("La date de naissance est invalide.");
      }
    }

    console.log("🔹 Champs modifiés:", updatedFields);
    console.log("🔹 Erreurs détectées:", erreurs);

    // Affichage des erreurs si elles existent
    divInfoMail.innerHTML = `
          <p>Votre email</p>
          <p> ${utilisateur.email}</p>
          <p>  est validé ✅</p>
          <p>Vous pouvez maintenant accéder à nos services</p>`;
    if (erreurs.length > 0) {
      erreurs.forEach((err) => {
        const p = document.createElement("p");
        p.textContent = err;
        p.classList.add("error-message");
        divInfoMail.appendChild(p);
      });
      return; // Stoppe l'exécution si des erreurs sont présentes
    }

    try {
      if (Object.keys(updatedFields).length > 2) {
        const userInfo = new UserInfo(
          utilisateur.id,
          null,
          null,
          null,
          null,
          null,
          csrfToken
        );

        const result = await userInfo
          .updateUserInfos(updatedFields)
          .then((response) => {
            console.log("✅ Réponse reçue:", response);

            // Mise à jour du message d'erreur ou de succès
            if (response.message) {
              erreurMiseAJour = response.message;
            } else {
              erreurMiseAJour = `Vos informations ont été mises à jour avec succès ${response.firstName}`;
            }

            // Affichage de l'erreur ou du succès dans l'UI
            const p = document.createElement("p");
            p.textContent = erreurMiseAJour;
            p.classList.add(
              response.message ? "error-message" : "success-message"
            );
            divInfoMail.appendChild(p);

            // Rechargement des infos après modification
            setTimeout(() => {
              console.log("🔹 Rechargement des infos...");
              fetchUserInfo(utilisateur.id);
            }, 2000);
          })
          .catch((error) => {
            console.error("❌ Erreur lors de la mise à jour :", error);
            erreurMiseAJour = "Erreur lors de la mise à jour. Réessayez.";
            const p = document.createElement("p");
            p.textContent = erreurMiseAJour;
            p.classList.add("error-message");
            divInfoMail.appendChild(p);
          });
      } else {
        console.log("⚠️ Aucune modification à envoyer.");
      }
    } catch (error) {
      console.error("❌ Erreur dans le try/catch :", error);
    }
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

    axios
      .post(
        "http://localhost:3000/api/verify/mail",
        {
          email: utilisateur.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("✅ Réponse du serveur:", response.data);

        // Stockez l'identifiant de l'intervalle
        const intervalId = setInterval(() => {
          fetchIsValide(utilisateur.id);
          console.log("isValid before:", isValid);
          // Vérifiez la valeur de isValid
          if (utilisateurMailIsValid === true) {
            // Utilisez $ pour accéder à la valeur du store mis a jour
            console.log("isValid in if:", $isValid);
            clearInterval(intervalId); // Arrêtez l'intervalle si isValid est vrai
          }
        }, 5000);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de l'envoi de la requête:", error);
      });
  }
</script>

<h1>{title}</h1>
<div class="userboard-module">
  {#if mounted}
    <div class="content-left">
      <div class="column-top">
        <div class="photo-profil" />
        <div bind:this={divInfoMail} class="div-info-mail">
          <p>
            Pour accéder à nos services, veuillez valider votre adresse email.
          </p>
          <button
            id="button-valider-email"
            bind:this={buttonValiderEmail}
            on:click={validerEmail}>Valider mon email</button
          >
        </div>
      </div>

      <div class="column-bottom">
        <div bind:this={masqueInfoUser} class="masque-info-user" />
        {#if getinfosUser !== null}
          <div class="infos-user">
            <div class="firstname">
              <p>Nom: {getinfosUser.firstName}</p>
            </div>
            <div class="lastname">
              <p>Prénom: {getinfosUser.lastName}</p>
            </div>
            <div class="address">
              <p>Adresse: {getinfosUser.address}</p>
            </div>
            <div class="date-of-birth">
              <p>Date de Naissance: {getinfosUser.dateOfBirth.split('T')[0]}</p>
            </div>
            <div class="telephone">
              <p>Téléphone: {getinfosUser.telephone}</p>
            </div>
            <button class="button-update-infos"
              on:click={() => {
                registrer = true;
                infosUser.set(null);
              }}>Mettre à jour</button
            >
          </div>
        {:else}
          <form class="user-form">
            <div class="form-group">
              <label for="nom">Nom :</label>
              <input
                bind:this={inputNom}
                type="text"
                id="nom"
                name="nom"
                placeholder="Votre nom"
              />
            </div>
            <div class="form-group">
              <label for="prenom">Prénom :</label>
              <input
                bind:this={inputPrenom}
                type="text"
                id="prenom"
                name="prenom"
                placeholder="Votre prénom"
              />
            </div>
            <div class="form-group">
              <label for="adresse">Adresse :</label>
              <input
                bind:this={inputAdresse}
                type="text"
                id="adresse"
                name="adresse"
                placeholder="Votre adresse"
              />
            </div>
            <div class="form-group">
              <label for="telephone">Téléphone :</label>
              <input
                bind:this={inputTelephone}
                type="text"
                id="telephone"
                name="telephone"
                placeholder="Votre téléphone"
              />
            </div>
            <div class="form-group">
              <label for="dateDeNaissance">Date de naissance :</label>
              <input
                bind:this={inputDateDeNaissance}
                type="date"
                id="dateDeNaissance"
                name="dateDeNaissance"
                placeholder="Votre date de naissance"
              />
            </div>
            {#if registrer === true}
              <button
                bind:this={buttonUpdateInfos}
                on:click={modifierInfos}
                class="submit-btn">Mettre à jour</button
              >
            {:else}
              <button
                bind:this={buttonEnregistrerInfos}
                on:click={enregistrerInfos}
                class="submit-btn">Enregistrer</button
              >
            {/if}
          </form>
        {/if}
      </div>
      <!-- Content goes here -->
    </div>

    <div class="content-right">
      <button
        bind:this={ongletRdv}
        on:click={() => setDisplayService("rdv")}
        class="onglet onglet1"
      >
        <p>Prendre rendez vous</p>
      </button>
      <button
        bind:this={ongletMessagerie}
        on:click={() => setDisplayService("messagerie")}
        class="onglet onglet2"
      >
        <p>Messagerie Pile oh poil</p>
      </button>
      <div class="module-service">
        {#if getinfosUser !== null}
          {#if $displayService === "rdv" }
            <Rdv {divInfoMail} />
          {:else if $displayService === "messagerie"}
            <Messagerie {divInfoMail} />
          {/if}
        {:else}
          <div bind:this={masqueService} class="masque-service">
            <p>Veuillez remplir vos informations personnelles</p>
            <p>pour accéder à nos services</p>
          </div>
        {/if}
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
  .content-left {
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
  .column-top {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 65%;
    background-color: rgb(92, 162, 223);
    color: black;
    padding: 0.5rem;
    border-radius: 10px 10px 0 0;
  }
  .photo-profil {
    width: 40%;
    height: 100%;
    background-color: aliceblue;
    color: black;
    border-radius: 50%;
    background-image: url("../../assets/img/profile.jpg");
    background-size: cover;
    background-position: center top;
  }
  .div-info-mail {
    font-size: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    width: 50%;
    height: 98%;
    background-color: aliceblue;
    color: black;
    border-radius: 10px;
    padding: 5px;
    overflow-y: auto;
  }
  .div-info-mail button {
    all: unset;
    background-color: rgb(92, 162, 223);
    color: black;
    padding: 0.6rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
  }
  .column-bottom {
    position: relative;
    display: flex;
    flex-direction: column;
    /* justify-content: space-evenly; */
    width: 100%;
    height: 55%;
    background-color: aliceblue;
    color: black;
    border-radius: 0 0 10px 10px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.5);
    filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.5) inset);
  }

  .infos-user {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
    background-color: rgb(132, 189, 239);
    color: black;
    padding: 0.5rem;
    overflow-y: auto;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;
    border-radius: 0 0 10px 10px;
  }
  .infos-user::-webkit-scrollbar {
    display: none;
  }


  .infos-user div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: rgb(92, 162, 223);
    border: 1px solid white;
  }
  .button-update-infos {
    background-color: green;
    color: white;
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .infos-user p {
    font-size: large;
    font-weight: bold;
    color: white;
    letter-spacing: 1px;
  }
  .masque-info-user {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(83, 74, 74, 0.396);
    color: black;
    z-index: 100;
  }


  /* p {
    all: unset;
  } */
  .content-right {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    height: 100%;
    background-color: transparent;
    color: black;
    
    
  }
  .module-service {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(132, 189, 239);
    overflow: auto;
    border-radius: 10px 10px 10px 10px;
    z-index: 2;
    

    /* border-top: 5px solid black; */
  }
  .masque-service {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(83, 74, 74, 0.396);
    color: black;
    z-index: 100;
  }
  .onglet {
    position: absolute;
    width: auto;
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color:   rgb(92, 162, 223);
    cursor: pointer;
    color: white;
    font-weight: 900;
    font-size: 0.9rem;
  }
  .onglet:hover {
    top: -80px;
    scale: 1;
    background-color: rgb(92, 162, 223);
  }
  .onglet1 {
    left: 15px;
    top: -60px;
    box-shadow:  inset -5px 0px 5px rgba(34, 76, 138, 0.5)
  }
  .onglet1:hover {
    left: 8px;
    background-color: rgb(132, 189, 239);
    z-index: 1;
  }
  .onglet1:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-shadow:  inset -5px 0px 5px rgba(34, 76, 138, 0.5) , inset 0px -5px 5px rgba(34, 76, 138, 0.5);

  }
  .onglet2 {
    top: -60px;
    left: 29%;
  }
  .onglet2:hover {
    left: 27%;
    background-color: rgb(132, 189, 239);
  }
  .onglet2:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow:  inset -5px 0px 5px rgba(34, 76, 138, 0.5) , inset 0px -5px 5px rgba(34, 76, 138, 0.5);
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
