<script>
    let visible = false;

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            // behavior: "smooth",
        });
    }

    function handleScroll() {
        visible = window.scrollY > 400;
    }
</script>

<svelte:window on:scroll={handleScroll} />

{#if visible}
    <button class="scroll-top" on:click={scrollToTop}> ↑ </button>
{/if}

<style>
    .scroll-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(240, 248, 255, 0.252);
        backdrop-filter: blur(5px);
        color: white;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .scroll-top:hover {
        background-color: rgba(240, 248, 255, 0.089);
        border: 2px solid white;
        backdrop-filter: blur(25px);
        transform: translateY(-3px);
    }
</style>
