<script>
    import { onMount } from "svelte";
    import * as L from "leaflet";
    let map;
    import "leaflet/dist/leaflet.css";
    import "leaflet-routing-machine";
    import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
    import shopstreet from "../../../assets/img/shopstreet.png";

    // Coordonnées du magasin
    const storeLat = 50.9464832;
    const storeLng = 1.8589124;

    onMount(() => {
        // Initialise la carte centrée sur le magasin
        map = L.map("map").setView([storeLat, storeLng], 13);

        // Ajouter les tuiles OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Ajouter un marqueur à l'emplacement du magasin
        L.marker([storeLat, storeLng])
            .addTo(map)
            .bindPopup("Pil Oh Poil")

            .openPopup();
    });

    // Fonction déclenchée lorsque l'utilisateur clique sur le bouton
    function getItinerary() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // S'il existe déjà un contrôle de routage, on le retire pour éviter d'en empiler plusieurs
                    if (window.routingControl) {
                        map.removeControl(window.routingControl);
                    }

                    // Créer et ajouter le contrôle de routage
                    window.routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(userLat, userLng),
                            L.latLng(storeLat, storeLng),
                        ],
                        routeWhileDragging: false,
                        showAlternatives: false,
                        language: "fr",
                    }).addTo(map);
                },
                (error) => {
                    console.error("Erreur lors de la géolocalisation:", error);
                    alert(
                        "Impossible de récupérer votre position. Utilisation des coordonnées de la gare de calais."
                    );
                    // Coordonnées fictives pour Paris
                    const fakeLat = 50.95293;
                    const fakeLng = 1.8510254;

                    loadFakeRoute(fakeLat, fakeLng);
                }
            );
        } else {
            alert(
                "La géolocalisation n'est pas supportée par votre navigateur. Utilisation des coordonnées fictives."
            );
            // Coordonnées fictives pour Paris
            const fakeLat = 51.9529521;
            const fakeLng = 1.8510249;

            loadFakeRoute(fakeLat, fakeLng);
        }
    }

    // Fonction pour charger un itinéraire avec des coordonnées fictives
    function loadFakeRoute(fakeLat, fakeLng) {
        if (window.routingControl) {
            map.removeControl(window.routingControl);
        }

        window.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(fakeLat, fakeLng),
                L.latLng(storeLat, storeLng),
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            language: "fr",
        }).addTo(map);
    }
</script>

<div class="container">
    <h2>Où nous trouver</h2>
    <div class="text-section">
        <div class="content">
            <p>à Calais<br />
                62100
            </p>
            <p>93 Bd la Fayette
                <br /><br />
                Téléphone: 03 21 99 00 00<br />
                Email: contact@pilohpoil.fr
            </p>

            <h3>Horaires d'ouverture</h3>
            <p>
                Lundi - Vendredi: 9h - 19h<br />
                Samedi: 10h - 18h<br />
                Dimanche: Fermé
            </p>
        </div>
        <img src={shopstreet} alt="shopstreet" class="shopstreet" />
    </div>
    <div class="map-section">
        <div id="map" />
        <!-- Bouton pour activer l'itinéraire -->
        <button on:click={getItinerary}>Obtenir l'itinéraire</button>
    </div>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        width: 99%;
        margin-top: 20px;
        height: 100%;
        border: 1px solid var(--color-secondary);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        margin-top: 50px;
        padding-top: 20px;
    }
    h2 {
        position: absolute;
        top: -50%;
        left: 0;
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
        color: var(--color-secondary);
        font-family: Lavishly Yours;
        color: #fff;
        font-size: clamp(3rem, 14vw, 10rem);
        filter: drop-shadow(10px -8px 2px rgba(0, 0, 0, 0.5));
        z-index: 3;
    }

    .map-section {
        position: relative;
        padding: 20px;
        height: 80vh;
    }

    #map {
        width: 440px;
        height: 450px;
        border-radius: 10px;
    }
    button {
        position: absolute;
        bottom: 15px;
        left: 25px;
        background-color: white;
        color: var(--color-primary);
        padding: 10px 20px;
        border: 1px solid var(--color-secondary);
        border-radius: 5px;
        z-index: 1000;
    }

    .text-section {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        padding: 18px;
        background-color: var(--color-secondary);
        color: white;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        height: 81vh;
    }
    .shopstreet {
        width: 50%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        border: 3px solid var(--color-primary);
    }

    .content {
        width: 45%;
        padding: 10px;
    }

   

    h3 {
        font-family: "Playfair Display", serif;
        font-size: 2rem;
        margin: 20px 0;
    }

    p {
        font-family: "Playfair Display", serif;
        font-size: 1.5rem;
        line-height: 1.3;
    }

    @media (max-width: 490px) {
        .container {
            flex-direction: column;
            justify-self: start;
            align-items: center;
            height: auto;
        }
        .text-section {
            width: 90%;
        }

        .map-section {
            width: 90%;
            height: 400px;
        }
        #map {
            padding: 0;
            width: 100%;
            height: 300px;
        }
    }
</style>
