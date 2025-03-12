<script>
  import { onMount } from "svelte";
  import { faceActuelle } from "../../stores/cube";
  import loginImage from "../../assets/img/logging.png";
  import Utilisateur from "../../class/UserClassRegister";
  import UtilisateurLogin from "../../class/UserClassLogin";
  import { utilisateurConnecte, estAuthentifie } from "../../stores/sessionStore.js";
  let email = "";
  let password = "";
  let loginSuccess = false;
  let loginError = false;
  let emailRegister = "";
  let passwordRegister = "";
  let registerSuccess = false;
  let registerError = false;
  let confirmPasswordRegister = "";
  let message = "";
  let messageClass = "";
  let csrfToken = "";
  let isLoginActive = true;

  onMount(async () => {
      const res = await fetch('http://localhost:3000/csrf-token', { credentials: 'include' });
      const data = await res.json();
      csrfToken = data.csrfToken;
      console.info("Formulaire de login sécurisé avec token csrfToken");
    });

  const envoyerDonneesEnregistrement = async (event) => {
  message = "";
  messageClass = "";
  registerSuccess = false; // Réinitialiser l'état
  registerError = false;

  event.preventDefault();

  try {
    const user = new Utilisateur(emailRegister, passwordRegister, csrfToken);
    const result = await user.envoyer();

    if (result.message) {
      message = 'Enregistrement réussi !';
      messageClass = "success";
      registerSuccess = true; // Activer l'affichage du message de succès
      setTimeout(() => {
        message = "";
        messageClass = "";
        registerSuccess = false;
        registerError = false;
        faceActuelle.set("login");
      }, 3000);
    } else {
      message = result.error;
      messageClass = "error";
      registerError = true; // Activer l'affichage du message d'erreur
    }
  } catch (error) {
    message = error.message;
    messageClass = "error";
    registerError = true;
  }
};

  async function envoyerDonneesLogin(event) {
    event.preventDefault(); // Empêcher le rechargement de la page
    message = "";
    messageClass = "";
    loginSuccess = false;
    loginError = false;

    const user = new UtilisateurLogin(email, password, csrfToken);
    const result = await user.connexion();
    if (result.message) {
      message = 'Connexion réussie !';
      messageClass = "success";
      loginSuccess = true;
      setTimeout(() => {
        message = "";
        messageClass = "";
        loginSuccess = false;
        loginError = false;
      }, 3000);
      console.log("result",result);

      function decoderTokenManuellement(token) {
                try {
                    // Séparer le token en trois parties
                    const base64Url = token.split('.')[1];
            
                    // Ajouter des caractères manquants à la fin pour que ce soit un multiple de 4
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            
                    // Décoder la base64 en chaîne de caractères
                    const decodedPayload = JSON.parse(atob(base64));
                    console.log("Données décodées:", decodedPayload);
                    return decodedPayload;
                } catch (error) {
                    console.error("Erreur lors du décodage manuel du token:", error);
                    return null; // Retourne null en cas d'erreur
                }
            }
            const decodedPayload = decoderTokenManuellement(result.token);
            console.log("decodedPayload",decodedPayload);
            utilisateurConnecte.set(decodedPayload);
            estAuthentifie.set(true);

            if(decodedPayload.role === "admin") {
              console.log("direction admin");
              faceActuelle.set("bottom");
            }if(decodedPayload.role === "user") {
              console.log("direction user");
              faceActuelle.set("left");
            }
            return faceActuelle;
    } else {
      message = result.error;
      messageClass = "error";
      loginError = true;
    }
  }

  // Fonction pour basculer entre Login et Register
  function toggleActive() {
    isLoginActive = !isLoginActive;
  };
</script>

