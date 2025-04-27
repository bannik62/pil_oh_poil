<script>
    import axios from "axios";
    import Presentation from "../section/Presentation.svelte";
    import Thesaloon from "../section/thesaloon.svelte";
    import Galerie from "../section/Galerie.svelte";
    import Caroussel from "../section/Caroussel.svelte";
    import SectionMap from "../section/SectionMap.svelte";
    import Footer from "../section/Footeur.svelte";
    import Gobackup from "../../module/Gobackup.svelte";
    import userClassLogin from "../../../class/UserClassLogin";
    import {
        utilisateurConnecte,
        estAuthentifie,
    } from "../../../stores/sessionStore";
    import { faceActuelle } from "../../../stores/cube";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    onMount(async () => {});

    const user = new userClassLogin();
    const email = writable("");
    const password = writable("");
    const csrfToken = writable("");
    const isMaintenanceActive = writable(false);
    const messageStatus = writable("");

    const loginAdmin = async () => {
    if ($email && $password) {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/system/loginMaintenance",
                {
                    email: $email,
                    password: $password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.token) {
                const decodedPayload = decoderTokenManuellement(response.data.token);
                utilisateurConnecte.set(decodedPayload);
                estAuthentifie.set(true);

                // 🔄 1. Récupérer l’état de maintenance actuel
                const maintenanceRes = await axios.get(
                    "http://localhost:3000/api/system/maintenance-status",
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                
                const currentStatus = maintenanceRes.data.isActive;

                // 🔁 2. Inverser l’état
                const newStatus = !currentStatus;

                await axios.put(
                    "http://localhost:3000/api/system/maintenance-set",
                    { isActive: newStatus },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                // ✅ 3. Mettre à jour les stores
                isMaintenanceActive.set(newStatus);
                messageStatus.set(`Maintenance ${newStatus ? "activée" : "désactivée"}`);
                setTimeout(() => messageStatus.set(null), 3000);

                return faceActuelle;
            }

        } catch (error) {
            if (error.response?.data?.error) {
                messageStatus.set(error.response.data.error);
            } else {
                messageStatus.set("Erreur inattendue");
            }
            console.error("Erreur de connexion admin :", error);
        }
    }
};


// ⚙️ Décodeur de token
function decoderTokenManuellement(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        console.log("Données décodées:", decodedPayload);
        return decodedPayload;
    } catch (error) {
        console.error("Erreur de décodage du token:", error);
        return null;
    }
}

</script>

<div class="maintenance-mode">
    <div class="maintenance-mode">
        <h1>⚠️ Maintenance en cours⚠️</h1>

    </div>
    <div class="login-admin">
        <div>
        <div class="status-maintenance">
            <p> {$messageStatus}</p>
        </div>
    </div>
    <div>
        <span class="div-id">
            <label for="login">Login</label>
            <input type="text" placeholder="Login" bind:value={$email} />
        </span>
        <span class="div-password">
            <label for="password">Mot de passe</label>
            <input
                type="password"
                placeholder="Mot de passe"
                bind:value={$password}
            />
        </span></div>
        <div class="div-button">
            <button onclick={loginAdmin}>Connexion</button>
        </div>
    
</div>
</div>
<Presentation />
<Thesaloon />
<Galerie />
<Caroussel />
<SectionMap />
<Footer />
<Gobackup />

<style>
    .status-maintenance {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .maintenance-mode {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50vh;
        background-color: #eae5e5;
        margin: 20px;
        background-image: url("../../../assets/img/shop.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-blend-mode: color-burn;
        border-radius: 10px;
    }
    .maintenance-mode h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        background-color: #000000;
        padding: 10px;
        border-radius: 10px;
    }
    .maintenance-mode p {
        font-size: 1.5rem;
        color: #ffffff;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        background-color: #000000;
        padding: 10px;
        border-radius: 10px;
    }
    .login-admin {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 50vh;
        width: 50vw;
        margin: 0 auto;
        gap: 10px;
        background-color: #00000043;
        backdrop-filter: blur(5px);
        border-radius: 10px 10px 10px 10px;
        border-color: white;
        border-width: 3px 3px 3px 3px;
        border-style: solid;
    }
    .div-id {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        gap: 10px;
        color: #ffffff;
    }
    .div-password {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        gap: 10px;
        color: #ffffff;
    }
    .div-button {
        outline: 1px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20%;
        height: 100%;
    }
    .login-admin button {
        /* margin-top: 35px; */
        padding: 10px;
        border-radius: 5px;
        border: none;
        background: var(--gradient-navbar);
    }
    .login-admin button:hover {
        transform: scale(1);
        transition: all 0.3s ease;
        padding-inline: 20px;
        background: var(--gradient-module);
    }
</style>
