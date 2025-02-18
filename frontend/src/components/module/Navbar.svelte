<script>
    import { onMount } from "svelte";
    import { faceActuelle } from "../../stores/cube";

    let navbarElement;
    let isOpen = false;
    const pageActuelle = faceActuelle;

    onMount(() => {
        navbarElement = document.querySelector(".navbar");
    });


</script>

<div class="content-system-nav">
    <div class="navbar">
        <button class="epilation-button">
            <a href="#salon" class="nav-link">
                Les salons
                <div class="epilation icone"></div>
            </a>
        </button>
        <button class="soins-button">
            <a href="#caroussel" class="nav-link">
                En photos
                <div class="soins icone"></div>
            </a>
        </button>
        <button class="sourcil-button">
            <a href="#prestations" class="nav-link">
                Prestations
                <div class="sourcil icone"></div>
            </a>
        </button>
        <button class="massage-button">
            <a href="#geo" class="nav-link">
                Localisation
                <div class="massage icone"></div>
            </a>
        </button>
        <button class="menu-button" title="accueil" on:click={() => pageActuelle.set('front')}>
            accueil
            <div class="accueil icone accueil"></div>
        </button>
        <button class="menu-button" title="login" on:click={() => pageActuelle.set('right')}>
           login
            <div class="login icone"></div>
        </button>

        <button class="menu-button" title="adminboard" on:click={() => pageActuelle.set('bottom')}>
            admin
            <div class="menu icone adminboard"></div>
        </button>
        <button class="menu-button" title="userboard" on:click={() => pageActuelle.set('left')}>
            Mon compte
            <div class="bottom userboard icone"></div>
        </button>
        <button class="menu-button" title="top" on:click={() => pageActuelle.set('top')}>
            top
            <div class="top icone"></div>
        </button>

    </div>
    <div class="icone-map" >
    </div>
</div>

<style>
    .content-system-nav {
        position: relative;
        width: 75%; 
        height: 10vh;
        z-index: 3;
    }
    .navbar {
        gap: 10px;
        z-index: 1;
        position: absolute;
        top: 10px;
        left: 0;
        transform: translateX(-100%);
        width: auto;
        max-width: 100%;
        height: 15vh;
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
    .navbar:hover {
        background: var(--gradient-navbar); 
        filter: drop-shadow(10px -10px 5px rgba(110, 241, 110, 0.5));
        /* backdrop-filter: blur(5px); */
    }
    .navbar button {
        width: 100px;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        color: rgb(47, 46, 46);
        font-size: 1.2rem;
        font-weight: bold;
        font-family: 'Playfair Display', sans-serif;
        border: none;
        background-color: transparent;
        cursor: pointer;
    }
    .navbar button:hover {
        filter: drop-shadow(10px -10px 5px rgba(110, 241, 110, 0.5));
        text-decoration: underline;
        color: white;
        transition: all 0.3s ease;
    }
    .nav-link {
        width: 100px;
        text-decoration: none;
        color: inherit;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
    }

    .nav-link:hover {
        color: inherit;
    }
    .massage {
        background-image: url(../../assets/img/massagecouleur.PNG);
        width: 50px;
        height: 50px;
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 50%;
    }
    .epilation {
        background-image: url(../../assets/img/epilationCouleur.PNG);
        width: 50px;
        height: 50px;
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 50%;
        isolation: isolate;
    }
    .soins {
        background-image: url(../../assets/img/soinsCouleurs.PNG);
        width: 50px;
        height: 50px;
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 50%;
    }
    .sourcil {
        background-image: url(../../assets/img/sourcilcouleur.PNG);
        width: 50px;
        height: 50px;
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 50%;
    }
    .login {
        background-image: url(../../assets/img/logging.png);
        width: 50px;
        height: 45px;
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 5px;
    }
    .userboard {
        background-image: url(../../assets/img/espace-utilisateur.png);
        width: 48px;
        height: 48px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-color: white;
        border-radius: 5px;
    }
    .adminboard {
        width: 45px;
        height: 45px;
        background-image: url(../../assets/img/admin-nav-logo.png);
        background-color: white;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 5px;
    }
    .accueil {
        background-image: url(../../assets/img/acceuil.png);
        background-color: white;
        width: 45px;
        height: 45px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 5px;
    }

</style>
