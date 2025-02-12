<script>
    import salon from "../../../assets/img/table.png";
</script>

<section class="salon">
    <h2>Les Salons</h2>
    <div class="salon-content">
        <div class="left">
            <div class="text">
                <p class="text-salon">
                    ✨ Offrez-vous une parenthèse de bien-être chez Pile Oh Poil
                    ✨
                </p>
                <p>
                    Laissez le stress derrière vous et plongez dans une bulle de
                    sérénité… Dans notre salon, bercé par une musique douce et
                    une ambiance aux notes orientales, chaque soin devient une
                    invitation au lâcher-prise.
                </p>
                <p>
                    Massage apaisant, soins du visage revitalisants, gommages
                    envoûtants… <br> Tout est pensé pour éveiller vos sens et vous
                    offrir un moment hors du temps.
                </p>
                <p>
                    Fermez les yeux, respirez… <br><br>
                    ✨🌿 Vous êtes entre de bonnes mains.
                    🌿✨
                </p>
            </div>
        </div>
        <div class="right">
            <img class="salon-img" src={salon} alt="Salon" />
        </div>
    </div>
</section>

<style>
    .salon {
        position: relative;
        width: 99vw;
        height: 100vh;
        display: flex;
        /* justify-content: center; */
        /* align-items: center; */
        margin: 0 auto;
        background-color: var(--color-primary);
        margin-bottom: 70px;
        box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
    }
    .salon-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .left {
        width: 50%;
        flex-grow: 1;
        color: white;
        background-image: url("../../../assets/img/parquet.jpg");
        background-size: cover;
        background-position: center;
        padding: 20px 10px 30px 20px;
        
    }

    .text {
        background-color: var(--color-secondary);
        padding: 20px;
        height: 97%;
        flex-grow: 1;
        border-radius: 16px;
    }
    .right {
        height: 100%;
        flex-grow: 1;
    }
    .salon-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
    }

    h2 {
        position: absolute;
        top: -45%;
        left: 50%;
        translate: calc(-50%);
        margin-bottom: 1rem;
        color: var(--color-secondary);
        font-family: Lavishly Yours;
        color: #fff;
        font-size: clamp(3rem, 14vw, 10rem);
        filter: drop-shadow(10px -8px 2px rgba(0, 0, 0, 0.5));
        z-index: 1;
    }

    p {
        line-height: 2rem;
        color: #f6f6f6;
        font-size: clamp(1rem, 2vw, 2rem);
        font-weight: 400;
        margin-top: 5%;
        font-family: 'Playfair Display', serif;
    }
    .text-salon {
        font-size: clamp(1rem, 1.9vw, 2rem);
        font-weight: 900;
    }
    @media  (max-width: 600px) {
        .salon {
            height: 250vh;
            margin-bottom: 10%;
        }
        .salon-content {
            flex-wrap: wrap;
            height: 100%;
        }
        .left {
            width: 100%;
        }
        .right {
            margin-top: 10%;
            width: 100%;
            height: 45%;
        }

        h2 {
            font-size: clamp(2.9rem, 10vw, 11rem);
            top: -6%;
    }
        .salon-img {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }

    }
    @media (min-width: 390px) and (max-width: 391px) {
        .salon {    
            height: 280vh;
        }
        .salon-content {
            height: 70%;
        }
        h2 {
            font-size: clamp(2.9rem, 10vw, 11rem);
            top: -6%;
        }
        .right {
            height: 100%;
        }
        .left {
            height: 35%;
        }
    }   
     @media (min-width: 375px) and (max-width: 389px) {

        h2 {
            top: -7%;
        }
        .right {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }
        .left {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }
        .salon-img {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }
    }
    @media (min-width: 376px) and (max-width: 377px) {
        .salon {
            height: 285vh;
            margin-bottom: 10%;
        }
        .salon-content {
            height: 114%;
        }
        h2 {
            font-size: clamp(2.9rem, 10vw, 11rem);
            top: -6%;
        }
        p {
            margin-top: 10%;
            font-size: clamp(1rem, 6vw, 2rem);
            line-height: 2.5rem;
        }
        .right {
            width: 90%;
            height: 100%; 
            margin: 0 auto;
        }
        .salon-img {
            width: 100%;
            height: 90%;
            margin: 0 auto;
        }
    }
    @media (min-width: 400px) and (max-width: 415px) {
        .salon {
            height: 145vh;
            margin-bottom: 10%;
        }
        h2 {
            font-size: clamp(2.9rem, 10vw, 11rem);
            top: -6%;
        }
        .right {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }
        .left {
            width: 90%;
            height: auto; 
            margin: 0 auto;
        }
        .salon-img {
            width: 100%;
            height: auto; 
            margin: 0 auto;
        }
    }

    @media (min-width: 416px) and (max-width: 431px) {
        .salon {
            height: 170vh;
            margin-bottom: 10%;
        }
        .salon-content {
            width: 100%;
            margin: 0 auto;
        }
        .left {
            width: 80%;
        }
        .right {
            width: 90%;
        }
        .salon-img {
            width: 95%;
            height: 110%;
        }

    }
    @media (max-width: 768px) {
    }


</style>
