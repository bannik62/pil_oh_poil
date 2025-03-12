<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { navbarState } from "../../../stores/navigation";
  import h1title from "../../../assets/img/h1title.png";
  import Navbar from "../../module/Navbar.svelte";
  import Login from "../../module/Login.svelte";
  import { faceActuelle } from "../../../stores/cube";
  import { estAuthentifie, utilisateurConnecte } from "../../../stores/sessionStore";
  import Userboard from "../../module/Userboard.svelte";
  import CookieHautentifier from "../../../utils/CookieHautentifier.svelte";
  let cordonElement;
  let btnNavUserBoard;
  let navbarElement;
  let h1Title;
  let h1titlepng1;
  let h1titlepng2;
  let pageActuelle = faceActuelle;
  
  // Utiliser directement le store avec $ pour la réactivité
  $: currentPage = $faceActuelle;
  $: estConnecte = $estAuthentifie;
  $: utilisateur = $utilisateurConnecte;

  onMount(() => {

    h1Title = document.getElementById("h1Title");
    h1titlepng1 = document.getElementById("h1titlepng1");
    h1titlepng2 = document.getElementById("h1titlepng2");
    cordonElement = document.querySelector(".cordon");
    navbarElement = document.querySelector(".navbar");
    btnNavUserBoard = document.querySelector(".btnNavUserBoard");
    window.addEventListener("scroll", handleScroll);

  const unsubscribe = pageActuelle.subscribe((face) => {
      const cube = document.querySelector("#cube");
      if (cube) {
        switch (face) {
          case "front":
            cube.style.transform = "rotateY(0deg)";
            break;
          case "right":
            cube.style.transform = "rotateY(-90deg)";
            break;
          case "left":
            cube.style.transform = "rotateY(90deg)";
            break;
          case "bottom":
            cube.style.transform = "rotateX(90deg)";
            break;
          case "top":
            cube.style.transform = "rotateX(-90deg)";
            break;
          default:
            cube.style.transform = "rotateY(0deg)";
            break;
        }
      }
  });

  return () => unsubscribe(), window.addEventListener("scroll", handleScroll); // Nettoie l'abonnement lors du démontage

  function handleScroll() {
      if (window.scrollY > 490) {
        h1titlepng1.style.display = "block";
        h1titlepng2.style.display = "block";
      }
      if (window.scrollY < 500) {
        h1Title.style.background = "rgba( 240,248,255,0.374)";
        h1Title.style.filter = "drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5))";
        h1titlepng1.style.opacity = "0";
        h1titlepng2.style.opacity = "0";
        h1titlepng1.style.display = "none";
        h1titlepng2.style.display = "none";
      } else {
        h1Title.style.backdropFilter = "blur(3px)";
        h1Title.style.background =
          "linear-gradient(to bottom, rgba(240, 248, 255, 0.874), #8A52B3)";
        h1titlepng1.style.display = "block";
        h1titlepng2.style.display = "block";
        h1titlepng1.style.opacity = "1";
        h1titlepng2.style.opacity = "1";
        h1titlepng1.style.transition = "all 2s ease-in-out";
        h1titlepng2.style.transition = "all 2s ease-in-out";
      }
  }

  });

  function handleClick(buttonType = 'cordon') {
    if (!navbarElement) return;

    const isNavbarOpen = navbarElement.style.transform === "translateX(0%)";

    if (isNavbarOpen) {
      // Fermer la navbar
      navbarElement.style.transform = "translateX(-100%)";
      navbarState.update({ navbarIsOpen: true });
      
      if (buttonType === 'cordon' && cordonElement) {
        cordonElement.style.transform = "translateY(0px)";
      }
    } else {
      // Ouvrir la navbar
      navbarElement.style.transform = "translateX(0%)";
      navbarElement.style.position = "absolute";
      navbarElement.style.transition = "all 1.5s ease-in-out";
      navbarState.update({ navbarIsOpen: false });
      
      if (buttonType === 'cordon' && cordonElement) {
        cordonElement.style.transform = "translateY(20px)";
        cordonElement.style.zIndex = "3";
      }
    }
  }

  function rotateCube() {
    pageActuelle.update((face) => {
      switch (face) {
        case "front":
          pageActuelle.set('front');
          return "front";
       
          case "right":
          pageActuelle.set('right');
          return "right";
       
          case "left":
          pageActuelle.set('left');
          return "left";
       
          case "top":
          pageActuelle.set('top');
          return "top";
      
          default:
          return "front";
      }
    });
  }

  let timerRedirect = 5;
    
  function redirectToHome() {
        const countdown = setInterval(() => {
            timerRedirect--;
            if (timerRedirect <= 0) {
                clearInterval(countdown);
                pageActuelle.set('front');
              }
        }, 1000);
    }
