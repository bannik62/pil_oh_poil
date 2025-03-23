<script>
    import axios from "axios";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { utilisateurConnecte,displayService, appointments } from "../../../stores/sessionStore";
    import { weekOffset, selectedTimeSlots, selectedDay, currentWeek, allAppointments } from "../../../stores/calendar";
    export let divInfoMail;
    // console.log("divInfoMailtyp:", typeof divInfoMail);

    let title = "Rendez-vous :";
    let joursFermes = [0, 3];

    const verifyDisponibility = ($allAppointments,selectedDay, timeSlot) => {
    // Vérifiez si 'day' est une date valide
    if (!selectedDay || !(selectedDay instanceof Date)) {
        console.error("La variable 'day' est undefined ou non valide.");
        return false;
    }

    const dayISO = selectedDay.toISOString().split("T")[0]; // Convertir la date en format YYYY-MM-DD
    
    // Vérifiez si $allAppointments est un tableau valide
    if (!Array.isArray($allAppointments)) {
        console.error("$allAppointments n'est pas un tableau valide.");
        return false;
    }

    return $allAppointments.some(appointment => {
        const appointmentDayISO = new Date(appointment.day).toISOString().split("T")[0];
        return appointmentDayISO === dayISO && appointment.timeSlot === timeSlot;
    });
};


    
    onMount(() => {
        if($displayService === "rdv" ){
            generateWeek();
            fetchAppointments($utilisateurConnecte.id);
            fetchAllAppointments();
            // verifyDisponibility($selectedDay, allTimeSlots);
        }
    });

    async function fetchAllAppointments() {
        const response = await axios.get(`http://localhost:3000/api/appointments/getall/all`);
        allAppointments.set(response.data);
    }

     
    async function fetchAppointments(userId) {
        console.log("userId :", userId);
        try {
            const response = await axios.get(`http://localhost:3000/api/appointments/get/${userId}`);
            console.log("response :", response.data);
            let appoint = response.data;
            appointments.set(appoint);
            // Vérifie si le tableau contient au moins un rendez-vous
            if (appoint.length > 0) { 
                // Réinitialise le tableau pour éviter les doublons
                divInfoMail.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Jour</th>
                                <th>Créneau Horaire</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                `;

                // Sélectionne le tbody
                    let tbody = divInfoMail.querySelector("tbody");



                appoint.forEach(element => {
                    let tr = document.createElement("tr");
                    tr.style.backgroundColor = "rgb(132, 189, 239)";
                    tr.style.padding = "1rem";

                    let tdDay = document.createElement("td");
                    tdDay.textContent = element.day;
                    tdDay.style.backgroundColor = "rgb(132, 189, 239)";
                    tdDay.style.paddingInline = "0.5rem";
                    tdDay.style.borderRadius = "0.5rem 0 0 0.5rem";
                    let tdTimeSlot = document.createElement("td");
                    tdTimeSlot.textContent = element.timeSlot;
                   

                    let tdAction = document.createElement("td");
                    tdAction.style.backgroundColor = "rgb(132, 189, 239)";
                    tdAction.style.border = "1px solid red";
                    tdAction.style.backgroundColor = "red";
                    // tdAction.style.paddingInline = "0.1rem";
                    tdAction.style.borderRadius = "0 0.5rem 0.5rem 0";
                    // tdAction.style.display = "flex";
                    // tdAction.style.justifyContent = "center";
                    // tdAction.style.alignItems = "center";
                    tdAction.style.height = "40px";

                    let btnDel = document.createElement("button");
                    btnDel.textContent = "Supprimer";
                    btnDel.style.backgroundColor = "red";
                    btnDel.style.color = "white";
                    btnDel.style.border = "none";
                    btnDel.style.borderRadius = "5px";
                    btnDel.style.cursor = "pointer";
 
                    // Ajoute un event listener spécifique à chaque bouton
                    btnDel.addEventListener("click", () => {
                        console.log("element.id :", element.id);
                        deleteAppointment(element.id); // Passe l'ID du rendez-vous ici
                    });

                    tr.appendChild(tdDay);
                    tr.appendChild(tdTimeSlot);
                    tr.appendChild(tdAction);
                    tdAction.appendChild(btnDel);

                    // Ajoute la ligne dans le tableau
                    tbody.appendChild(tr);
                });

                return response.data;
            } else {
                divInfoMail.innerHTML = `
                    <p>Aucun rendez-vous trouvé.</p>
                `;
                console.log("Aucun rendez-vous trouvé.");
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
            throw error;
        }
    }

    async function createAppointment(utilisateurConnecteId) {
        const user = $utilisateurConnecte; // Utilisez $ pour accéder à l'utilisateur connecté
        console.log("userutil :", user);
        // Vérifiez si l'utilisateur est connecté et si un jour et des créneaux horaires sont sélectionnés
        if (user && get(selectedDay) && get(selectedTimeSlots).length > 0) {
            const day = get(selectedDay).toISOString().split("T")[0]; // Format YYYY-MM-DD
            const appointments = get(selectedTimeSlots).map(timeSlot => ({ userId: user.id, day, timeSlot }));

            try {
                // Envoi des rendez-vous avec Axios
                await Promise.all(appointments.map(async (appointment) => {
                    const response = await axios.post(`http://localhost:3000/api/appointments/${user.id}`, {
                        day: appointment.day,
                        timeSlot: appointment.timeSlot
                    });
                    return response.data;
                }));

                alert("Rendez-vous pris avec succès !");
                selectedDay.set(null);
                selectedTimeSlots.set([]);
                setTimeout(() => {
                    fetchAllAppointments();
                    fetchAppointments(user.id);
                }, 1000);
            } catch (error) {
                console.error("Erreur lors de la réservation :", error);
                alert("Erreur : " + (error.response?.data?.error || "Une erreur s'est produite"));
            }
        } else {
            // Affiche un message d'erreur si les conditions ne sont pas remplies
            alert("Veuillez sélectionner un jour et au moins un créneau horaire.");
        }
    }

    async function deleteAppointment(appointmentId) {
        alert("Suppression du rendez-vous en cours...");
        try {
            const response = await axios.delete(`http://localhost:3000/api/appointments/${appointmentId}`);
            setTimeout(() => {  
                fetchAllAppointments();
                verifyDisponibility($allAppointments, $selectedDay, timeSlot);
                fetchAppointments(get(utilisateurConnecte).id);
            }, 1000);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            throw error;
        }
    }


    let unavailableSlots = {}; // Stocker les créneaux horaires indisponibles pour chaque jour

