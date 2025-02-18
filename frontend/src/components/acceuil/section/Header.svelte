<script>
  import { onMount } from "svelte";
  import { navbarState } from "../../../stores/navigation";
  import h1title from "../../../assets/img/h1title.png";
  import Navbar from "../../module/Navbar.svelte";
  import Login from "../../module/Login.svelte";
  import { faceActuelle } from "../../../stores/cube";
  import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";

  let cordonElement;
  let navbarElement;
  let h1Title;
  let h1titlepng1;
  let h1titlepng2;
  const pageActuelle = faceActuelle;

  function handleClick() {
    if (!cordonElement || !navbarElement) return; // Vérifie que les éléments existent

    cordonElement.style.transform = "translateY(0px)";

    if (navbarElement.style.transform === "translateX(0%)") {
      navbarElement.style.transform = "translateX(-100%)";
      navbarState.update({ navbarIsOpen: true });
    } else {
      cordonElement.style.transform = "translateY(20px)";
      navbarElement.style.transform = "translateX(0%)";
      navbarElement.style.position = "absolute";
      navbarState.update({ navbarIsOpen: false });
      cordonElement.style.zIndex = "3";
    }
  }

  onMount(() => {
    h1Title = document.getElementById("h1Title");
    h1titlepng1 = document.getElementById("h1titlepng1");
    h1titlepng2 = document.getElementById("h1titlepng2");
    cordonElement = document.querySelector(".cordon");
    navbarElement = document.querySelector(".navbar");
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

  function rotateCube() {
    pageActuelle.update((face) => {
      switch (face) {
        case "front":
          return "right";
        case "right":
          return "left";
        case "left":
          return "bottom";
        case "bottom":
          return "top";
        case "top":
          return "front";
        default:
          return "front";
      }
    });
  }
</script>

<header>
  <Navbar on:rotateCube={rotateCube} />
  <button class="cordon" on:click={handleClick} type="button" title="cordon" />
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

    <div class="cube-face cube-right login-container">
      <Login />
    </div>

    <div class="cube-face cube-left adminboard-face">
      <div class="adminboard" id="adminboard">
        <h2>Admin Board</h2>
        <p>Welcome to the admin dashboard</p>
      </div>
    </div>  

    <div class="cube-face cube-top top-face">
      <div class="top" id="top">
        <h2>Top</h2>
      </div>
    </div>

    <div class="cube-face cube-bottom userboard-face">
      <div class="bottom" id="bottom">
        <h2>Bottom</h2>
        <p>Welcome to the user dashboard</p>
      </div>
    </div>
  </div>
</header>

<style>
  .cube {
    position: relative;
    width: 100%;
    height: 100%;
    top: -73px;
    right: 10px;
    transform-style: preserve-3d;
    transition: transform 1.5s ease;
    z-index: 2;
    perspective: 50000px;
    perspective-origin: center;
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
  .userboard-face {
    box-sizing: border-box;
    width: 100%;
    height: 110%;
    background-color: #333;
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
