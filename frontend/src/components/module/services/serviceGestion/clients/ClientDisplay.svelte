<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import {
        users,
        numberOfUsers,
        searchQuery,
        searchType,
        erreurMessage,
        usersWithProfiles,
    } from "../../../../../stores/gestionUtilisateur";
    $users;
    console.log("usersTop", $users);
    $numberOfUsers;
    $searchQuery;
    $searchType;
    $erreurMessage;
    let userAllInfos = writable([]);
    console.log("userinfos", $userAllInfos);

    let deleteButton;
    let csrfToken;
    let statusResponse = writable(null);
    let errorMessage = writable(null);
    let userinfosFilter;

    console.log("searchQuerycli", $searchQuery);
    console.log("userscli", $users);
    console.log("searchTypecli", $searchType);

    onMount(async () => {
        $searchType;
        const res = await fetch("http://localhost:3000/csrf-token", {
            credentials: "include",
        });
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.info(
            "Formulaire de delete Client sécurisé avec token csrfToken ",
            csrfToken
        );
    
    });
    $: if ($searchQuery.length >= 2 ) {
    getUserInfos();
}


    console.log("csrfToken", csrfToken);
    // if ($searchQuery === "") {
    //     users.set([]);
    // }

    async function getUserInfos() {
    try {
        const res = await fetch(
            "http://localhost:3000/users/api/admin/infos/getAllUsers/infos/forMail",
            {
                credentials: "include",
            }
        );
        const data = await res.json();

        let userList = $users; // récupère depuis le store principal
        let profileList = data.userProfilesInfos;
        console.log("profileList",  profileList);
        console.log("userList",  userList);
        const combined = userList.map(user => {
            const profile = profileList.find(profile => profile.id === user.userId || profile.id === user.id);
            return { ...user, ...profile }; // Combine les données de l'utilisateur et du profil
        });
        console.log("combined", combined);
        usersWithProfiles.set(combined);
      
            
        
    } catch (err) {
        console.error("Erreur lors du fetch des infos profils:", err);
    }
}


    async function deleteUser(userId, csrfToken) {
        console.log("csrfToken req", csrfToken);
        userId = userId;
        let textConfirm = "vous allez supprimer " + "  le client " + userId;
        const confirm = window.confirm(textConfirm);
        if (confirm) {
            console.log("id", userId);
            await axios
                .delete(
                    `http://localhost:3000/users/api/admin/infos/deleteUser/${userId}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",

                            "CSRF-Token": csrfToken, // Obtient le token du cookie
                        },
                    }
                )
                .then((response) => {
                    console.log("réponse", response.data.message);
                    statusResponse.set(response.data.message);
                })
                .catch((error) => {
                    console.error(
                        "Erreur lors de la suppression:",
                        error.response.data.error
                    );
                    statusResponse.set(error.response.data.error);
                });
        }
    }
</script>

<main>
    <div class="client-display" transition:fade>
        <div class="client-display-header">
            <h2>Client Information</h2>
            <p>votre requete est : {$searchQuery}</p>
        </div>
    </div>

    <div class="status-response">
        {#if $statusResponse}
            <p class="success-message">{$statusResponse}</p>
        {/if}
        {#if $errorMessage}
            <p class="error-message">{$errorMessage}</p>
        {/if}
    </div>

    <!-- -----------------------------------------Name----------------------------------------->
    {#if $searchType === "name"}
        {#if $users.length > 0}
            <div class="searchWhitName" transition:fade>
                {#each $usersWithProfiles as user}
                <table>
                    <thead>
                        <tr>
                            <th>Attribut</th>
                            <th>Données</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>Nom</td>
                                <td>{user.firstName}</td>
                            </tr>
                            <tr>
                                <td>Prénom</td>
                                <td>{user.lastName}</td>
                            </tr>
                            <tr>
                                <td>Téléphone</td>
                                <td>{user.telephone}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>Supprimer</td>
                                <td>
                                    <button
                                        bind:this={deleteButton}
                                        class="delete-button"
                                        on:click={() =>
                                            deleteUser(user.userId, csrfToken)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/each}

            </div>
        {:else}
            <p>Recherche Par nom.</p>
        {/if}
    {/if}

    <!-- -----------------------------------------Email---------------------------------------/ -->
    {#if $searchType === "email"}
        {#if $users.length > 0}
            <div class="searchWhitMail" transition:fade>
                {console.log("usersbefore each", $users)}
                {console.log("userswithprofilesbefore each", $usersWithProfiles)}
                {#each $usersWithProfiles as user}
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>{user.email}</td>
                                
                                <td>
                                    <button
                                    bind:this={deleteButton}
                                    class="delete-button"
                                    on:click={() => deleteUser(user.userId, csrfToken)}>
                                    Supprimer
                                  </button>
                                </td>
                        </tr>
                        
                    </tbody>
                </table>
                {/each}
            </div>
        {:else}
            <p>Recherche Par email.</p>
        {/if}
    {/if}

    <!-- -----------------------------------------Phone---------------------------------------/ -->
    {#if $searchType === "phone"}
        {#if $users.length > 0}
            <div class="table-info">
                <div class="vide"></div>

                {#each $usersWithProfiles as user}
                <table>
                    <thead>
                        <tr>
                            <th>Attribut</th>
                            <th>Données</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>Téléphone</td>
                                <td>{user.telephone}</td>
                            </tr>
                            <tr>
                                <td>Nom</td>
                                <td>{user.lastName}</td>
                            </tr>
                            <tr>
                                <td>Prénom</td>
                                <td>{user.firstName}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>Supprimer</td>
                                <td>
                                    <button
                                        bind:this={deleteButton}
                                        class="delete-button"
                                        on:click={() =>
                                            deleteUser(user.id, csrfToken)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/each}
                
            </div>
        {:else}
            <p>Recherche Par téléphone.</p>
        {/if}
    {/if}
</main>

<style>

    main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    /* margin: 20px; */
    /* padding: 20px; */
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    }
    main::-webkit-scrollbar {
        display: none;
    }


    
    .client-display {
        display: flex;
        /* flex-direction: column; */
        width: auto;
        margin: 5px;
        border-radius: 4px;
        /* overflow-x: auto; */
    }
    .status-response {
        display: flex;
        /* flex-direction: column; */
        /* align-items: center; */
        place-items: center;
        width: 100%;
        /* margin: 20px; */
        border-radius: 5px;
        /* padding: 10px; */
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
    }
    .success-message {
        color: green;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        padding: 10px;
        background-color: white;
        border-radius: 5px;
    }
    .error-message {
        color: red;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        padding: 10px;
        background-color: white;
        border-radius: 5px;
    }
    .client-display h2 {
        margin-bottom: 10px;
    }
    .table-info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: auto;
        /* margin: 20px;
        padding: 20px; */
        border: 1px solid #3a3535;
        border-radius: 4px;

    }
    table {
        width: 50%;
        min-width: 200px;
        margin: 20px;
        margin-block: 20px;
        
    }
    tbody tr:nth-child(odd) {
    background-color: #423d3d; /* Couleur pour les lignes impaires */
}

   tbody tr:nth-child(even) {
    background-color: #1e1d1d; /* Couleur pour les lignes paires */
}
    td {
        place-items: center;
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        background-color: #625e5e;
        min-width: 200px;
    }
    th {
        
        border: 1px solid #ccc;
        padding: 8px;
        background-color: #565353;
        
    }
    .delete-button {
        background-color: red;
        color: white;
        border: none;
        padding: 5px 10px;
    }
    .delete-button:hover {
        background-color: #8b0000;
    }

    .client-display p {
        margin: 5px 0;
    }
</style>