<div class="global-login-and-register-container">
  <button class="login-register-choice-button" on:click={toggleActive}>
    {isLoginActive ? "enregistrement" : "connexion"}
  </button>

  <!-- Formulaire de Login -->
  <div class="login" class:active={!isLoginActive}>
    <div class="content-h2-login">
      <h2>Connexion</h2>
    </div>
    <div class="content-login-and-presentation">
      <div class="content-form">
        <form>
          <label for="email">Email</label>
          <input type="text" placeholder="Email" bind:value={email} />
          <label for="password">Password</label>
          <input type="password" placeholder="Password" bind:value={password} />
          <button type="submit" on:click={envoyerDonneesLogin}>Login</button>
        </form>
      </div>
      <div class="login-presentation">
        <img src={loginImage} alt="login" />
        <p>Welcome to the login page</p>
      </div>
      <div class="message-register">
        <p class={messageClass}>{message}</p>
      </div>
    </div>
  </div>

  <!-- Formulaire de Register -->
  <div class="register" class:active={isLoginActive}>
    <div class="content-h2-register">
      <h2>Enregistrement</h2>
    </div>
    <div class="content-register-and-presentation">
      <div class="content-form-register">
        <form>
          <label for="email">Email</label>
          <input bind:value={emailRegister} type="text" placeholder="Email" />
          <label for="password">Password</label>
          <input
            bind:value={passwordRegister}
            type="password"
            placeholder="Password"
          />
          <label for="confirm-password">Confirm Password</label>
          <input
            bind:value={confirmPasswordRegister}
            type="password"
            placeholder="Confirm Password"
          />
          <button on:click={envoyerDonneesEnregistrement}>Register</button>
        </form>
      </div>
      <div class="register-presentation">
        <img src={loginImage} alt="register" />
        <p>Welcome to the registration page</p>
      
      <div class="message-register">
        <h4 class={messageClass}>{message}</h4>
      </div>
    </div>
  </div>
  </div>
</div>

<style>
  .success {
    color: green;
    font-weight: bold;
    font-size: 1.2rem;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: -20px;
  }

  .error {
    color: red;
    font-weight: bold;
    font-size: 1.2rem;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: -20px;
  }
  /* Par défaut, on cache les sections avec `.active` */
  .active {
    display: none !important;
    transition: all 1s ease;
  }
  .global-login-and-register-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 60%; 
    padding: 0 100px;
    /* margin-top: -100px; */
  }
  .login-register-choice-button {
    background-color: #45484a6d;
    /* -webkit-backdrop-filter: blur(15px); */
    backdrop-filter: blur(55px);
    padding: 20px 20px ;
    width: auto;
    height: 90px;
    border-radius: 10px;
    filter: drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5));
    font-family: var(--font-title);
    font-size: 3.5rem;
    font-weight: bold;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-login-and-presentation {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .login {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 0px 20px 0px;
    background-color: rgba(240, 248, 255, 0.426);
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(55px);
    width: 40vw;
    height: 50vh;
    border-radius: 10px;
    filter: drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5));
  }
  .content-h2-login {
    box-sizing: border-box;
    width: 100%;
    height: 10%;
    display: flex;
    padding: 30px;
    justify-content: center;
    align-items: center;
    background: var(--gradient-module);
    color: white;
    border-radius: 10px 10px 0 0;
    isolation: isolate;
  }
  .content-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .login form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
  }
  .login form label {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .login form input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
  }
  .login form button {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    padding: 10px;
    background: var(--gradient-navbar);
  }
  .login form button:hover {
    transform: scale(1.2);
    transition: all 0.3s ease;
    padding-inline: 20px;
    background: var(--gradient-module);
  }
  .login-presentation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .login-presentation img {
    width: 50%;
    height: 50%;
  }
  /* ----------------------enregistrement--------------------------------- */
  .register {
    box-sizing: border-box;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40vw;
    height: auto;
    border-radius: 10px;
    backdrop-filter: blur(3px);
    filter: drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5));
  }
  .content-register-and-presentation {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(240, 248, 255, 0.374);
    border-radius: 0px 0px 10px 10px;
    padding: 0px 0px 20px 0px;
  }
  .content-form-register {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .content-h2-register {
    box-sizing: border-box;
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--gradient-module);
    color: white;
    border-radius: 10px 10px 0 0;
    isolation: isolate;
    margin-top: 130px;
  }
  .register-presentation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .register-presentation img {
    width: 50%;
    height: 50%;
  }
  .register form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .register form input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
  }
  .register form label {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .register form button {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
  }
</style>