function generateWeek() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (get(weekOffset) * 7));

    const week = [];
    unavailableSlots = {}; // Réinitialiser l'objet

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        if (!joursFermes.includes(day.getDay())) {
            week.push(day);
            // Vérifier les créneaux horaires indisponibles pour ce jour
            unavailableSlots[day.toISOString().split("T")[0]] = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"]
                .filter(timeSlot => verifyDisponibility($allAppointments, day, timeSlot));
        }
    }

    currentWeek.set(week);

    if (week.some(d => d.getTime() === today.getTime())) {
        selectedDay.set(today);
        console.log("selectedDay :", $selectedDay);
    } else {
        selectedDay.set(null);
    }
}

    function changeWeek(offset) {
        weekOffset.update(n => n + offset);
        generateWeek();
    }

    function selectDay(day) {
        selectedDay.set(day);
        selectedTimeSlots.set([]); // Réinitialiser les créneaux sélectionnés
    }

    function toggleTimeSlot(timeSlot) {
        selectedTimeSlots.update(slots => {
            if (slots.includes(timeSlot)) {
                return slots.filter(slot => slot !== timeSlot); // Retirer si déjà sélectionné
            } else {
                return [...slots, timeSlot]; // Ajouter sinon
            }
        });
    }

    async function bookAppointment() {
        createAppointment(get(utilisateurConnecte).id);
    }
