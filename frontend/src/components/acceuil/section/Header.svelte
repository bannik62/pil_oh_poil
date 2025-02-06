<script>
  import { onMount } from 'svelte';
  // Logic goes here
</script>

<main>
  
    <div>
      <header>
        <link
          href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap"
          rel="stylesheet"
        />
        <div class="content-h1">
          <h1>Pil Oh Poil</h1>
        
        </div>
      </header>

    </div>
</main>

<style>
 header {
    width: 98%;
    height: 80vh;
    background-color: #333;
    background-image: url(../../../assets/img/shop.jpg);
    background-size: cover;
    background-position: 20% 50%;
    background-repeat: no-repeat;
    color: #fff;
    padding: 10px;
    margin-bottom:80px;
  }
 
  .content-h1 {
    background-color:transparent;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h1 {
    position: absolute;
    top: 90%;
    font-family: var(--font-family-primary);
    font-size: clamp(3rem, 14vw, 10rem);
    text-align: center;
    margin: 0;
    color: #fff;
    letter-spacing: 20px;
  }
</style>

