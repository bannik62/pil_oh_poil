<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import {
    messagesUsers,
    readMessageUsers,
  } from "../../../../../stores/gestionMessagerie";

  let newMessage = "";
  let searchQuery = "";
  let readButton;
  let csrfToken;
  let statusResponse = writable(null);
  let numberOfMessages = writable("0");
  export let reponseExpandable = writable(false);
  let sortOrder = "desc"; // 'asc' ou 'desc'

  onMount(async () => {
    await getCsrfToken();
    await fetchinfoMessages();
    await countMessages(csrfToken);
  });

  async function getCsrfToken() {
    const res = await fetch("http://localhost:3000/csrf-token", {
      credentials: "include",
    });
    const data = await res.json();
    csrfToken = data.csrfToken;
    console.info(
      "Formulaire de delete Message sécurisé avec token csrfToken ",
      csrfToken
    );
  }

  async function countMessages(csrfToken) {
    try {
      const res = await axios.get(
        "http://localhost:3000/users/api/admin/messages/get/messages/count",
        {
          withCredentials: true,
          headers: {
            "CSRF-Token": csrfToken,
          },
        }
      );
      numberOfMessages.set(res.data);
    } catch (error) {
      console.error("Erreur lors du comptage des messages:", error);
    }
  }

  async function fetchinfoMessages() {
    try {
      const [responseMessages, responseUsers] = await Promise.all([
        axios.get(
          "http://localhost:3000/users/api/admin/messages/get/messages",
          {
            withCredentials: true,
          }
        ),
        axios.get("http://localhost:3000/users/api/admin/infos/getAllUsers/", {
          withCredentials: true,
        }),
      ]);

      const messages = responseMessages.data;
      const users = responseUsers.data.userProfiles;

      const messagesEnrichis = messages.map((msg) => {
        const user = users.find((u) => u.userId === msg.userId);
        const fullName = user
          ? `${user.firstName} ${user.lastName}`
          : "Utilisateur inconnu";
        return { ...msg, fullName };
      });

      messagesUsers.set(messagesEnrichis);
      statusResponse.set("messages chargés avec succès");
      setTimeout(() => statusResponse.set(null), 5000);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des messages ou utilisateurs",
        error
      );
    }
  }

  function filteredMessages() {
    return $messagesUsers.filter(
      (message) =>
        message.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function sortedMessages() {
    return filteredMessages()
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }

  function readMessage(message, button) {
    button.style.transform = "scale(0.75)";
    readMessageUsers.set([message]); // Tu remplaces tout pour n'avoir qu'un seul message lu
    reponseExpandable.set(false);
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
            "CSRF-Token": csrfToken,
          },
        }
      );
      statusResponse.set(response.data.message);
      setTimeout(() => statusResponse.set(null), 3000);
      fetchinfoMessages();
    } catch (error) {
      console.error("Erreur lors de la suppression du message", error);
      statusResponse.set(error.response?.data?.error || "Erreur inconnue");
      setTimeout(() => statusResponse.set(null), 3000);
    }
  }
</script>

