<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import axios from 'axios';

    let events = writable([]);
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let daysInMonth = [];

    onMount(async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/all/appointments');
            events.set(response.data);
            generateCalendar(currentMonth, currentYear);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements:', error);
        }
    });

    function generateCalendar(month, year) {
        const date = new Date(year, month + 1, 0);
        const totalDays = date.getDate();
        daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
    }
</script>

<h1>Rdv</h1>

<div class="calendar">
    {#each daysInMonth as day}
        <div class="day">{day}</div>
    {/each}
</div>

<style>
    .fc {
        max-width: 900px;
        margin: 0 auto;
    }
    .calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
    }
    .day {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: center;
    }
</style>