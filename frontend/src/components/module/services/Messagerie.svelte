<script>
  import axios from "axios";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    utilisateurConnecte,
    infosUser,
    displayService,
  } from "../../../stores/sessionStore";
  import {
    posts,
    author,
    content,
    messageStatus,
    messageStatusType,
  } from "../../../stores/messagerie";
  import UserClassMessage from "../../../class/userClassMessage";
  let title = "Messagerie";
  export let divInfoMail;
  export let mounted;

  let userAuthor = $author;
  let userContent = $content;
  let userIdAuthor = $utilisateurConnecte.id;
  let utilisateur = $utilisateurConnecte; // Récupère l'utilisateur connecté
  let userAuthorName = $infosUser.firstName;
  let displayStatusErreur ;
  console.log(
    "displayStatusErreur",
    "divInfoMailmessage",
    divInfoMail,
    "userIdAuthor",
    userIdAuthor,
    "userAuthor",
    userAuthor,
    "userContent",
    userContent,
    "utilisateur",
    utilisateur
  );

  onMount(() => {
    displayStatusErreur;
    divInfoMail;
    welcomeChat();
    mounted = true;
    console.log("Forum de Messagerie component mounted");
    // Récupération des posts depuis l'API
    fetchPosts();
    chatScroolBottom();
  });

  function chatScroolBottom() {
    const postsContainer = document.querySelector('.posts');
    if (postsContainer) {
      postsContainer.scrollTop = postsContainer.scrollHeight;
    }
  }

  // Fonction pour afficher le message de bienvenue
  async function welcomeChat() {
    if ($displayService === "messagerie" && divInfoMail) {
      divInfoMail.innerHTML = "";
      let welcomeChat = document.createElement("div");
      let textWelcomeChat = document.createTextNode(
        "Bienvenue sur la messagerie " + userAuthorName
      );
      welcomeChat.appendChild(textWelcomeChat);
      divInfoMail.appendChild(welcomeChat);
    }
  }

  // Fonction pour récupérer les messages
  async function fetchPosts() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/chat/fetch/messages/${userIdAuthor}`
      );
      console.log("Réponse API:", response.data);
      posts.set(response.data); // Mettre à jour le store avec les messages récupérés
    } catch (error) {
      console.error("Erreur de récupération des messages:", error);
    }
  }

  // Fonction pour ajouter un post

async function addPost(e) {
  e.preventDefault();
    let newPost = new UserClassMessage(userIdAuthor, userAuthorName, userContent);
    console.log("newPost avant validation", newPost);

    // Vérifier s'il y a des erreurs avant d'envoyer
    if (newPost.erreur.length > 0) {
        console.error("Erreurs détectées:", newPost.erreur);
        messageStatus.set(newPost.erreur.join(" | "));
        messageStatusType.set("error");
        setTimeout(() => {
            messageStatus.set("");
            messageStatusType.set("");
        }, 5000);
        return; // Ne pas envoyer la requête si l'objet est invalide
    }

    try {
        const response = await axios.post(
            `http://localhost:3000/api/user/chat/post/messages/${userIdAuthor}`,
            {
                author: newPost.userAuthor,
                content: newPost.content,
            }
        );

        fetchPosts();
        messageStatus.set("Message envoyé");
        messageStatusType.set("success");
        userContent = "";
        chatScroolBottom();

        setTimeout(() => {
            messageStatus.set("");
            messageStatusType.set("");
        }, 5000);

        console.log("Post ajouté avec succès:", response.data);
    } catch (error) {
        let errorMessage = "Une erreur inconnue s'est produite.";

        if (error.response && error.response.data) {
            console.error("Erreur côté backend:", error.response.data);
            errorMessage = error.response.data.error || JSON.stringify(error.response.data);
        } else {
            console.error("Erreur côté frontend:", error.message);
            errorMessage = error.message;
        }

        messageStatus.set(errorMessage);
        messageStatusType.set("error");

        setTimeout(() => {
            messageStatus.set("");
            messageStatusType.set("");
        }, 5000);
    }
}

</script>

<div class="forum-container" transition:fade>
  <div class="forum-container-header">
    <h3>{title}</h3>
    <div class="message-status" class:success={$messageStatusType === "success"} class:error={$messageStatusType === "error"}>
        {#if $messageStatus}
            <p>{$messageStatus}</p>
        {/if}
    </div>
</div>

  <div class="posts">
    {#each $posts as post}
      <div class="post">
        <strong> {userAuthorName}:</strong>
        {post.content}
      </div>
    {/each}
  </div>

  <div class="new-post">
    <span class="author-name">{userAuthor}</span>
    <textarea placeholder="Votre message" bind:value={userContent} />
    <div class="btn-container">
      <button on:click={addPost}>Ajouter un message</button>
    </div>
  </div>
</div>

<style>
  .author-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0.5rem;
  }
  .forum-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: rgb(91, 146, 193);
  }

  h3 {
    font-size: 1rem;
    color: white;
  }
  .message-status {
    padding: 5px;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    display: none; /* Caché par défaut */
}

.message-status p {
    margin: 0;
}

.message-status.success {
    display: block;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message-status.error {
    display: block;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}


  .posts {
    height: 50%;
    margin-bottom: 0.5rem;
    overflow-y: auto;
    background-color: white;
    border-radius: 10px 10px 10px 10px;
  }

  .post {
    height: max-content;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }

  .new-post {
    position: relative;
    bottom: 0;
    display: flex;
    flex-direction: column;
  }

  textarea {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    height: 50px;
  }

  .btn-container {
    display: flex;
    justify-content: end;
    align-items: center;
  }

  button {
    padding: 0.5rem;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 50%;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
