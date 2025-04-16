<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { messagesUsers, readMessageUsers } from "../../../../../stores/gestionMessagerie"
    import { fade } from "svelte/transition";
    let messageSend = "";
    let csrfToken = "";
    let messageContainer = writable(false);
    console.log("messageContainer", messageContainer);
    export let reponseExpandable = writable(false);
    let statusResponse = writable(null);

    // console.log("messagesUsersforumdisplay", $messagesUsers);
    // console.log("readMessageUsersforumdisplay", $readMessageUsers);
    onMount(() => {
        getCsrfToken();
    });

    async function fetchinfoMessages() {
    try {
      const [responseMessages, responseUsers] = await Promise.all([
        axios.get(
          "http://localhost:3000/users/api/admin/messages/get/messages",
          { withCredentials: true }
        ),
        axios.get("http://localhost:3000/users/api/admin/infos/getAllUsers/", {
          withCredentials: true,
        }),
      ]);

      const messages = responseMessages.data;
      // responseMessages.set(messages);
      const users = responseUsers.data.userProfiles;
      console.log("users", users);
      console.log("messages avant enrichissement", messages);
      const messagesEnrichis = messages.map((msg) => {
        console.log("msgenrichis", msg);
        const user = users.find((u) => u.userId === msg.userId);
        const fullName = user
          ? `${user.firstName} ${user.lastName}`
          : "Utilisateur inconnu";

        return { ...msg, fullName };
      });
      console.log("messagesEnrichis", messagesEnrichis);
      messagesUsers.set(messagesEnrichis);

    } catch (error) {
      console.error(
        "Erreur lors du chargement des messages ou utilisateurs",
        error
      );
    }
  }
    async function getCsrfToken() {
        const res = await fetch("http://localhost:3000/csrf-token", {
            credentials: "include",
        });
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.info(
            "Formulaire d'envois Message sécurisé avec token csrfToken ",
            csrfToken
        );
    }

    async function sendMessage(messageId, messageSend) {
        // Récupérer la valeur du textarea
        const responseValue = messageSend; // Utiliser le store pour obtenir la valeur
        // console.log("responseValue", responseValue);
        if (responseValue !== "") {
            // Ici, vous pouvez gérer l'envoi de la réponse
            console.log("responseValue", responseValue); // Affiche la valeur dans la console
            try {
                const response = await axios.put(
                    `http://localhost:3000/users/api/admin/messages/response/${messageId}`,
                    {
                        message: responseValue,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "CSRF-Token": csrfToken,
                        },
                        withCredentials: true,
                    }
                );
                console.log("data", response.data);
                statusResponse.set(response.data.message);
                setTimeout(() => {
                    statusResponse.set(null);
                }, 3000);
            } catch (error) {
                console.error(
                    "Erreur lors de l'envoi du message:",
                    error.message
                );
            }
            messageSend = ""; // Réinitialiser le textarea
            readMessageUsers.set([]);
            // fetchMessages();
        }
    }

    async function checkMessage(message) {
        // console.log("message", message.userId);
        console.log("csrfTokencheckmessage", csrfToken);
        try {
            const response = await axios.put(
                `http://localhost:3000/users/api/admin/messages/${message.id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": csrfToken,
                    },
                    withCredentials: true,
                }
            );
            console.log("data", response.data);
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour du message:",
                error.message
            );
        }
    }

    async function deleteMessage(message) {
        confirm(
            "vous allez supprimer le message de " +
                message.fullName +
                " avec l'id " +
                message.id
        );
        try {
            const response = await axios.delete(
                `http://localhost:3000/users/api/admin/messages/delete/message/${message.id}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",

                        "CSRF-Token": csrfToken, // Obtient le token du cookie
                    },
                }
            );
            console.log("response", response);
            statusResponse.set(response.data.message);
            setTimeout(() => {
                statusResponse.set(null);
            }, 3000);
            // fetchinfoMessages();
            messagesUsers.update(messages => messages.filter(m => m.id !== message.id));
            readMessageUsers.update(messages => messages.filter(m => m.id !== message.id));
            fetchinfoMessages();
        } catch (error) {
            console.error("Erreur lors de la fermeture du message", error.response.data.error);
            statusResponse.set(error.response.data.error);
            setTimeout(() => {
                statusResponse.set(null);
            }, 3000);
        }
    }
</script>

