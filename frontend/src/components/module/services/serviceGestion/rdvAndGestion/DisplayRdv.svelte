<script>
    import axios from "axios";
    import {
        setUserAppointment,
        userInfo,
        messageStatus,
        allAppointments
    } from "../../../../../stores/gestionRdv";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    $setUserAppointment;
    $userInfo;
    $messageStatus;
    $allAppointments;
    let csrfToken;
    // console.log("rdvdisplay", $setUserAppointment);
    // console.log("rdvdisplay", $setUserAppointment.id);
    // console.log("rdv", $setUserAppointment);

    onMount(async () => {
        $setUserAppointment = null;
        const res = await fetch("http://localhost:3000/csrf-token", {
            credentials: "include",
        });
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.info(
            "Formulaire de delete Gestion Rdv sécurisé avec token csrfToken ",
            csrfToken
        );
    });
    async function fetchAppointments() {
        try {
            const res = await axios.get(
                "http://localhost:3000/users/api/admin/rdv/all/appointments",
                {
                    withCredentials: true,
                    headers: {
                        'CSRF-Token':csrfToken
                    },
                }
            );
            allAppointments.set(res.data);
            console.log("📥 RDV récupérés dans displayRdv:", res.data);
        } catch (err) {
            console.error("❌ Erreur RDV:", err);
        }
        
    }

    async function deleteRdv() {
        console.log("csrfTokeninDeleteRdv", csrfToken);
        try {
            const res = await axios.delete(
                `http://localhost:3000/users/api/admin/rdvuser/delete/${$setUserAppointment.id}`,
                {
                    withCredentials: true,
                    headers: {
                        "CSRF-Token": csrfToken,
                    },
                }
            );
            messageStatus.set(res.data.message);
            console.log(res.data);
            $setUserAppointment = null;
             await fetchAppointments();
        } catch (error) {
            console.error(
                "Erreur lors de la suppression du rendez-vous:",
                error
            );
            messageStatus.set("Erreur lors de la suppression du rendez-vous.");
        }
    };
</script>

<main transition:fade>
    {#if $messageStatus !== null}
        <div class="messageStatus">
            <p>{$messageStatus}</p>
        </div>
    {/if}
    <div class="contentTitle">
        <h2>📥réservation clients📥</h2>
    </div>
    <div class="rdv" transition:fade>
        <div class="rdvContent">
            {#if $setUserAppointment !== null}
            <div class="rdvContentUser-Title">
                <p>id : {$setUserAppointment.id}</p>
            </div>
                <div class="rdvContent-info">
                    <p>
                        nom : {$userInfo.firstName} <br> prenom : {$userInfo.lastName}
                    </p>
                    <line></line>
                    <p>heure : {$setUserAppointment.timeSlot}</p>
                    <p>date : {$setUserAppointment.day}</p>
                    <p>tel : {$userInfo.telephone}</p>
                 
                    <div class="btn-divDelete">
                        <button class="btn-delete"  
                        on:click={deleteRdv}>
                        supprimer
                        </button>
                    </div>
                </div>
            {:else}
                <p>pas de rendez vous charger</p>
            {/if}
        </div>
    </div>
</main>

<style>
    line {
        width: 55%;
        height: 3px;
        background-color: #fafafa;
        
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    main {
        position: relative;
        transition: fade 0.5s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* justify-content: center; */
        height: 100%;
        width: 90%;
        margin: 0 auto;
        margin-top: 2rem;
        z-index: 1000;
        background-color: #7dc4db3a;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    .messageStatus {
        position: absolute;
        top: -100px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        background-color: #43688a;
        padding: 1rem;
        border-radius: 10px 10px 0px 0px;
    }

    .rdv {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        max-height: 400px;
        width: 90%;
        /* margin-bottom: 10rem; */
        background-color: #43688a;
        /* margin-top: 1rem; */
        padding: 0.5rem;
        border-radius: 0px 0px 10px 10px;
        border: 1px solid #43688a;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .rdv::-webkit-scrollbar {
        display: none;
    }
    .rdvContentUser-Title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: max-content;
        min-height: 50px;
        background-color: #43688a;
        padding: 0.5rem;
        border-bottom: 5px solid #BFD7EF;
    }
    .rdvContent {
        display: flex;
        align-items: center;
        /* justify-content: center; */
        flex-direction: column;
        width: 90%;
        background-color: #BFD7EF;
        padding: 0.5rem;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        border: 1px solid #43688a;
    }
    .rdvContent-info {
        display: flex;
        /* align-items: center; */
        /* justify-content: center; */
        flex-direction: column;
        width: 100%;
        height: 100%;
        /* min-height: 400px; */
        background-color: #43688a;
        padding: 1rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .rdvContent-info::-webkit-scrollbar {
        display: none;
    }
    .rdvContent-info p {
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        text-transform: uppercase;
        text-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

    }
    .contentTitle {
        justify-content: center;
        width: 100%;
        padding: 0.5rem;
        background-color: #43688a;
        border-radius: 10px 10px 10px 10px;
        margin-bottom: 3px;
    }
    h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        background-color: #BFD7EF;
        font-weight: 600;
        letter-spacing: 1px;
        color: white;
        /* background-color: #BFD7EF; */
        padding: 0.5rem;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        text-decoration: underline;
        text-underline-offset: 10px;
        border-radius: 10px 10px 10px 10px;
    }
    .btn-divDelete {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
    }
    .btn-delete {
        background-color: #BFD7EF;
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        margin-top: 2rem;
        align-self: flex-end;
    }
    .btn-delete:hover {
        background-color: red;
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
</style>
