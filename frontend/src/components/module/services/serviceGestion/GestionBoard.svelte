<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import SearchClients from "./clients/SearchClients.svelte";
    import ClientDisplay from "./clients/ClientDisplay.svelte";
    import MessagerieForum from "./messagerie/MessagerieForum.svelte";
    import MessagerieForumDisplay from "./messagerie/MessagerieForumDisplay.svelte";
    import Rdv from "./rdvAndGestion/Rdv.svelte";
    // import SearchGestion from "./
    import engrenage from "../../../../assets/img/engrenage.png";
    import { messagesUsers, readMessageUsers } from "../../../../stores/gestionMessagerie"
    import { users, numberOfUsers, searchQuery, searchType, erreurMessage } from "../../../../stores/gestionUtilisateur";
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
            setTimeout(() => {
            }, 500);
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
                  ;  item.style.display = "none";
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
            e.preventDefault()
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
        <div class="circle-menu">
            <div type="button"
                bind:this={circle}
                on:click={() =>menuExpanded ? collapseCircle() : expandCircle()}
                class="circle">

                {#each items as item, index}
                    <button
                        role="button"
                        bind:this={circleItems[index]}
                        class="circle-item"
                        on:click={(e) => btnCircleItem(e, item)}>
                        <p>{item}</p>
                    </button>
                {/each}

                {#if menuExpanded}
                    <style>
                        .clients {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size:200%;
                            background-position: center;
                            background-clip: content-box;
                        }
                      
                        .messages {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size:200%;
                            background-position: center;
                            background-clip: content-box;
                        }
                        .gestion {
                            background-image: url("../../../../assets/img/engrenage.png");
                            background-size:200%;
                            background-position: center;
                            background-clip: content-box;
                        }
                    </style>
                {/if}

            </div>
        </div>
    </div>
    <div class="div-center matrice">
        <!-- <p>displayMenu</p> -->
        <div bind:this={displayMenu} class="display-menu" >
            <!-- {console.log("btn", circleItems.classList === "clients")} -->
            {#if displayContentMenu === "clients"}
                <SearchClients    />
            {:else if displayContentMenu === "messages"}
                <MessagerieForum   bind:reponseExpandable />
            {:else if displayContentMenu === "gestion"}
                <Rdv />
                <!-- <SearchGestion /> -->
            {/if}
           
        </div>
    </div>
    <div class="div-right matrice">
        <div bind:this={displayInfo} class="display-info" >
        {#if displayContentMenu === "gestion"}
            <p>gestion</p>
        {/if}
        {#if displayContentMenu === "messages"}
            <MessagerieForumDisplay  />
        {/if}
        {#if displayContentMenu === "clients"}
            <ClientDisplay  />
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
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        height: 100%;
        /* overflow-y: scroll; */
        
    }
    .matrice {
        display: flex;
        flex-wrap: wrap;
        height: 80%;
        max-height: 500px;
        overflow: hidden;
        /* border: 1px solid white; */
        min-width:190px;
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
        background-size:200%;
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
        filter: drop-shadow(
            0 0 10px rgba(223, 215, 215, 0.5)
        );
        /* box-shadow: 0 0 10px 0 rgba(234, 233, 233, 0.5);  */
    }
    button.circle-item {
        position: relative;
        background-image: url("../../../../assets/img/engrenage.png");
        background-size:200%,200%;
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
        flex: 0;
        min-width: 370px;
        max-width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        background-color: transparent;
    }
    /* .div-center.active {
        display: block;
        flex: 1;

    } */
    .div-right {
        flex: 1;
        
    
    }
</style>