<main>
    {#if $statusResponse !== null}
        <div class="status">{$statusResponse}</div>
    {/if}
    <div bind:this={messageContainer} class="message-container" use:fade transition:fade  >
        {#each $readMessageUsers as message}
            <!-- {console.log("message",message.checked)} -->
            <div class="message {message.checked === true ? 'checked' : 'not-checked'}">
                <div class="message-header">
                    <span class="user">{message.fullName}</span>
                    {#if message.checked}
                        <span class="checked">Checked</span>
                    {:else}
                        <span class="not-checked">Not Checked</span>
                    {/if}
                    <span class="timestamp"
                        >{message.createdAt.split("T")[0]}</span
                    >
                    {#if message.response !== null}
                        <span class="checked">réponse ok</span>
                    {:else}
                        <span class="not-checked">A repondre</span>
                    {/if}
                </div>
                <div class="message-content">{message.content}</div>
                <!-- {console.log("message",message)} -->
                {#if $reponseExpandable === true}
                    {#if message.response !== null}
                        <div class="message-reponse">
                            <p>{message.response}</p>
                        </div>
                    {:else}
                        <div class="message-reponse">
                            {checkMessage(message)}
                            <textarea
                                bind:value={messageSend}
                                class="message-reponse-textarea"
                                placeholder="Repondre"
                            ></textarea>
                            <button
                                class="message-reponse-button"
                                on:click={() =>
                                    sendMessage(message.id, messageSend)}
                                >Envoyer</button
                            >
                        </div>
                    {/if}
                {/if}

                <div class="message-actions">
                    {#if message.response === null}
                        <button
                            class="message-action-button-collapse"
                            on:click={() => {
                                reponseExpandable.update((value) => !value);
                                checkMessage(message);
                            }}
                        >
                            {#if $reponseExpandable}
                                Fermé
                            {:else}
                                Repondre
                            {/if}
                        </button>

                        <button
                            class="message-action-button-supprimer"
                            on:click={() => deleteMessage(message)}
                            >Supprimé</button
                        >
                    {:else}
                        <div class="youHaveRead">
                            <div class="youHaveRead-content">
                                <p style="color: black;">Ludivine:</p>
                                <p style="color: green;">{message.response}</p>
                            </div>
                            <p style="color:#476788 ;">
                                vous avez repondu à ce message
                            </p>
                            <button
                                class="message-action-button-supprimer"
                                on:click={() => deleteMessage(message)}
                                >Supprimé</button
                            >
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }
    .status {
        color: green;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        background-color: white;
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 10px;
    }
    .message-container {
        flex: 1;
        overflow-y: auto;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
        height: 100%;
    }
    .message {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: clamp(12px, 1.1vw, 16px);
        color: #ffffff;
        background-color: #476788;
        padding: 5px;
        border-radius: 5px 5px 0 0;
    }
    .checked {
        color: green;
        font-weight: bold;
        padding: 5px;
        border-radius: 5px;
        background-color: #bfd7ef;
    }
    .not-checked {
        color: red;
        font-weight: bold;
        padding-inline: 5px;
        border-radius: 5px;
        background-color: #bfd7ef;
    }
    .message-content {
        margin-top: 5px;
        font-size: 1em;
        background-color: white;
        padding: 15px;
        color: black;
        border-radius: 0 0 5px 5px;
    }

    .message-reponse {
        position: relative;
    }
    .message-reponse-textarea {
        width: 100%;
        height: 100px;
        box-sizing: border-box;
    }
    .message-reponse-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }
    .message-reponse-button:hover {
        background-color: #0056b3;
    }

    .message-actions {
        color: white;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10px;
        gap: 10px;
    }

    .message-action-button-collapse {
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }
    .message-action-button-collapse:hover {
        background-color: #0056b3;
    }
    .youHaveRead {
        width: 100%;
        color: black;
        background-color: #e9ebed;
        padding: 10px;
        border-radius: 5px;
        border-top: 2px solid #ccc;
    }
    .youHaveRead-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }
    .message-action-button-supprimer {
        background-color: red;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }
    .message-action-button-supprimer:hover {
        background-color: #b30000;
    }
    .message-reponse-textarea {
        width: 100%;
        height: 100px;
        border-radius: 5px;
        border: 1px solid #ccc;
        resize: none;
        overflow-y: auto;
    }
</style>
