<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import UserInfo from "../../../../../class/UserClassLogin";
    import { get } from "svelte/store";
    import { fade } from "svelte/transition";
    const userClient = new UserInfo();

    export let searchQuery;
    export let users;
    export let searchType = "name";
    let deleteButton;
    let csrfToken;
    let statusResponse = writable(null);
    let errorMessage = writable(null);
    console.log("searchQuerycli", searchQuery);
    console.log("userscli", $users)
    console.log("searchTypecli", searchType)



    onMount(async () => {
        searchType
        const res = await fetch('http://localhost:3000/csrf-token', { credentials: 'include' });
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.info("Formulaire de delete Client sécurisé avec token csrfToken ", csrfToken);
      });

        console.log("csrfToken", csrfToken);
        if (searchQuery === "") {users.set([]);}

    const deleteUser = (userId,csrfToken) => {
        console.log("csrfToken req", csrfToken);
        userId = userId;
        let textConfirm =
            "vous allez supprimer " +
    
            "  le client " +
            userId;
        const confirm = window.confirm(textConfirm);
        if (confirm) {
            console.log("id", userId);
            axios
                .delete(
                    `http://localhost:3000/users/api/admin/infos/deleteUser/${userId}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
 
                            'CSRF-Token': csrfToken, // Obtient le token du cookie
                        },
                    }
                
                )
                .then((response) => {
                    console.log("réponse", response.data.message);
                    statusResponse.set(response.data.message);
                })
                .catch((error) => {
                    console.error("Erreur lors de la suppression:", error);
                    errorMessage.set(error.response.data.message);
                });
        }
    };

    
</script>

<main>
    <div class="client-display" transition:fade>
        <div class="client-display-header">
            <h2>Client Information</h2>
            <p>votre requete est : {searchQuery}</p>
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
    {console.log("user beforetable", $users , "searchType :", searchType)}
    {#if searchType === "email"}
        {#if $users.length > 0}
            <div class="searchWhitMail" transition:fade>
                <div class="searchWhitMail-header">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each $users as user}
                                <tr>
                                    <td>{user.email}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {:else}
            <p>Recherche Par email.</p>
        {/if}
    {/if}
    {#if searchType === "name"}
        {#if $users.length > 0}
            <div class="table-info">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Téléphone</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $users as user}
                            <tr>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.telephone}</td>
                                <td>
                                    <button
                                        bind:this={deleteButton}
                                        class="delete-button"
                                        onclick={() => deleteUser(user.userId, csrfToken)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p>Recherche Par nom.</p>
        {/if}
    {/if}
    
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        width: 100%;
        margin: 20px;
        padding: 20px;
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
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 20px;
    }
    .success-message {
        color: green;
    }
    .error-message {
        color: red;
    }
    .client-display h2 {
        margin-bottom: 10px;
    }
    .table-info {
        display: flex;
        justify-content: center;
        align-items: center;
        width: auto;
        margin: 20px;
        padding: 20px;
        border: 1px solid #3a3535;
        border-radius: 4px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        background-color: #1e1d1d;
    }
    th {
        border: 1px solid #ccc;
        padding: 8px;
        background-color: #1e1d1d;
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
