<script>
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import  Page  from './components/acceuil/page/Page.svelte';
  import  Maintenance  from './components/acceuil/page/Maintenance.svelte';
  let isMaintenanceActive = writable(false);
  let messageStatus;
  onMount(async () => {
    const response = await axios.get('http://localhost:3000/api/system/maintenance-status',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    isMaintenanceActive.set(response.data.isActive);
    messageStatus = response.data.message;
    setTimeout(() => {
      messageStatus = null;
    }, 3000);
    console.log("🚀 ~ onMount ~ maintenance response:", response.data )
    console.log("🚀 ~ onMount ~ messageStatus:", messageStatus)
  });
</script>

<main>
  {#if !$isMaintenanceActive}
    <Page />
  {:else}
  <div class="status">
    {#if messageStatus}
        <p>Maintenance {messageStatus}</p>
    {/if}
  </div>
    <Maintenance />
  {/if}
</main>

<style>
 
</style>
