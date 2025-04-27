<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import SearchClients from "./clients/SearchClients.svelte";
    import ClientDisplay from "./clients/ClientDisplay.svelte";
    import MessagerieForum from "./messagerie/MessagerieForum.svelte";
    import MessagerieForumDisplay from "./messagerie/MessagerieForumDisplay.svelte";
    import Rdv from "./rdvAndGestion/AllRdv.svelte";
    import DisplayRdv from "./rdvAndGestion/DisplayRdv.svelte";
    import { faceActuelle } from "../../../../stores/cube";
    import { fade } from "svelte/transition";
    import svelteLogo from "../../../../assets/img/svelte.svg";
    // import SearchGestion from "./
    import engrenage from "../../../../assets/img/engrenage.png";
    import {
        messagesUsers,
        readMessageUsers,
    } from "../../../../stores/gestionMessagerie";
    import {
        users,
        numberOfUsers,
        searchQuery,
        searchType,
        erreurMessage,
    } from "../../../../stores/gestionUtilisateur";
    $users;
    $numberOfUsers;
    $searchQuery;
    $searchType;
    $erreurMessage;
    let circle;
    let circleItems = []; // Array to hold references to circle items
    let items = ["clients", "messages", "gestion"]; // Array of items
    let menuExpanded = false;
    let displayMenu;
    let displayContentMenu;
    let displayInfo;
    let reponseExpandable = writable(false);

    onMount(() => {
        displayMenu;
        displayMenu.style.opacity = "1";
        circleItems.forEach((item, index) => {
            item.classList.add(items[index]);
        });
    });

    function moveThis(item, index) {
        item.style.opacity = "1";

        requestAnimationFrame(() => {
            // item.style.transition = "transform 0.9s ease-in-out";
            item.style.display = "flex";
            item.style.opacity = "1";
            if (item.classList.contains("clients")) {
                item.style.transform = "translate(0%, -100%)";
            } else if (item.classList.contains("messages")) {
                item.style.transform = "translate(50%, 0%)";
            } else if (item.classList.contains("gestion")) {
                item.style.transform = "translate(15%, 102%)";
            }
        });
    }

    function moveThisClose(item, index) {
        if (item.classList.contains("clients")) {
            item.style.transform = "translate(-150%, 0%)";
            item.style.zIndex = "-10";
            // item.style.opacity = "0";
            item.style.transition = "all 0.9s ease-in-out";
            item.classList.remove(items[index]);
        }
        if (item.classList.contains("messages")) {
            item.style.transform = "translate(-150%, -0%)";
            // item.style.opacity = "0";
            item.style.transition = "all 0.9s ease-in-out";
            setTimeout(() => {}, 500);
            item.classList.remove(items[index]);
        }
        if (item.classList.contains("gestion")) {
            item.style.transform = "translate(-150%, 0%)";
            // item.style.opacity = "0";
            item.style.transition = "all 0.9s ease-in-out";
            item.classList.remove(items[index]);
        }
    }

    function expandCircle() {
        // circle.style.rotate = "-25deg";
        circle.style.translate = "-40%";

        requestAnimationFrame(() => {
            circleItems.forEach((item, index) => {
                setTimeout(() => {
                    moveThis(item, index);
                }, 500);
                item.style.translate = "160%";
                // item.style.display = "flex";
                item.style.transition = "all 0.9s ease-in-out";
                item.classList.add(items[index]);

                menuExpanded = true;
            });
        });
    }

    function collapseCircle() {
        circle.style.translate = "0%";
        // circle.style.rotate = "25deg";
        circle.style.zIndex = "10";
        requestAnimationFrame(() => {
            circleItems.forEach((item, index) => {
                item.style.opacity = "0";
                item.style.zIndex = "-10";
                item.style.transition = "all 0.9s ease-in-out";

                setTimeout(() => {
                    item.style.display = "none";
                }, 500);

                moveThisClose(item, index);
                menuExpanded = false;
            });
        });
    }
    async function infoClientsRegistry(item) {
        console.log("displayMenu", displayMenu);

        if (displayMenu) {
            requestAnimationFrame(() => {
                displayMenu.style.display = "block";
                displayMenu.style.opacity = "1";
            });

            console.log("displayMenublok", displayMenu);
        }
    }

    function message() {
        if (displayMenu) {
            displayMenu.innerHTML = " message";
        }
    }

    function btnCircleItem(e, item) {
        console.log("item", item);
        e.stopPropagation();
        if (item === "clients") {
            e.preventDefault();
            console.log("Clients clicked");
            displayMenu = "";
            displayContentMenu = "clients";
            infoClientsRegistry();
        } else if (item === "messages") {
            console.log("Messages clicked");
            console.log("item", item);
            displayMenu = "";
            displayContentMenu = "messages";
            message();
        } else if (item === "gestion") {
            console.log("Gestion clicked");
            console.log("item", item);
            displayMenu = "";
            displayContentMenu = "gestion";
            // Appeler la fonction associée pour gestion
        }
    }
