<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    export let searchQuery = "";
    export let searchType = "name";
    let numberOfUsers = writable(0);
    let erreurMessage = writable("");
    export let users = writable([]);
    let statusResponse = writable(null);
    console.log("userssearchsearch", $users);

    function handleSearch(event) {
    searchQuery = event.target.value;
    if (searchQuery.length >= 2) {
        if (searchType === "name") {
            axios.get(`http://localhost:3000/users/api/admin/infos/getUserByName/${searchQuery}`, {
                withCredentials: true
            }).then(response => {
                console.log("response", response);
                let usersInfo = response.data.userProfiles;
                statusResponse.set(response.data.message);
                users.set(usersInfo);
                setTimeout(() => {
                    statusResponse.set(null);
                }, 3000);
            }).catch(error => {
                erreurMessage.set(error.response.data.error);
                setTimeout(() => {
                    erreurMessage.set(null);
                }, 3000);
            });
        }

        if (searchType === "email") {
            console.log("Recherche par email:", searchQuery);
            axios.get(`http://localhost:3000/users/api/admin/infos/getUserByEmail/${searchQuery}`, {
                withCredentials: true
            }).then(response => {
                console.log("response", response);
                statusResponse.set(response.data.message);
                let usersInfo = response.data.user;
                users.set(usersInfo);
                setTimeout(() => {
                    statusResponse.set(null);
                }, 3000);
            }).catch(error => {
                erreurMessage.set(error.response.data.error);
                setTimeout(() => {
                    erreurMessage.set(null);
                }, 3000);
            });
        }

        if (searchType === "surname") {
            axios.get(`http://localhost:3000/users/api/admin/infos/getUserBySurname/${searchQuery}`, {
                withCredentials: true
            }).then(response => {
                console.log("response", response);
                statusResponse.set(response.data.message);
                let usersInfo = response.data.user;
                users.set(usersInfo);
                setTimeout(() => {
                    statusResponse.set(null);
                }, 3000);
            }).catch(error => {
                erreurMessage.set(error.response.data.error);
                setTimeout(() => {
                    erreurMessage.set(null);
                }, 5000);
            });
        }
    }
}

    function handleSearchTypeChange(event) {
        console.log("event", event.target.value);
        searchType = event.target.value;
        users.set([]);
    }

    onMount(async () => {
        const response = await axios.get(`http://localhost:3000/users/api/admin/infos/getAllUsers`, {
            withCredentials: true
        });
        numberOfUsers.set(response.data.userProfiles.length);
    });
</script>

<main>
    {#if $erreurMessage}
        <p class="error-message">{$erreurMessage}</p>
    {/if}
    {#if $statusResponse}
        <p class="status-message">{$statusResponse}</p>
    {/if}
    <div class="number-of-users">
        <p> Nombre d'utilisateurs : <span class="number-of-users-value">{$numberOfUsers}</span></p>
    </div>

    <div class="search-container" transition:fade>
        <input type="text" placeholder="Search..." on:input={handleSearch} />
        <div class="radio-buttons">
            <label>
                <input type="radio" name="searchType" value="name" on:change={handleSearchTypeChange} checked />
                Nom
            </label>
            <label>
                <input type="radio" name="searchType" value="email" on:change={handleSearchTypeChange} />
                Email
            </label>
            <label>
                <input type="radio" name="searchType" value="surname" on:change={handleSearchTypeChange} />
                Téléphone
            </label>
        </div>
    </div>
</main>

<style>
    .error-message {
        color: red;
        font-weight: bold;
        margin: 20px;
        background-color: rgb(239, 220, 220);
        padding: 10px;
        border-radius: 5px;

    }
    .error-message::before {
        content: "⚠️";
        margin-right: 5px;
    }
    .status-message {
        color: green;
        font-weight: bold;
        margin: 20px;
        background-color: rgb(220, 239, 220);
        padding: 10px;
        border-radius: 5px;
    }
    .status-message::before {
        content: "✅";
        margin-right: 5px;
    }
    
    
    
    

    .number-of-users {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px;
    }

    .number-of-users-value {
        font-weight: bold;
        color: rgb(144, 245, 144);
    }

    .search-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
    }

    input[type="text"] {
        padding: 10px;
        margin-bottom: 10px;
        width: 200px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .radio-buttons {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    label {
        margin: 0 10px;
    }
</style>
