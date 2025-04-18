<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import { users, numberOfUsers, searchQuery, searchType, erreurMessage } from "../../../../../stores/gestionUtilisateur";
    let statusResponse = writable(null);
    console.log("userssearchsearch", $users);

    onMount(async () => {
        const response = await axios.get(`http://localhost:3000/users/api/admin/infos/getAllUsers/infos`, {
            withCredentials: true
        });
        numberOfUsers.set(response.data.userProfiles.length);
        users.set(response.data.userProfiles);
    });


    function search(event) {
        let searchQueryValue = event.target.value;
        // console.log("searchQueryValue", searchQueryValue);
         searchQuery.set(searchQueryValue);
    if (searchQueryValue.length >= 2) {
    //  console.log("searchType", $searchType);
   
     if ($searchType === "name") {
            axios.get(`http://localhost:3000/users/api/admin/infos/getUserByName/${$searchQuery}`, {
                withCredentials: true
            }).then(response => {
                // console.log("responsename", response.data.userProfiles);
                let usersInfobyName = response.data.userProfiles;
                statusResponse.set(response.data.message);
                users.set(usersInfobyName);
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

        if ($searchType === "email") {
            console.log("Recherche par email:", $searchQuery);
            axios.get(`http://localhost:3000/users/api/admin/infos/getUserByEmail/${$searchQuery}`, {
                withCredentials: true
            }).then(response => {
                console.log("responsemail", response.data.users);
                let usersInfobyEmail = response.data.users;
                console.log("usersInfobyEmail", usersInfobyEmail);
                users.set(usersInfobyEmail);
                statusResponse.set(response.data.message);
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

        if ($searchType === "phone") {
                axios.get(`http://localhost:3000/users/api/admin/infos/getUserByPhone/${$searchQuery}`, {
                    withCredentials: true
                }).then(response => {
                    // console.log("response", response);
                    let usersInfo = response.data.userPhone;
                    users.set(usersInfo);
                    statusResponse.set(response.data.message);
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
    }
}


                
    function handleSearchTypeChange(event) {
        console.log("event", event.target.value);
        searchType.set(event.target.value);
        users.set([]);
    }


</script>

<main>    
    <div class="search-container" transition:fade>

    {#if $erreurMessage}
        <p class="error-message">{$erreurMessage}</p>
    {/if}
    {#if $statusResponse}
        <p class="status-message">{$statusResponse}</p>
    {/if}
    <div class="number-of-users">
        <p> Nombre d'utilisateurs : <span class="number-of-users-value">{$numberOfUsers}</span></p>
    </div>

        <input type="text" placeholder="Search..." on:input={search} />
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
                <input type="radio" name="searchType" value="phone" on:change={handleSearchTypeChange} />
                Téléphone
            </label>
        </div>
    </div>
</main>

<style>
    .error-message {
        font-size: 1rem;
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
        font-size: 1rem;
        position: fixed;
        top: -100px;
        left: 0;
        color: green;
        font-weight: bold;
        margin: 20px;
        background-color: rgb(220, 239, 220);
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
        isolation: isolate;
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
        background-color: #476788;
        border-radius: 5px;
        font-size: 1rem;
        padding: 10px;
        margin-bottom: 50px;
        width: 100%;
    }

    .number-of-users-value {
        font-weight: bold;
        color: rgb(144, 245, 144);
    }

    .search-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
        /* background-color: #476788; */
        border-radius: 5px;
        font-size: 1.5rem;
        padding: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
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