</script>

<CookieHautentifier />
<header>

  <Navbar on:rotateCube={rotateCube} />
  {console.log("nav", get(pageActuelle))}
  {#if currentPage === 'front'}
  <button class="cordon"  name="cordon" aria-label="cordon" on:click={() => handleClick('cordon')} type="button" title="cordon" >
  </button>
    {:else if currentPage === 'left'}
  <button class="btnNavUserBoard" on:click={() => handleClick('btnNav')} type="button" title="cordon" value="Navbar">
    Navbar
  </button>
  <style>
    .btnNavUserBoard {
      outline: 1px solid red;
      position: absolute;
      top: 30px;
      right:100px;
      width: 100px;
      height: 100px;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: white;
      border: none;
      cursor: pointer;
      z-index: 3;
      color: black;
      font-size: 1.2rem;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      animation: scaleUp 1s ease-out forwards;
    }

    @keyframes scaleUp {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
  </style>
  {/if}
  
  
  <div class="cube" id="cube">
    <div class="cube-face cube-front">
      <div class="content-h1">
        <h1 id="h1Title">
          <img id="h1titlepng1" src={h1title} alt="" class="h1titlepng icone" />
          Pil Oh Poil
          <img id="h1titlepng2" src={h1title} alt="" class="h1titlepng icone" />
        </h1>
      </div>
    </div>

    <div class="cube-face cube-right login-container side">
      <Login />
    </div>

    <div class="cube-face cube-left userboard-container side">
      <div class="userboard" id="userboard">
        {#if estConnecte && utilisateur }
            <h2>Bienvenue {get(utilisateurConnecte).email}</h2>
            <Userboard title="Compte utilisateur" />
        {:else}          
            <h2>Accès non autorisé</h2>
            <p>Veuillez vous connecter pour accéder à cette section</p>
            <div class="error-404">
                <div class="sad-face">:(</div>
                <h3>Erreur 404</h3>
                <p>La page que vous recherchez semble introuvable...</p>
                {redirectToHome()}
            </div>

            <style>
                .error-404 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

                }

                .sad-face {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                    transform: rotate(90deg);
                    color: #666;
                    background-color: white;
                }

                .error-404 h3 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: #333;
                }

                .error-404 p {
                    font-size: 1.2rem;
                    color: #666;
                }
            </style>
        {/if}
      </div>
    </div>  

    <div class="cube-face cube-top top-face">
      <div class="top" id="top">
        <h2>Top</h2>
      </div>
    </div>

    <div class="cube-face cube-bottom adminboard-container">
      <div class="bottom" id="bottom">
        <h2>Bottom</h2>
        <p>Welcome to the admin dashboard</p>
      </div>
    </div>
  </div>
</header>

<style>
  .cube {
    position: relative;
    width: 100%;
    height: 104%;
    top: -75px;
   
    transform-style: preserve-3d;
    transition: transform 1.5s ease;
    z-index: 2;
    perspective: 50000px;
    perspective-origin: center;
    /* outline: 3px solid red; */
  }
 

  .cube-face {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backface-visibility: hidden;
  }

  .cube-front {
    transform: translateZ(50vw);
  }
  .cube-right {
    transform: rotateY(90deg) translateZ(50vw);
  }
  .cube-left {
    transform: rotateY(-90deg) translateZ(50vw);
  }
  .cube-top {
    transform: rotateX(90deg) translateZ(50vw);
  }
  .cube-bottom {
    transform: rotateX(-90deg) translateZ(50vw);
  }

  .cube-right,
  .cube-left {
    /* background-color: #333; */
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cube-top,
  .cube-bottom {
    background-color: #333;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border: 1px solid var(--color-secondary);
  }
 
  .adminboard-face {
    box-sizing: border-box;
    width: 102%;
    height: 110%;
    background-color: #333;

  }
  .top-face {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #333;
  }
  .userboard{
    margin-top: 150px;
  }
  .userboard-container {
    margin-top: 150px;
    box-sizing: border-box;
    margin : 0 auto;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.151);
    backdrop-filter: blur(2px);
    border-radius: 10px;
    padding: 50px
  }
  .userboard {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #33333325;
    backdrop-filter: blur(25px);
    border-radius:50px;
    padding: 20px;
  }
  header {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #333;
    background-image: url(../../../assets/img/shop.jpg);
    background-size: cover;
    background-position: 20% 50%;
    background-repeat: no-repeat;
    color: #fff;
    padding: 10px;
    margin-bottom: 50px;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.5);
  }
  .content-h1 {
    background-color: transparent;
    width: 100%;
    height: 160vh;
    position: relative;
    top: -550px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  h1 {
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 150px;
    font-family: var(--font-family-primary);
    font-size: clamp(3rem, 14vw, 10rem);
    text-align: center;
    margin: 0;
    padding: 15px 20px 15px 20px;
    color: #fff;
    letter-spacing: 20px;
    border: 1px solid var(--color-secondary);
    border-radius: 50px;
    background-color: rgba(
      240,
      248,
      255,
      0.182
    ); /* aliceblue with 0.8 opacity */
    backdrop-filter: blur(3px);
    filter: drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5));
    z-index: 1000;
  }
  .h1titlepng {
    width: 100px;
    height: 100px;
    object-fit: cover;
    opacity: 0;
  }
  button.cordon {
    position: absolute;
    top: -50px;
    right: 0;
    width: 200px;
    height: 400px;
    background-image: url(../../../assets/img/cordon.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    background-color: transparent;
    margin-right: 10px;
    z-index: 3;
  }
  .cordon:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
    z-index: 3;
    filter: drop-shadow(5px 5px 3px rgba(230, 225, 104, 0.5));
  }

  /* 📟 Tablettes */
  @media (max-width: 600px) {
    header {
      width: 96vw;
      height: 100vh;
      margin-bottom: 40px;
      /* background-position: center; */
      background-size: cover;
      background-position: 70%;
      background-repeat: no-repeat;
    }
    .content-h1 {
      height: 245vh;
    }
    h1 {
      filter: drop-shadow(5px -5px 2px rgba(0, 0, 0, 0.5)) !important;
      font-size: clamp(2rem, 5vw, 6rem);
      letter-spacing: 10px;
      top: 70%;
    }
    .navbar {
      height: 40vh;
    }
    .cordon {
      left: 50%;
    }
    .icone {
      width: 50px !important;
      height: 50px !important;
    }
  }

  @media (min-width: 390px) and (max-width: 415px) {
    .content-h1 {
      height: 200vh;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 6rem);
      letter-spacing: 10px;
      top: 30%;
    }
  }
  @media (min-width: 416px) and (max-width: 430px) {
    .content-h1 {
      height: 200vh;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 6rem);
      letter-spacing: 10px;
      top: 15%;
    }
  }

  /* 💻 Ordinateurs */
  @media (min-width: 600px) and (max-width: 1200px) {
    header {
      width: 98vw;
      height: 100vh;
      margin-bottom: 40px;
      /* background-position: center; */
    }
    .navbar {
      height: 40vh;
    }
    .content-h1 {
      height: 190vh;
    }
    h1 {
      font-size: clamp(2rem, 14vw, 6rem);
      letter-spacing: 10px;
      top: 0%;
    }
    .cordon {
      height: 600px;
    }
  }

  @media (min-width: 1200px) and (max-width: 1700px) {
    header {
      width: 99vw;
      height: 100vh;
      margin-bottom: 40px;
      /* background-position: center; */
    }


    .content-h1 {
      height: 205vh;
    }

    h1 {
      font-size: clamp(2rem, 14vw, 6rem);
      letter-spacing: 10px;
      top: 45%;
    }
  }
</style>