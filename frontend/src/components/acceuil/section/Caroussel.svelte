<script>
  import { onMount } from "svelte";
  import image1 from "../../../assets/img/massage2.png";
  import image2 from "../../../assets/img/shop.jpg";
  import image3 from "../../../assets/img/tablemassage.jpg";
  import pilo from "../../../assets/img/pilo.png";
  let currentSlide = 0;
  let slides = [
    {
      image: image1,
      title: "Massage",
      description: "Détendez-vous avec nos massages relaxants",
    },
    {
      image: image2,
      title: "Notre Institut",
      description: "Un espace dédié à votre bien-être",
    },
    {
      image: image3,
      title: "Équipements",
      description: "Du matériel professionnel pour votre confort",
    },
    {
      image: pilo,
      title: "Pilo",
      description: "Un espace dédié à votre bien-être",
    },
  ];

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }

  // Auto-play
  onMount(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  });
</script>

<div class="carousel-container">
  <h2>Pil Oh Poil en image</h2>
  <div class="carousel">
    <button class="nav-button prev" on:click={prevSlide}>&#10094;</button>

    <div
      class="slide"
      style="background-image: url({slides[currentSlide].image})"
    >
      <div class="slide-content">
        <h3>{slides[currentSlide].title}</h3>
        <p>{slides[currentSlide].description}</p>
      </div>
    </div>

    <button class="nav-button next" on:click={nextSlide}>&#10095;</button>
  </div>

  <div class="dots">
    {#each slides as _, i}
      <span
        class="dot"
        class:active={currentSlide === i}
        on:click={() => (currentSlide = i)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === "Enter" && (currentSlide = i)}
      />
    {/each}
  </div>
</div>

<style>
  .carousel-container {
    position: relative;
    align-items: center;
    justify-content: center;
    justify-items: center;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 80vh;
    padding: 20px;
    background-image: url(/src/assets/img/parquet.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    margin-bottom: 20px;
    border-radius: 10px;
  }
  .carousel-container h2 {
    position: absolute;
    top: -300px;
    left: 59%;
    width: 100%;
    translate: calc(-50%);
    margin-bottom: 1rem;
    color: var(--color-secondary);
    font-family: Lavishly Yours;
    color: #fff;
    font-size: clamp(3rem, 14vw, 10rem);
    filter: drop-shadow(10px -8px 2px rgba(0, 0, 0, 0.5));
    z-index: 3;
  }

  .carousel {
    position: relative;
    border: 1px solid var(--color-secondary);
    position: relative;
    width: 80%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: all 0.5s ease;
  }

  .slide-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    backdrop-filter: blur(5px);
  }

  .slide-content h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }

  .slide-content p {
    margin: 10px 0 0;
    font-size: 1.2rem;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.3);
    color: white;
    padding: 16px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }

  .dots {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .dot {
    width: 12px;
    height: 12px;
    margin: 0 5px;
    background: #bbb;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .dot.active {
    background: #717171;
  }

  @media (max-width: 600px) {
    .carousel-container {
      height: 60vh;
      width: 85%;
      border-radius: 10px;
      margin: 0 auto;
    }
    .carousel {
      height: 100%;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .carousel {
      height: 300px;
    }

    .slide-content h2 {
      font-size: 1.5rem;
    }

    .slide-content p {
      font-size: 1rem;
    }
  }
</style>
