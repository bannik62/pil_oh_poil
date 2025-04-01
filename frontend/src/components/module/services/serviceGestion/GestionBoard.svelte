<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let circle;
    let circleItems = []; // Array to hold references to circle items
    let items = ["clients", "messages", "gestion"]; // Array of items
    let menuExpanded = false;
    let displayMenu;
    onMount(() => {
        circleItems.forEach((item, index) => {
            item.classList.add(items[index]);
        });
    });

    function moveThis(item, index) {
        console.log("item", item.classList);
        if (item.classList.contains("clients")) {
            console.log("clients");
            item.style.transform = "translate(0%, -100%)";
            // Move each item
            item.style.transition = "all 0.9s ease-in-out";
            item.classList.add(items[index]);
        }
        if (item.classList.contains("messages")) {
            console.log("messages");
            item.style.transform = "translate(50%, -0%)";
            item.style.transition = "all  0.9s ease-in-out";
            item.classList.add(items[index]);
        }
        if (item.classList.contains("gestion")) {
            console.log("gestion");
            item.style.transform = "translate(15%, 102%)";
            item.style.transition = "all 0.9s ease-in-out";
            item.classList.add(items[index]);
        }
    }
    function moveThisClose(item, index) {
        item.classList.remove(items[index]);
    }

    function expandCircle() {
        circle.style.translate = "-40%";

        // Animate each circle item
        requestAnimationFrame(() => {
            circleItems.forEach((item, index) => {
                item.style.display = "flex";
                item.style.translate = "160%"; // Move each item
                item.style.transition = "all 0.9s ease-in-out";
                item.classList.add(items[index]);
                setTimeout(() => {
                    moveThis(item, index);
                }, 500);
            });
        }, 1000);
        menuExpanded = true;
    }

    function collapseCircle() {
        // Logic to collapse the circle if needed
        circle.style.translate = "0%";
        circleItems.forEach((item, index) => {
            item.style.translate = "0%";
            item.style.transition = "all 0.9s ease-in-out";
            menuExpanded = false;
            setTimeout(() => {
                item.style.display = "none";
            }, 1000);
        });
    }
    function infoClientsRegistry() {
        console.log("displayMenu", displayMenu);
        displayMenu.style.flex = "1 1 1";
    }

    function handleClick(item) {
        if (item === "clients") {
            console.log("Clients clicked");
            infoClientsRegistry(); // Appeler la fonction associée
        } else if (item === "messages") {
            console.log("Messages clicked");
            // Appeler la fonction associée pour messages
        } else if (item === "gestion") {
            console.log("Gestion clicked");
            // Appeler la fonction associée pour gestion
        }
    }
</script>

<main>
    <div class="div-left matrice">
        <div class="circle-menu">
            <div
                bind:this={circle}
                on:click={() =>
                    menuExpanded ? collapseCircle() : expandCircle()}
                class="circle"
            >
                {#each items as item, index}
                    <button
                        bind:this={circleItems[index]}
                        class="circle-item"
                        on:click={() => handleClick(item)}
                    >
                        <p>{item}</p>
                    </button>
                {/each}
                {console.log(menuExpanded)}
                {#if menuExpanded}
                    <style>
                        .clients {
                            background-color: red !important;
                        }
                        .messages {
                            background-color: green !important;
                        }
                        .gestion {
                            background-color: blue !important;
                        }
                        .circle:hover {
                            background-color: grey;
                            cursor: pointer;
                            filter: drop-shadow(
                                0 0 10px rgba(255, 70, 70, 0.5)
                            ); /* Ajout d'ombre */
                            box-shadow: 0 0 10px 0 rgba(235, 231, 231, 0.5); /* Ajout d'ombre */
                        }
                    </style>
                {/if}
            </div>
        </div>
    </div>
    <div class="div-center matrice">
        <div bind:this={displayMenu} class="display-menu" />
    </div>
    <div class="div-right matrice">
        <div class="display-info" />
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
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .matrice {
        display: flex;
        flex-wrap: wrap;
        width: 100px;
        height: 90%;
        overflow: hidden;
    }
    .div-left {
        flex: 1;
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
        background-color: blue;
        border-radius: 50%;
        transition: all 0.9s ease-in-out; /* Transition sur tout */
        filter: drop-shadow(0 0 0 rgba(255, 70, 70, 0.5)); /* Initial */
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.5); /* Initial */
    }
    .circle-item {
        position: fixed;
        top: 25%;
        left: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 40%;
        background-color: transparent;
        border-radius: 50%;
    }

    .div-center {
        flex: 0;
        background-color: blue;
    }
    .div-right {
        flex: 1;
        background-color: green;
    }
</style>
