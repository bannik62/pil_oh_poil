<script>
  import { onMount } from "svelte";
  import h1title from "../../../assets/img/h1title.png";
  import Navbar from "../../module/Navbar.svelte";
  let cordonElement;
  let navbarElement;
  let h1Title;
  let h1titlepng1;
  let h1titlepng2;
  onMount(() => {
    h1Title = document.getElementById("h1Title");
    h1titlepng1 = document.getElementById("h1titlepng1");
    h1titlepng2 = document.getElementById("h1titlepng2");
    cordonElement = document.querySelector(".cordon");
    navbarElement = document.querySelector(".navbar");

    if (cordonElement) {
      cordonElement.addEventListener("click", handleClick);
    }

    return () => {
      if (cordonElement) {
        cordonElement.removeEventListener("click", handleClick);
      }
    };
  });

  function handleClick() {
    cordonElement.style.transform = "translateY(0px)";
    if (navbarElement.style.transform === "translateX(0%)") {
      navbarElement.style.transform = "translateX(-100%)"; // Masque la barre de navigation
      navbarElement.style.position = "sticky";
    } else {
      cordonElement.style.transform = "translateY(20px)";
      navbarElement.style.transform = "translateX(0%)"; // Affiche la barre de navigation
      navbarElement.style.position = "absolute";
    }
    // Gestion du changement de couleur au scroll
  }
  
  window.addEventListener("scroll", () => {
  if (window.scrollY < 500) {
    h1Title.style.background = "rgba( 240,248,255,0.374)";
    h1Title.style.filter = "drop-shadow(12px -12px 2px rgba(0, 0, 0, 0.5))";
    h1titlepng1.style.opacity = "0";
    h1titlepng2.style.opacity = "0";
    h1titlepng1.style.display = "none";
    h1titlepng2.style.display = "none";
  } else {
    h1Title.style.backdropFilter = "blur(3px)";
    h1Title.style.background = "linear-gradient(to bottom, rgba(240, 248, 255, 0.874), #8A52B3)";

    h1titlepng1.style.opacity = "1";
    h1titlepng2.style.opacity = "1";
    h1titlepng1.style.transition = "all 2s ease";  
    h1titlepng2.style.transition = "all 2s ease";
  }
  if (window.scrollY > 490) {
    h1titlepng1.style.display = "block";
    h1titlepng2.style.display = "block";
  }
});
</script>

<main>
  <div>
    <header>
      <Navbar />
      <div class="cordon" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap"
        rel="stylesheet"
      />
      <div class="content-h1">
        <h1 id="h1Title">
          <img id="h1titlepng1" src={h1title} alt="" class="h1titlepng icone" />
          Pil Oh Poil
          <img id="h1titlepng2" src={h1title} alt="" class="h1titlepng icone" />
        </h1>
      </div>
    </header>
  </div>
</main>

<style>
  header {
    width: 100vw;
    height: 99vh;
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
    z-index: 2;
  }
  .h1titlepng {
    width: 100px;
    height: 100px;
    object-fit: cover;
    opacity: 0;
  }
  /* .content-system-nav {
    position: relative;
    width: 50%;
    height: 10vh;
  } */
  /* .navbar {
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
    ); 
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
    background-image: url(../../../assets/img/massagecouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
  .epilation {
    background-image: url(../../../assets/img/epilationCouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
  .soins {
    background-image: url(../../../assets/img/soinsCouleurs.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
  .sourcil {
    background-image: url(../../../assets/img/sourcilcouleur.PNG);
    width: 50px;
    height: 50px;
    background-color: white;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
  } */

  .cordon {
    position: absolute;
    top: -50px;
    right: 0;
    width: 200px;
    height: 400px;
    background-image: url(../../../assets/img/cordon.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
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
  @media  (max-width: 600px) {
    header {
      width: 96vw;
      height: 100vh;
      margin-bottom: 40px;
      /* background-position: center; */
      background-size: cover;
      background-position: 70% ;
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

  @media (min-width:390px) and (max-width: 415px) {
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
      top:15%;
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
    .navbar {
      height: 20vh;
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
