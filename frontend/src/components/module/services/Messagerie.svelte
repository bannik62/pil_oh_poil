<script>
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { utilisateurConnecte,infosUser,displayService } from "../../../stores/sessionStore";
    import { posts, author, content } from "../../../stores/messgerie";
    let title = "Forum de Messagerie";
    export let divInfoMail;
    let mounted = false;
    let userAuthor = $author;
    let userContent = "";
    let utilsateur ;
    userAuthor = $infosUser.firstName;
    utilsateur = $utilisateurConnecte;
   console.log("divInfoMailmessage",divInfoMail);
   if($displayService === "messagerie" && divInfoMail){
      divInfoMail.innerHTML = "";
      let welcomeChat = document.createElement("div");
      let textWelcomeChat = document.createTextNode("Bienvenue sur le chat");
      welcomeChat.appendChild(textWelcomeChat);
      divInfoMail.appendChild(welcomeChat);
    }

    onMount(() => {
      divInfoMail;

        mounted = true;
        console.log("Forum de Messagerie component mounted");
        // Simulate fetching initial posts

    });

    function addPost(author, content) {
        posts.update(currentPosts => [
            ...currentPosts,
            { id: currentPosts.length + 1, author, content }
        ]);
    }
</script>

<div class="forum-container" transition:fade>
    <h3>{title}</h3>
    <div class="posts">
        {#each $posts as post}
            <div class="post">
                <strong>{post.author}:</strong> {post.content}
            </div>
        {/each}
    </div>
    <div class="new-post">
      <span class="author-name">{userAuthor}</span>
      <textarea placeholder="Votre message" bind:value={userContent}></textarea>
        <button on:click={() => addPost(userAuthor, userContent)}>Ajouter un message</button>
    </div>
</div>

<style>
  *{
    outline: 1px solid red;
  }
  .author-name{
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }
    .forum-container {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background-color: #f0f0f0;
        overflow: scroll;
    }
    
    h3 {
        color: #333;
        margin-bottom: 0.3rem;
    }

    .posts {
        height: 50%;
        margin-bottom: 1rem;
        overflow: scroll;
    }

    .post {
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

    button {
        padding: 0.5rem;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>