</script>

<div class="rdv-container" transition:fade>

    <div class="rdv-choice">
        <h2>{title}</h2>
        {#if $selectedDay}
            <p class="rdv-choice-text">
                {$selectedDay.toLocaleDateString("fr-FR", { weekday: 'long', day: '2-digit', month: '2-digit' })}
                {#if $selectedTimeSlots.length > 0} à
                    {#each $selectedTimeSlots as slot, i}
                        {slot}  {#if i < $selectedTimeSlots.length - 1}, {/if}
                    {/each}
                {/if}
            </p> 
        <br>
        {/if}
    </div>
    
    <div class="calendar-container">
        <div class="week-nav">
            <button on:click={() => changeWeek(-1)} disabled={$weekOffset === 0}>◀ Semaine précédente</button>
            <button on:click={() => changeWeek(1)}>Semaine suivante ▶</button>
        </div>

        <div class="week-container">
            {#each $currentWeek as day}
                <button class="day" on:click={() => selectDay(day)}
                    class:active={$selectedDay && $selectedDay.toDateString() === day.toDateString()}>
                    {day.toLocaleDateString("fr-FR", { weekday: 'long', day: '2-digit', month: '2-digit' })}
                </button>
            {/each}
        </div>

        {#if $selectedDay}
        <div class="time-slots">
            <h3>{$selectedDay.toLocaleDateString("fr-FR", { weekday: 'long', day: '2-digit', month: '2-digit' })}</h3>
            {#each ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"] as timeSlot}
                <button
                    class="time-slot"
                    on:click={() => toggleTimeSlot(timeSlot)}
                    class:active={$selectedTimeSlots.includes(timeSlot)}
                    disabled={unavailableSlots[$selectedDay.toISOString().split("T")[0]]?.includes(timeSlot)}
                >
                    {timeSlot}
                    {#if unavailableSlots[$selectedDay.toISOString().split("T")[0]]?.includes(timeSlot)}
                        <span class="disponibility-badge">Indisponible</span>
                    {:else}
                        <span class="disponibility-badge">Disponible</span>
                    {/if}
                </button>
            {/each}
        </div>
            <button class="confirm-button" on:click={bookAppointment}>Prendre rendez-vous</button>
        {/if}
    </div>
</div>

<style>
    
    .rdv-container {
        overflow: auto;
        width: 100%;
        height: 100%;
        margin: auto;
        background-color: rgb(91, 146, 193);
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .rdv-choice {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        padding: 1rem;
        background-color: rgb(132, 189, 239);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .rdv-choice-text {
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        width: 60%;
        height: 30%;
        max-height: 70px;
        overflow-y: auto;
        padding: 1rem;
        text-align: center;
        border-radius: 8px;
        background-color: rgb(92, 162, 223);
        border: 1px solid rgb(132, 189, 239);
    }

    h2 {
        text-align: center;
        color: white;
        text-decoration: underline;
        text-underline-offset: 0.5rem;
    }
    h3 {
        text-align: center;
        color: rgb(24, 22, 22);
        text-decoration: underline;
        text-underline-offset: 0.5rem;
    }
    .calendar-container {
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        text-align: center; 
        overflow: hidden;
    }

    .week-nav {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .week-nav button {
        background: #007BFF;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .week-nav button:disabled {
        background: gray;
        cursor: not-allowed;
    }

    .week-container {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
    }

    .day {
        background: lightgray;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .day.active {
        background: #007BFF;
        color: white;
    }

    .time-slots {
        margin-top: 10px;
    }

    .time-slot {
        display: block;
        width: 100%;
        margin: 5px 0;
        padding: 8px;
        background: lightblue;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .time-slot.active {
        background: #0056b3;
        color: white;
    }

    .confirm-button {
        margin-top: 10px;
        width: 100%;
        padding: 10px;
        background: green;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>
