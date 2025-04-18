<script>
    import axios from "axios";
    import {
        setUserAppointment,
        userInfo,
        messageStatus,
    } from "../../../../../stores/gestionRdv";
    import { onMount } from "svelte";
    $setUserAppointment;
    $userInfo;
    $messageStatus;
    let csrfToken;
    console.log("rdvdisplay", $setUserAppointment);
    console.log("rdvdisplay", $setUserAppointment.id);
    console.log("rdv", $setUserAppointment);

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

    const deleteRdv = async () => {
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
            fetchAppointments();
        } catch (error) {
            console.error(
                "Erreur lors de la suppression du rendez-vous:",
                error
            );
            messageStatus.set("Erreur lors de la suppression du rendez-vous.");
        }
    };
</script>

<main>
    {#if $messageStatus !== null}
        <div class="messageStatus">
            <p>{$messageStatus}</p>
        </div>
    {/if}
    <div class="contentTitle">
        <h2>📥réservation clients📥</h2>
    </div>
    <div class="rdv">
        <div class="rdvContent">
            {#if $setUserAppointment !== null}
                <div class="rdvContent-info">
                    <p>id : {$setUserAppointment.id}</p>
                    <p>
                        nom : {$userInfo.firstName} prenom : {$userInfo.lastName}
                    </p>
                    <p>heure : {$setUserAppointment.timeSlot}</p>
                    <p>date : {$setUserAppointment.day}</p>
                    <p>tel : {$userInfo.telephone}</p>
                    <div class="btn-divDelete">
                    <button class="btn-delete"  on:click={deleteRdv}
                            >supprimer</button
                        >
                    </div>
                </div>
            {:else}
                <p>pas de rendez vous charger</p>
            {/if}
        </div>
    </div>
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 90%;
        margin: 0 auto;
        margin-top: 2rem;
    }

    .rdv {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 90%;
        /* margin-bottom: 10rem; */
        background-color: #43688a;
        /* margin-top: 1rem; */
        padding: 1rem;
    }
    .rdvContent {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 90%;
        background-color: #BFD7EF;
        padding: 0.5rem;
        width: 100%;
        height: 100%;
    }
    .contentTitle {
        justify-content: center;
        width: 90%;
        padding: 0.5rem;
        background-color: #43688a;
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
    }
    .btn-delete {
        background-color: #43688a;
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        margin-top: 1rem;
    }
    .btn-delete:hover {
        background-color: red;
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
</style>