<main>
  {#if $statusResponse !== null}
    {console.log("responseMessages", $statusResponse)}
    <div class="status">{$statusResponse}</div>
  {/if}
  <div class="contain-forum" use:fade transition:fade>
    <!-- module de recherche par date ou nom  ici-->
    <div class="contain-forum-title">
      <span class="arrow-down">⬇️</span>
      <h3>
        <span class="count-messages"
          ><p>
            messages des utilisateurs :
            {$messagesUsers.length}
          </p></span
        >
      </h3>
      <span class="arrow-down">⬇️</span>
    </div>

    <div class="tri">
      <label for="sortOrder">Trier par date :</label>
      <select id="sortOrder" on:blur={(event) => sortOrder = event.target.value} bind:value={sortOrder}>
        <option value="desc">Plus récents d'abord</option>
        <option value="asc">Plus anciens d'abord</option>
      </select>
    </div>
    <!-- Champ de recherche -->
    <div class="search-container">
      <label for="searchQuery">Rechercher:</label>
    <input
      type="text"
      placeholder="Rechercher par nom ou contenu"
      bind:value={searchQuery}
      class="search-input"
      minlength="2"
    />
    </div>
    {#each sortedMessages() as message}
      {console.log("messageread", message)}
      <div class="message-user">
        <div class="name">
          Id: {message.userId} | Nom: {message.fullName}
          <span class="read-close-button-container">
            {#if message.checked === true}
              <span class="message-checked">
                <p>Message lu</p>
              </span>
            {:else}
              <span class="message-not-checked">
                <p>Message non lu</p>
              </span>
            {/if}
            <span class="read">
                <button on:click={(event) => readMessage(message, event.currentTarget)} class="read-button">
                Lire
              </button>
            </span>
            <span class="close-button-container">
              <button class="close" on:click={() => deleteMessage(message) }
                >X</button
              >
            </span>
          </span>
        </div>

        <div class="content">
          <p style="font-weight: bold;">Message : </p>
          <p>{message.fullName} :</p> <p style="color: green;">{message.content}</p>
        </div>
        {#if message.response !== null}
          <p style="font-weight: bold;">Reponse :</p>
          <div class="reponse">
            <p>Ludivine :</p>
            <p style="color: green;">{message.response}</p>
          </div>
        {:else}
          <p>Reponse :</p>
          <div class="reponse">
            <p style="color: red;">En attente de reponse...</p>
          </div>
        {/if}
        <div class="date">Date: {message.createdAt.split("T")[0]}</div>
      </div>
    {/each}
  </div>
</main>

<style>
  /* * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } */
  main {
    color: black;
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
  .search-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background-color: #476788;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid white;
    box-shadow: 5px 10px 10px rgba(144, 150, 168, 0.474) ;
    filter: drop-shadow(0 0 15px rgb(120, 118, 118) );
  }
  .tri {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background-color: #476788;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid white;
    box-shadow: 5px 10px 10px rgba(144, 150, 168, 0.474) ;
    filter: drop-shadow(0 0 15px rgb(120, 118, 118) );
  }
  .contain-forum {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: black;
    max-height: 450px;
    min-width: 400px;
    overflow-y: auto;
    padding-bottom: 50px;
    border: 1px;
    border-top: 2px;
    border-bottom: 8px;
    border-left: 1px;
    border-right: 15px;
    border-color: #476788;
    border-style: solid;
    border-radius: 20px;
    box-shadow: 0 25px 25px rgba(72, 78, 98, 0.897) inset;
    filter: drop-shadow(0 0 50px rgba(255, 255, 255, 0.7) inset);
  }
  .contain-forum::-webkit-scrollbar {
    display: none;
  }
  .contain-forum-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    font-weight: bold;
    color: #ffffff;
    background-color: #476788;
    padding-inline: 10px;
    border-radius: 5px;
    margin-top: 10px;
    border: 1px solid white;
    box-shadow: 5px 10px 10px rgba(144, 150, 168, 0.474) ;
    filter: drop-shadow(0 0 15px rgb(120, 118, 118) );
  }
  .count-messages {
    font-size: 1rem;
    font-weight: bold;
  }
  .arrow-down {
    font-size: 30px;
    font-weight: bold;
  }
  .search-input {
    max-height: auto;
    font-size: 12px;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
  } 
  .message-checked {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #bfd7ef;
    color: green;
    border-radius: 5px;
    padding-inline: 5px;
    height: 30px;
  }
  .message-checked p {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .message-not-checked {
    background-color: #f1f1f1;
    color: black;
    border-radius: 5px;
    padding: 5px;
  }
  .content {
    width: 100%;
    height: auto;
    max-height: auto;
    font-size: 1rem;
    font-weight: bold;
    background-color: #f1f1f1;
    padding: 5px;
  }
  .name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    border-bottom: 1px solid rgb(16, 16, 16);
    background-color: #476788;
    color: white;
    border-radius: 3px 3px 0 0;
    padding: 5px;
    margin-bottom: 5px;
  }
  .read-close-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .read-button {
    background-color: #5565f5;
    color: rgb(255, 255, 255);
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    transition: transform 0.2s ease; /* Ajoutez cette ligne */
  }
  .read-button:hover {
    background-color: #BFD7EF;
    color: green;
  }
  .close {
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    border-bottom: 1px solid rgb(16, 16, 16);
    background-color: #ff0000;
    padding: 5px;
    border-radius: 5px;
    color: white;
    transition: background-color 0.2s ease;
  }
  .close:hover {
    background-color: #885647;
  }
  .message-user {
    background-color: #bfd7ef;
    padding: 2px 2px 3px 2px;
    border-radius: 5px;
    height: 100%;
    min-height: 300px;
    width: 90%;
    overflow-y: auto;
  }
  .message-user::-webkit-scrollbar {
    display: none;
  }
  
  .reponse {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    background-color: #f1f1f1;
  }
  .reponse p {
    font-size: 1rem;
    font-weight: bold;
  }
  .date {
    background-color: #476788;
    font-size: 13px;
    font-weight: bold;
    color: white;
    border-radius: 0 0 3px 3px;
    padding: 5px;
    /* border-bottom: 1px solid rgb(16, 16, 16); */
  }
</style>