</script>

<main>
    <div class="div-left matrice">
        {#if displayContentMenu === "gestion"}
            <div class="gestion-parametre">
                <p>Paramètre Avancé</p>
                <button
                    class="btn-parametre"
                    on:click={() => faceActuelle.set("back")}
                >
                    Go <span class="arrow-right">➡️</span>
                </button>
            </div>
        {/if}

        <div class="circle-menu">
            <div
                type="button"
                bind:this={circle}
                on:click={() =>
                    menuExpanded ? collapseCircle() : expandCircle()}
                class="circle"
            >
                {#each items as item, index}
                    <button
                        role="button"
                        bind:this={circleItems[index]}
                        class="circle-item"
                        on:click={(e) => btnCircleItem(e, item)}
                    >
                        <p>{item}</p>
                    </button>
                {/each}

                {#if menuExpanded}
                    <style>
                        .clients {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size: 200%;
                            background-position: center;
                            background-clip: content-box;
                        }

                        .messages {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size: 200%;
                            background-position: center;
                            background-clip: content-box;
                        }
                        .gestion {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size: 200%;
                            background-position: center;
                            background-clip: content-box;
                        }
                    </style>
                {/if}
            </div>
        </div>
    </div>
    <div class="div-center matrice">
        <div bind:this={displayMenu} class="display-menu">
            {console.log("displayContentMenu", displayContentMenu)}
            {#if displayContentMenu === undefined}
            <div class="wrapper-rotate">
                <div
                    class="welcome-admin"
                    in:fade={{ duration: 3000, delay: 300 }}
                    out:fade={{ duration: 800 }}
                >
                    <p>Administration</p>
                </div>
            </div>
            {:else}
                <!-- {console.log("btn", circleItems.classList === "clients")} -->
                {#if displayContentMenu === "clients"}
                    <SearchClients />
                {:else if displayContentMenu === "messages"}
                    <MessagerieForum bind:reponseExpandable />
                {:else if displayContentMenu === "gestion"}
                    <Rdv />
                {/if}
            {/if}
        </div>
    </div>
    <div class="div-right matrice">
        <div bind:this={displayInfo} class="display-info">
            {#if displayContentMenu === undefined}
                <img src={svelteLogo} alt="svelte" class="svelte-logo" />
                <p class="powered-by-p">
                    Powered by <span class="powered-by">Svelte</span>
                </p>
            {/if}
            {#if displayContentMenu === "gestion"}
                <DisplayRdv />
                <p>gestion</p>
            {/if}
            {#if displayContentMenu === "messages"}
                <MessagerieForumDisplay />
            {/if}
            {#if displayContentMenu === "clients"}
                <ClientDisplay />
            {/if}
        </div>
    </div>
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    main {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        height: 100%;
        /* overflow-y: scroll; */
    }
    .gestion-parametre {
        position: absolute;
        top: -50px;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .gestion-parametre p {
        font-size: 1rem;
        font-weight: bold;
        color: white;
    }
    .arrow-right {
        font-size: 1rem;
    }
    .gestion-parametre button {
        align-self: flex-start;
        background-color: transparent;
        border: none;
        color: white;
        cursor: pointer;
        background-color: orange;
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
        width: 100%;
        z-index: 10;
    }
    .matrice {
        display: flex;
        flex-wrap: wrap;
        height: 80%;
        max-height: 500px;
        overflow: hidden;
        /* border: 1px solid white; */
        /* min-width: 190px; */
    }
    .display-info {
        width: 100%;
        height: 100%;
        /* overflow-y: scroll; */
        /* border: 1px solid white; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .div-left {
        flex: 1;
        /* border: 1px solid white; */
    }
    .circle-menu {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .circle {
        position: relative;
        top: 0;
        left: 0;
        width: 45%;
        height: 45%;
        /* background-color: grey; */
        background-image: url("../../../../assets/img/engrenage.png");
        background-size: 200%;
        background-position: center;
        background-clip: content-box;
        border-radius: 50%;
        transition: all 0.9s ease-in-out; /* Transition sur tout */

        z-index: 6;
    }
    /* .circle img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    } */
    .circle:hover {
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgba(223, 215, 215, 0.5));
        /* box-shadow: 0 0 10px 0 rgba(234, 233, 233, 0.5);  */
    }
    button.circle-item {
        position: relative;
        background-image: url("../../../../assets/img/engrenage.png");
        background-size: 200%, 200%;
        background-position: center;
        background-color: transparent;
        /* background-clip: content-box; */
        position: fixed;
        top: 25%;
        left: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45%;
        height: 50%;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.9s ease-in-out;
        opacity: 0;
        display: none;
        z-index: -5;
        color: white;
    }
    .circle p {
        position: absolute;
        bottom: -85%;
        left: 5px;
        width: 100%;
        height: 100%;
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        color: white;
        letter-spacing: 1px;
    }

    .div-center {
        flex: 1;
        /* min-width: 370px;
        max-width: 400px; */
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
        background-color: transparent;
        border-radius: 10px;
    }
    .welcome-admin {
        all: unset;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: #4289d170;
        border: 3px solid rgb(234, 170, 98);
        outline: 5px solid rgba(83, 78, 78, 0.583);
        padding: 10px;
        border-radius: 50%;
        box-shadow: 0 0 30px 0 rgba(187, 22, 22, 0.726);
        animation: blink 10s infinite;
    }
    @keyframes blink {
        0% {
            box-shadow: 0 0 1px 0 rgba(187, 22, 22, 0.726);
        }
        10% {
            box-shadow: 0 0 15px 0 rgba(240, 3, 3, 0.726) inset;
        }
        20% {
            box-shadow: 0 0 30px 0 rgba(240, 3, 3, 0.726) inset;
        }
        40% {
            box-shadow: 0 0 30px 0 rgba(187, 187, 22, 0.726) inset;
        }
        50% {
            box-shadow: 0 0 30px 0 rgba(240, 3, 3, 0.726) inset;
        }
        70% {
            box-shadow: 0 0 15px 0 rgba(240, 3, 3, 0.726) inset;
        }
        90% {
            box-shadow: 0 0 15px 0 rgba(240, 187, 22, 0.726) inset;
        }
        100% {
            box-shadow: 0 0 15px 0 rgba(187, 22, 22, 0.726) inset;
        }
    }
.wrapper-rotate{
    position: relative;
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    border-bottom: 1px solid yellow;
    border-right: 1px solid rgba(255, 0, 0, 0.674);
    box-shadow: 0 0 50px 0 rgba(234, 168, 168, 0.562) inset;
    animation:scale 2s linear infinite ;
    
}
.wrapper-rotate::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 3px solid rgba(255, 166, 0, 0.562);
    border-top: 3px solid rgba(255, 166, 0, 0.562);
    box-shadow: 0 0 20px 0 rgba(226, 13, 13, 0.562) inset;
    animation:scale 2s linear infinite ;
    border-radius: 50%;
    animation:rotateWrapper 1s linear infinite ;
}
@keyframes rotateWrapper{
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(-180deg);
        
    }
    100%{
        transform: rotate(-360deg);
    }
}
@keyframes scale{
    0%{
        transform: scale(1.03);
    }
    50%{
        transform: scale(1.02);
    }
    100%{
        transform: scale(1.03);
    }
}
    .welcome-admin p {
        position: absolute;
    top: 35%;
    font-size: 1.6rem;
    font-weight: bold;
    background: linear-gradient(45deg, yellow, red);
    background-size: 100% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    z-index: 10;
}


    .welcome-admin::after {
        content: "";
        position: absolute;
        top: -3px;
        left: 0;
        width: 100%;
        border-bottom: 5px solid rgb(209, 216, 79);
        height: 99%;
        border-radius: 50%;
        animation: rotate 0.5s infinite;
        filter: drop-shadow(30px 30px 10px rgba(233, 233, 7, 0.982));
    }
    .welcome-admin::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-bottom: 5px solid rgb(199, 102, 102);
        height: 100%;
        border-radius: 50%;
        animation: rotate2 0.5s infinite;
        filter: drop-shadow(30px 30px 10px rgba(199, 102, 102, 0.982));
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
            width: 0%;
        }
        50% {
            transform: rotate(-180deg);
            scale: 1.1.1;
        }
        70% {
            scale: 1.1.0;
        }
        100% {
            transform: rotate(360deg);
            scale: -1.1.0;
            width: 100%;
        }
    }
    @keyframes rotate2 {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(-180deg);
            scale: 1;
        }
        100% {
            transform: rotate(-360deg);
            scale: 1.1.0;
        }
    }
    .svelte-logo {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
        mix-blend-mode:hard-light;
        filter: drop-shadow(0 0 30px rgb(252, 169, 54));
    }
    .powered-by-p {
        font-size: clamp(1rem, 2vw, 2rem);
        font-weight: bold;
        color: white;
        display: flex;
        gap: 10px;
        align-self: center;
        margin-top: 85%;
    }
    .powered-by {
        color: rgb(240, 187, 22);
        font-weight: bold;
    }
    .display-menu {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /* overflow-y: auto; */
        padding: 10px;
        border-radius: 10px;
    }
    /* .div-center.active {
        display: block;
        flex: 1;

    } */
    .div-right {
        position: relative;
        flex: 1;
    }
    @media (max-width: 375px) {
        main{
            width: 100%;
            height: 100%;
        }
        .div-center {
            width: 100%;
            height: 100%;
            overflow: none;
            outline: 1px solid white;
        }
    }
</style>
