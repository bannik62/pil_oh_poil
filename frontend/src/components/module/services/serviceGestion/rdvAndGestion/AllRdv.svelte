<script>
    import { onMount } from "svelte";
    import { writable, get } from "svelte/store";
    import axios from "axios";
    import {allAppointments, setUserAppointment, userInfo, messageStatus} from "../../../../../stores/gestionRdv";

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let daysInMonth = [];
    let csrfToken;
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    onMount(async () => {
        const res = await fetch("http://localhost:3000/csrf-token", {
            credentials: "include",
        });
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.info( "Formulaire de delete Message sécurisé avec token csrfToken ", csrfToken);
        await fetchAppointments();
        generateCalendar(currentMonth, currentYear);
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
            // console.log("📥 RDV récupérés:", res.data);
        } catch (err) {
            console.error("❌ Erreur RDV:", err);
        }
        
    }

    function generateCalendar(month, year) {
        const firstOfMonth = new Date(year, month, 1);
        const firstDay = (firstOfMonth.getDay() + 6) % 7; // Lundi = 0
        const totalDays = new Date(year, month + 1, 0).getDate();
        const padded = Array.from({ length: firstDay }, () => null);
        const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);

        daysInMonth = [...padded, ...monthDays];

        console.log("📅 Mois:", month + 1, "Année:", year);
        console.log("🗓️ Jours affichés:", daysInMonth);
    }

    function prevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    }

    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    }

    function isPast(day) {
        if (!day) return false;
        const d = new Date(currentYear, currentMonth, day);
        d.setHours(12, 0, 0, 0);
        return d < today;
    }

    function getAppointmentsForDay(day) {
        if (!day) return [];
        const fullDate = new Date(currentYear, currentMonth, day); // Date avec heure à 00:00
        fullDate.setHours(12, 0, 0, 0);

        const all = get(allAppointments);

        const filtered = all.filter((e) => {
            // Utilisation de e.day (qui est au format 'YYYY-MM-DD') pour comparer les dates
            const rdvDate = new Date(e.day); // Crée un objet Date à partir du format 'YYYY-MM-DD'
            rdvDate.setHours(12, 0, 0, 0); // Définir l'heure pour une comparaison précise
            return rdvDate.getTime() === fullDate.getTime(); // Comparer les timestamps
        });

        if (filtered.length > 0) {
            console.log(
                `📌 ${day}/${currentMonth + 1}/${currentYear} →`,
                filtered
            );
        }

        return filtered;
    }

    async function watchUserAppointment(e, rdv) {
        e.preventDefault();

        setUserAppointment.set(rdv);
        getUserById(rdv.userId,csrfToken);
       
        // console.log("setonerdvElemensetall", $setUserAppointment);
    }

    async function getUserById(id,csrfToken){
        console.log('Cookies dans getUserById:', document.cookie);
        const res = await fetch(`http://localhost:3000/users/api/admin/infos/getUserById/${id}`,
                {
                    credentials: "include",
                    headers: {
                        'CSRF-Token':csrfToken
                    },
                }
        );
        const data = await res.json();
        userInfo.set(data.user);
        console.log("userinfordv", data);
        messageStatus.set(data.message);
    }
</script>

<!-- <h1>Calendrier des Rendez-vous</h1> -->
<main>
    {#if $messageStatus}
        <div class="messageStatus">
            <p>{$messageStatus}</p>
        </div>
    {/if}
    <div class="nav">
        <button class="nav-button-left" on:click={prevMonth}
            >⬅️ Mois précédent</button
        >
        <div class="month">
            {currentYear} - {String(currentMonth + 1).padStart(2, "0")}
        </div>
        <button class="nav-button-right" on:click={nextMonth}>
            Mois suivant ➡️</button
        >
    </div>

    <div class="dayname-container">
        <div class="dayname">Lun</div>
        <div class="dayname">Mar</div>
        <div class="dayname">Mer</div>
        <div class="dayname">Jeu</div>
        <div class="dayname">Ven</div>
        <div class="dayname">Sam</div>
        <div class="dayname">Dim</div>
    </div>
    <div class="calendar">
        {#each daysInMonth as day}
            {#if day}
                <div class:past={isPast(day)} class="day">
                    <div class="day-number">{day}</div>

                    {#each getAppointmentsForDay(day) as rdv}
                        {#if rdv}
                            <div
                                type="button"
                                role="button"
                                class="rdv"
                                on:click={(e) => watchUserAppointment(e, rdv)}
                            >
                                {console.log(rdv)}
                                <span class="rdv-valide-icon"><p>❌</p></span>
                                <span class="rdv-info"><p>rdv</p></span>
                            </div>
                            <!-- <button on:click={() => deleteAppointment(rdv.id)}>Supprimer</button> -->
                        {/if}
                    {/each}
                </div>
            {:else}
                <div class="empty" />
            {/if}
        {/each}
    </div>
</main>

<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    main {
        position: absolute;
        height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        -webkit-overflow-scrolling: touch;
        border-radius: 10px;
    }
    main::-webkit-scrollbar {
        display: none;
    }
    .dayname-container {
        display: flex;
        justify-content: space-between;
        margin: 1rem auto;
        background-color: #43688A;
        width: 100%;
        padding: 10px;
        border-radius: 10px 10px 0 0;
        position: sticky;
        top: 60px;
        z-index: 100;
    }
    .nav {
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 1rem auto;
        width: 100%;
        padding: 10px;
        background-color: #43688A;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        border-radius: 10px;
    }
    .nav-button-left {
        background-color: #bfd7ef;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px 0 0 5px;
    }
    .nav-button-right {
        background-color: #bfd7ef;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 0 5px 5px 0;
    }
    .month {
        font-weight: bold;
        font-size: 1.2rem;
    }

    .calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 3fr);
        gap: 6px;
        width: 100%;
        /* max-width: 700px; */
        /* margin: 0 auto; */
    }

    .dayname {
        font-weight: bold;
        text-align: center;
    }

    .day {
        border: 1px solid #ccc;
        background-color: green;
        padding: px;
        text-align: left;
        border-radius: 6px;
        min-height: 70px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .empty {
        padding: 8px;
        text-align: left;
        border-radius: 6px;
        min-height: 70px;
        position: relative;
        background-color: rgba(0, 0, 0, 0.355);
    }
    .day-number {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .day.past {
        background-color: #889;
        color: #999;
        height: auto;
    }
    .day.past::after {
        content: "past";
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgb(100, 96, 96);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rdv {
        font-size: 0.8rem;
        background: #def;
        padding: 10px;
        margin-bottom: 2px;
        border-radius: 4px;
        color: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        font-size: 1.2rem;
    }
    .rdv:hover {
        background-color: #bfd7ef;
        cursor: pointer;
    }
    button {
        background-color: #e63d05;
        color: white;
        border: none;
        padding: 5px 10px;
    }
</style>
