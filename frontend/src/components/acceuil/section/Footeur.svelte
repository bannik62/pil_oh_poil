<script>
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>Pil Oh Poil</h3>
            <p>Institut de beauté</p>
            <p>123 rue Example</p>
            <p>75000 Paris, France</p>
        </div>

        <div class="footer-section">
            <h3>Contact</h3>
            <p>Tél : 01 23 45 67 89</p>
            <p>Email : contact@pilohpoil.fr</p>
        </div>

        <div class="footer-section">
            <h3>Horaires</h3>
            <p>Lundi - Vendredi : 9h - 19h</p>
            <p>Samedi : 10h - 18h</p>
            <p>Dimanche : Fermé</p>
        </div>

        <div class="footer-section">
            <h3>Mentions Légales</h3>
            <p><a href="/mentions-legales">Conditions générales</a></p>
            <p><a href="/confidentialite">Politique de confidentialité</a></p>
            <p><a href="#">Gestion des cookies</a></p>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; {currentYear} Pil Oh Poil. Tous droits réservés@codeurBase.</p>
    </div>
</footer>

<style>
    .footer {
    color: white;
        background:  linear-gradient(to TOP, #8A52B3 30%, #438b88 100%);
        color: white;
        padding: 3rem 0 1rem 0;
        margin-top: 4rem;
        box-shadow: 0 -10px 10px rgba(0, 0, 0, 0.1);
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        padding: 0 2rem;
    }

    .footer-section h3 {
        font-family: 'Lavishly Yours', cursive;
        font-size: 1.8rem;
        font-weight: bolder;
        margin-bottom: 1rem;
        color: white;
    }

    .footer-section p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .footer-section a {
        color: white;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .footer-section a:hover {
        color: var(--color-secondary);
    }

    .footer-bottom {
        height: 120px;
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom p {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 900px) {
        .footer-content {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .footer-content {
            grid-template-columns: 1fr;
        }

        .footer-section {
            text-align: center;
        }
    }
</style>
