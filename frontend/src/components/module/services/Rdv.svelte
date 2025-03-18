<script>
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { writable, get } from "svelte/store";
    import { utilisateurConnecte } from "../../../stores/sessionStore";

    let title = "Rendez-vous :";
    let currentWeek = writable([]);
    let selectedDay = writable(null);
    let selectedTimeSlots = writable([]); // Tableau pour plusieurs créneaux
    let weekOffset = writable(0); // Décalage de semaines (+1 pour semaine suivante)

    const joursFermes = [0, 3]; // Fermé le mercredi et dimanche

    onMount(() => {
        generateWeek();
    });

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

    function bookAppointment() {
        utilisateurConnecte.subscribe(user => {
            if (user && get(selectedDay) && get(selectedTimeSlots).length > 0) {
                const appointments = get(selectedTimeSlots).map(timeSlot => ({
                    userId: user.id,
                    day: get(selectedDay).toISOString().split("T")[0], // Format YYYY-MM-DD
                    timeSlot
                }));

                console.log("Rendez-vous enregistrés :", appointments);
                selectedDay.set(null);
                selectedTimeSlots.set([]);

                alert("Rendez-vous pris avec succès !");
            } else {
                alert("Veuillez sélectionner un jour et au moins un créneau horaire.");
            }
        });
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
                <h2>{$selectedDay.toLocaleDateString("fr-FR", { weekday: 'long', day: '2-digit', month: '2-digit' })}</h2>
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
