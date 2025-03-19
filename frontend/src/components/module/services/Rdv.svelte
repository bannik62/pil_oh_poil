<script>
    import axios from "axios";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { writable, get } from "svelte/store";
    import { utilisateurConnecte } from "../../../stores/sessionStore";
    export let divInfoMail;
    // console.log("divInfoMailtyp:", typeof divInfoMail);

    let title = "Rendez-vous :";
    let currentWeek = writable([]);
    let selectedDay = writable(null);
    let selectedTimeSlots = writable([]); // Tableau pour plusieurs créneaux
    let weekOffset = writable(0); // Décalage de semaines (+1 pour semaine suivante)

    const joursFermes = [0, 3]; // Fermé le mercredi et dimanche

    let btnDel = document.createElement("button");
    btnDel.innerHTML = "Supprimer";
    btnDel.style.backgroundColor = "red";
    btnDel.style.color = "white";
    btnDel.style.border = "none";
    btnDel.style.padding = "5px 10px";
    btnDel.style.borderRadius = "5px";
    btnDel.style.cursor = "pointer";
    btnDel.addEventListener("click", () => {
        deleteAppointment(userId);
    });

    onMount(() => {
        generateWeek();
        fetchAppointments(get(utilisateurConnecte).id);
    });
     
    async function fetchAppointments(userId) {
    console.log("userId :", userId);
    try {
        const response = await axios.get(`http://localhost:3000/api/appointments/get/${userId}`);
        console.log("response :", response.data);
        let appoint = response.data;

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

            let tdDay = document.createElement("td");
            tdDay.textContent = element.day;

            let tdTimeSlot = document.createElement("td");
            tdTimeSlot.textContent = element.timeSlot;

            let tdAction = document.createElement("td");
            let btnDel = document.createElement("button");
            btnDel.textContent = "Supprimer";
            btnDel.style.backgroundColor = "red";
            btnDel.style.color = "white";
            btnDel.style.border = "none";
            btnDel.style.borderRadius = "5px";
            btnDel.style.cursor = "pointer";

            // Ajoute un event listener spécifique à chaque bouton
            btnDel.addEventListener("click", () => {
                deleteAppointment(userId); 
            });

            tdAction.appendChild(btnDel);
            tr.appendChild(tdDay);
            tr.appendChild(tdTimeSlot);
            tr.appendChild(tdAction);

            // Ajoute la ligne dans le tableau
            tbody.appendChild(tr);
        });

        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        throw error;
    }
}


    async function createAppointment(userId, day, timeSlot) {
        utilisateurConnecte.subscribe(async (user) => {
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
                    fetchAppointments(get(utilisateurConnecte).id);
                }, 1000);
            } catch (error) {
                console.error("Erreur lors de la réservation :", error);
                alert("Erreur : " + (error.response?.data?.error || "Une erreur s'est produite"));
            }
        } else {
            alert("Veuillez sélectionner un jour et au moins un créneau horaire.");
        }
    });
    }

    async function deleteAppointment(userId) {
        alert("Suppression du rendez-vous en cours...");
        try {
            const response = await axios.delete(`http://localhost:3000/api/appointments/${userId}`);

            setTimeout(() => {  
                fetchAppointments(get(utilisateurConnecte).id);
            }, 1000);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            throw error;
        }
    }


    function generateWeek() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + (get(weekOffset) * 7));

        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            if (!joursFermes.includes(day.getDay())) {
                week.push(day);
            }
        }

        currentWeek.set(week);

        if (week.some(d => d.getTime() === today.getTime())) {
            selectedDay.set(today);
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
        createAppointment(get(utilisateurConnecte).id, get(selectedDay), get(selectedTimeSlots));
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
                    <button class="time-slot" on:click={() => toggleTimeSlot(timeSlot)}
                        class:active={$selectedTimeSlots.includes(timeSlot)}>
                        {timeSlot}
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
        background-color: rgb(132, 189, 239);
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
