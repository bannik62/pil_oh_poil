<script>
  import loginImage from "../../assets/img/logging.png";

  // Variable pour gérer l'état actif
  let isLoginActive = true;

  // Fonction pour basculer entre Login et Register
  function toggleActive() {
    isLoginActive = !isLoginActive;
  }
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
            <input type="text" placeholder="Email" />
            <label for="password">Password</label>
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
        </div>
        <div class="login-presentation">
          <img src={loginImage} alt="login" />
          <p>Welcome to the login page</p>
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
            <input type="text" placeholder="Email" />
            <label for="password">Password</label>
            <input type="password" placeholder="Password" />
            <label for="confirm-password">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Register</button>
          </form>
        </div>
        <div class="register-presentation">
          <img src={loginImage} alt="register" />
          <p>Welcome to the registration page</p>
        </div>
      </div>
    </div>
  
  </div>

<style>
  /* Par défaut, on cache les sections avec `.active` */
  .active {
    display: none !important;
    transition: all 1s ease;
  }
  .global-login-and-register-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 100px;
    margin-top: 150px;
  }
  .login-register-choice-button {
    background-color: #45484a6d;
    /* -webkit-backdrop-filter: blur(15px); */
    backdrop-filter: blur(55px);
    padding: 20px 20px;
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
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40vw;
    height: auto;
    border-radius: 10px;
    backdrop-filter: blur(3px);
    filter: drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5));
    padding:  0 0px 100px 0px;
  }
  .content-register-and-presentation {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(240, 248, 255, 0.374);
    border-radius: 0px 0px 10px 10px;
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
