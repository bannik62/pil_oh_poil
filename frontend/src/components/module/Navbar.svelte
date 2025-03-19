<script>
    import axios from 'axios';
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { faceActuelle } from "../../stores/cube";
    import {utilisateurConnecte, estAuthentifie, infosUser, isValid, displayService} from '../../stores/sessionStore.js';
    let navbarElement;
    let isOpen = false;

    //transformation dee la valeur cube en page
    const pageActuelle = faceActuelle;
    console.log("pageActuelle", get(pageActuelle));

    onMount(() => {
        navbarElement = document.querySelector(".navbar");
    });

export function logout() {
    pageActuelle.set("front");
    utilisateurConnecte.set(null);
    estAuthentifie.set(false);
    // localStorage.removeItem('token');
    // Supprimer le cookie de session
    axios.post('http://localhost:3000/api/user/auth/logout', {}, {
        withCredentials: true // Configuration correcte pour axios
    })
    .then(() => {
        estAuthentifie.set(false);
        console.log('Déconnexion réussie, cookie supprimé');
        pageActuelle.set("front");
        utilisateurConnecte.set(null);
        infosUser.set(null);
        estAuthentifie.set(false);
        isValid.set(false);
        displayService.set("rdv");
        selectedDay.set(null);
        selectedTimeSlot.set(null);
        currentWeek.set([]);
        weekOffset.set(0);
        joursFermes.set([0, 3]);

    })
    .catch(error => {
        console.error('Erreur lors de la déconnexion:', error);
    });
}


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
        {#if $pageActuelle !== 'front'}
            <button class="menu-button"  title="accueil" on:click={() => pageActuelle.set('front')}>
                accueil
                <div class="accueil icone accueil"></div>
            </button>   
        {:else}
            <button class="menu-button" style="display:none;" title="accueil" on:click={() => pageActuelle.set('front')}>
                accueil
                <div class="accueil icone accueil"></div>
            </button>   
        {/if}
        
        {#if !$estAuthentifie}
            <button class="menu-button" title="login" on:click={() => pageActuelle.set('right')}>
                login
                <div class="login icone"></div>
            </button>
        {/if}
<!-- mettre dans l ordre le cube !!!! -->
        {#if $estAuthentifie && $utilisateurConnecte.role === 'admin'}
            <button class="menu-button" title="adminboard" on:click={() => pageActuelle.set('bottom')}>
                admin
                <div class="menu icone adminboard"></div>
            </button>
        {/if}

        {#if $estAuthentifie && $utilisateurConnecte.role === 'user' && $pageActuelle !== 'left'}
        <button class="menu-button" title="userboard" on:click={() => pageActuelle.set('left')}>
            Mon compte
            <div class="bottom userboard icone"></div>
        </button> 
        {/if}
          
           <!-- <button class="menu-button" title="top" on:click={() => pageActuelle.set('top')}>
                top
                <div class="top icone"></div>
            </button> -->
       
        {#if $estAuthentifie}
            <button class="menu-button" title="logout" on:click={() => logout()}>
                logout !!
                <div class="logout icone"></div>
            </button>
        {/if}

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
        height: auto;
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
