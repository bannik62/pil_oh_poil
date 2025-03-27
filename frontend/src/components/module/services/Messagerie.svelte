<script>
    import axios from 'axios';
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { utilisateurConnecte, infosUser, displayService } from "../../../stores/sessionStore";
    import { posts, author, content } from "../../../stores/messgerie";

    let title = "Forum de Messagerie";
    export let divInfoMail;
    let mounted = false;
    let userAuthor = $author;
    let userContent = $content;
    let userIdAuthor = $utilisateurConnecte.id;
    let utilisateur = $utilisateurConnecte; // Récupère l'utilisateur connecté
        userAuthor = $infosUser.firstName;
    console.log("divInfoMailmessage", divInfoMail , "userIdAuthor", userIdAuthor , "userAuthor", userAuthor , "userContent", userContent , "utilisateur", utilisateur);

    onMount(() => {
        divInfoMail;
        welcomeChat();
        mounted = true;
        console.log("Forum de Messagerie component mounted");
        // Récupération des posts depuis l'API
        fetchPosts();
    });

    // Fonction pour afficher le message de bienvenue
    async function welcomeChat() {
        if ($displayService === "messagerie" && divInfoMail) {
            divInfoMail.innerHTML = "";
            let welcomeChat = document.createElement("div");
            let textWelcomeChat = document.createTextNode("Bienvenue sur la messagerie " + userAuthor);
            welcomeChat.appendChild(textWelcomeChat);
            divInfoMail.appendChild(welcomeChat);
        }
    }

    // Fonction pour récupérer les messages
    async function fetchPosts() {
    try {
        const response = await axios.get(`http://localhost:3000/api/user/chat/fetch/messages/${userIdAuthor}`);
        console.log("Réponse API:", response.data);
        posts.set(response.data); // Mettre à jour le store avec les messages récupérés
    } catch (error) {
        console.error('Erreur de récupération des messages:', error);
    }
}


    // Fonction pour ajouter un post
    async function addPost() {
         // Utiliser l'ID de l'utilisateur connecté
        posts.update(currentPosts => [
            ...currentPosts,
            { id: currentPosts.length + 1, userIdAuthor, author: userAuthor, content: userContent }
        ]);

        try {
            const response = await axios.post(`http://localhost:3000/api/user/chat/post/messages/${userIdAuthor}`, {
                author: userAuthor,
                content: userContent
            });
            fetchPosts();
            console.log('Post added successfully:', response.data);
        } catch (error) {
            console.error('Error adding post:', error);
        }
    }
</script>

<div class="forum-container" transition:fade>
    <h3>{title}</h3>
    <div class="posts">
        {#each $posts as post}
            <div class="post">
                <strong>{post.userId} {post.author}:</strong> {post.content}
            </div>
        {/each}
    </div>

    <div class="new-post">
      <span class="author-name">{userAuthor}</span>
      <textarea placeholder="Votre message" bind:value={userContent}></textarea>
      <div class="btn-container">
        <button on:click={addPost}>Ajouter un message</button>
      </div>
    </div>
</div>

<style>

  .author-name{
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
        color: white;
        margin-bottom: 0.5rem;
    }

    .posts {
        height: 50%;
        margin-bottom: 0.5rem;
        overflow-y: auto;
        background-color: white;
    }

    .post {
      height: 50px;
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
    }

    .btn-container{
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
