<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { faceActuelle } from "../../../../../stores/cube";
    import { systemInfo } from "../../../../../stores/advanced";
    import { navbarState } from "../../../../../stores/navigation";
    import { utilisateurConnecte, estAuthentifie } from "../../../../../stores/sessionStore";

    let diskData = [];
    let maintenanceMode = false;
    
    onMount(() => {
        // if ($faceActuelle === "back") {
            getDiskUsage();
            getMaintenanceMode();
        // }
    });

    async function getDiskUsage() {
        try {
            const response = await axios.get(
                "http://localhost:3000/users/api/admin/advanced-parameter/disk-usage/get/system-info",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            systemInfo.set(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Erreur de récupération :", error);
        }
    }
    function describeArcDisk(cx, cy, r, start, end) {
        const startAngle = start * 2 * Math.PI;
        const endAngle = end * 2 * Math.PI;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = end - start > 0.5 ? 1 : 0;

        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }


    $: diskData = $systemInfo?.disk ?? [];

    $: totalUsed = diskData.reduce((sum, disk) => sum + disk.used, 0);

    $: chartSegments = (() => {
        let cumulative = 0;
        return diskData.map((disk, index) => {
            const percentage = disk.used / totalUsed;
            const startAngle = cumulative;
            const endAngle = cumulative + percentage;
            cumulative = endAngle;

            return {
                label: disk.filesystem,
                percentage,
                startAngle,
                endAngle,
                color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#BA68C8"][
                    index % 5
                ],
            };
        });
    })();


    $: memoryData = $systemInfo?.memory;

    $: memoryChart = memoryData
        ? [
              {
                  label: "Utilisée",
                  value: memoryData.used,
                  color: "#FF6384",
              },
              {
                  label: "Disponible",
                  value: memoryData.available,
                  color: "#36A2EB",
              },
              {
                  label: "Swap",
                  value: memoryData.swapUsed,
                  color: "#FFCE56",
              },
          ]
        : [];

    $: memoryTotal = memoryChart.reduce((sum, m) => sum + m.value, 0);

    $: memorySegments = [];
    $: {
        if (memoryTotal > 0) {
            let cumulative = 0;
            memorySegments = memoryChart.map((m) => {
                const percentage = m.value / memoryTotal;
                const startAngle = cumulative;
                const endAngle = cumulative + percentage;
                cumulative = endAngle;

                return {
                    ...m,
                    percentage,
                    startAngle,
                    endAngle,
                };
            });
        }
    }

    async function getMaintenanceMode() {
        const response = await axios.get(
            "http://localhost:3000/api/system/maintenance-status"
        );
        console.log("maintenanceModeback", response.data);
        maintenanceMode = response.data.maintenanceMode;
    }

    async function setMaintenanceMode() {
    try {
      const response = await axios.put("http://localhost:3000/api/system/maintenance-set", {
        isActive: true
      });
      console.log("✅ État mis à jour :", response.data);
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
    }
    }

    function logout() {
    faceActuelle.set("front");
    utilisateurConnecte.set(null);
    estAuthentifie.set(false);
    // Supprimer le cookie de session
    axios.post('http://localhost:3000/api/user/auth/logout', {}, {
        withCredentials: true // Configuration correcte pour axios
    })
    .then(() => {
        estAuthentifie.set(false);
        console.log('Déconnexion réussie, cookie supprimé');
        pageActuelle.set("front");
        utilisateurConnecte.set(null);
        infosUser.set(null);
        estAuthentifie.set(false);
        isValid.set(false);
        displayService.set("messagerie");
        appointments.set([]);
        navbarState.set({ navbarIsOpen: false });


    })
    .catch(error => {
        console.error('Erreur lors de la déconnexion:', error);
    });
}
</script>

<main>
    <div class="container">
        <!-- <h1>{message}</h1> -->
         <button
            class="button-actualise"
            on:click={() => {
                console.log("actualise");
                getDiskUsage();
                getMaintenanceMode();
            }}> Actualiser
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0114.36-3.36L23 10M1 14l5.64 5.64A9 9 0 0020.49 15"></path>
            </svg>
            </button>
        
        <button
            class="button-return-bottom"
            on:click={() => {
                faceActuelle.set("bottom");
                navbarState.set({ navbarIsOpen: false});
            }}>gestion
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            </button >

        <div class="system-title">
            {#if $systemInfo}
                <h3>Systeme: {$systemInfo.system.platform}</h3>
            {/if}
        </div>
        <div class="contain-global">
            <div class="contain-left">
                <div class="system">
                    <div class="systeme-info info">
                        {#if $systemInfo}
                            <div class="title">
                                <h3>Système : {$systemInfo.system.platform}</h3>
                            </div>
                            <p>
                                Version du système : {$systemInfo.system.release}
                            </p>
                            <p>Distribution : {$systemInfo.system.distro}</p>
                            <p>Architecture : {$systemInfo.system.arch}</p>
                        {/if}
                    </div>
                </div>
                <div class="cpu-usage-info info">
                    {#if $systemInfo}
                        <div class="title">
                            <h3>CPU: {$systemInfo.cpu.brand} coeurs</h3>
                        </div>
                        <p>Nombre de coeurs : {$systemInfo.cpu.cores}</p>
                        <p>Fréquence : {$systemInfo.cpu.speed} MHz</p>
                    {/if}
                </div>
                <div class="network-usage-info 1 info">
                    {#if $systemInfo}
                        <div class="title">
                            <h3>Interface : {$systemInfo.network[0].iface}</h3>
                        </div>
                        <p>Ipv4 : {$systemInfo.network[0].ip4}</p>
                        <p>Mac : {$systemInfo.network[0].mac}</p>
                    {/if}
                </div>
                <div class="network-usage-info 2 info">
                    {#if $systemInfo}
                        <div class="title">
                            <h3>Interface : {$systemInfo.network[1].iface}</h3>
                        </div>
                        <p>Ipv4 : {$systemInfo.network[1].ip4}</p>
                        <p>Mac : {$systemInfo.network[1].mac}</p>
                    {/if}
                </div>
            </div>
            
            <div class="contain-right">
                <h3 class="h3-disk-usage-title">Disk Usage</h3>
                <div class="disk-usage-container">
                    <div class="disk-usage-circle">
                        <div class="circle">
                            <svg viewBox="0 0 200 200">
                                {#each chartSegments as segment}
                                    <path
                                        d={describeArcDisk(
                                            100,
                                            100,
                                            90,
                                            segment.startAngle,
                                            segment.endAngle
                                        )}
                                        fill={segment.color}
                                    />
                                {/each}
                            </svg>
                        </div>
                    </div>
                    <div class="legend">
                        {#each chartSegments as segment}
                            <div class="legend-item">
                                <div
                                    class="color-box"
                                    style="background-color: {segment.color}"
                                />
                                <span
                                    >{segment.label} — {(
                                        segment.percentage * 100
                                    ).toFixed(1)}%
                                </span>
                            </div>
                        {/each}
                    </div>
                    <div class="memory-usage-info">
                        <!-- faire pareil que pour le disk usage -->
                    </div>
                </div>
                <h3 class="h3-disk-usage-title">Memory Usage</h3>
                <div class="memory-usage-info">
                    {#if memorySegments.length}
                        <div class="memory-usage-container">
                            <div class="memory-usage-circle">
                                <div class="circle">
                                    <svg viewBox="0 0 200 200">
                                        {#each memorySegments as segment}
                                            <path
                                                d={describeArcDisk(
                                                    100,
                                                    100,
                                                    90,
                                                    segment.startAngle,
                                                    segment.endAngle
                                                )}
                                                fill={segment.color}
                                            />
                                        {/each}
                                    </svg>
                                </div>
                            </div>
                            <div class="legend">
                                {#each memorySegments as segment}
                                    <div class="legend-item">
                                        <div
                                            class="color-box"
                                            style="background-color: {segment.color}"
                                        />
                                        <span
                                            >{segment.label} — {(
                                                segment.percentage * 100
                                            ).toFixed(1)}%</span
                                        >
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="content-check-maintenace">
                    <h3 class="h3-disk-usage-title">Check Maintenance</h3>
                    <div class="maintenance-usage-container">
                    <span>Mettre en modeMaintenance :</span>
                    <input bind:checked={maintenanceMode} type="checkbox" id="maintenance-mode" on:change={() => {
                        console.log("maintenanceMode", maintenanceMode);
                        logout();
                        setMaintenanceMode();
                    }} />
                    <span class="maintenance-active-container">
                    {#if !maintenanceMode}
                        <p class="maintenance-inactive">Maintenance inactive</p>
                        {:else}
                        <p class="maintenance-active">Maintenance active</p>
                    {/if}
                    </span>
                    </div>
                    <div class="bddUmami">
                        <h3>Ressource</h3>
                        <div class="ressource-container">
                            <a href="http://localhost:8080" target="_blank">Ressource BDD</a>
                            <a href="http://localhost:3001" target="_blank">Ressource umami</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .button-return-bottom {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-weight: 900;
    }
    .button-actualise {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 10px;
        top: 10px;
        right: 180px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-weight: 900;
    }
    .system-title {
        position: relative;
    }
    .system-title h3 {
        top: -100px;
        left: 50%;
        transform: translate(calc(-50% - 10px), 0);
        position: absolute;
        text-decoration: underline;
        text-underline-offset: 5px;
        font-size: clamp(1.5rem, 2.5vw, 2.5rem);
        letter-spacing: 10px;
        font-weight: 900;
    }
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 20px;
        background-color: #203c4530;
    }

    .container {
        height: 100%;
        width: 100%;
        padding: 20px;
        background-color: #f0f0f040;
        border-radius: 8px;
        text-align: center;
        backdrop-filter: blur(50px);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        background-image: url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 0H0v36h36V0zM15.126 2H2v13.126c.367.094.714.24 1.032.428L15.554 3.032c-.188-.318-.334-.665-.428-1.032zM18 4.874V18H4.874c-.094-.367-.24-.714-.428-1.032L16.968 4.446c.318.188.665.334 1.032.428zM22.874 2h11.712L20 16.586V4.874c1.406-.362 2.512-1.468 2.874-2.874zm10.252 18H20v13.126c.367.094.714.24 1.032.428l12.522-12.522c-.188-.318-.334-.665-.428-1.032zM36 22.874V36H22.874c-.094-.367-.24-.714-.428-1.032l12.522-12.522c.318.188.665.334 1.032.428zm0-7.748V3.414L21.414 18h11.712c.362-1.406 1.468-2.512 2.874-2.874zm-18 18V21.414L3.414 36h11.712c.362-1.406 1.468-2.512 2.874-2.874zM4.874 20h11.712L2 34.586V22.874c1.406-.362 2.512-1.468 2.874-2.874z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    .contain-global {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        width: 100%;
        gap: 20px;
    }
    .contain-left {
        display: flex;
        justify-content: center;
        /* align-items: center; */
        height: 100%;
        width: 35%;
        background-color: rgb(171, 168, 168);
        border-radius: 8px;
        padding: 20px;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        overflow-y: auto;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) inset;

        -webkit-overflow-scrolling: touch;
    }
    .contain-left::-webkit-scrollbar {
        display: none;
    }
    .info {
        /* height: max-content; */
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        width: 200px;
        background-color: #f0f0f040;
        border-radius: 8px;
        padding: 10px;
        gap: 10px;
    }
    .info p {
        all: unset;
        font-size: 1rem;
    }
    .title {
        width: 100%;
        background-color: #f0f0f040;
        border-radius: 8px;
        padding: 15px;
    }
    .contain-right {
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        /* align-items: center; */
        background-color: rgb(171, 168, 168);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5) inset;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .contain-right::-webkit-scrollbar {
        display: none;
    }
    .h3-disk-usage-title {
        text-align: center;
        font-size: 1.5rem;
    }
    .disk-usage-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50%;
        min-height: 200px;
        width: 100%;
        background-color: #f0f0f040;
    }
    .disk-usage-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        /* height: px; */
        width: 50%;
    }
    .memory-usage-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50%;
        min-height: 200px;
        width: 100%;
        background-color: #f0f0f040;
    }
    .memory-usage-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        /* height: px; */
        width: 50%;
        /* outline: 1px solid red; */
    }

    .maintenance-usage-container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 10px;
        background-color: #f0f0f040;
        border-radius: 8px;
        padding: 10px;
    }

    .maintenance-usage-container input {
        width: 20px;
        height: 20px;
    }
    .maintenance-usage-container span {
        font-size: 1.2rem;
    }
    .maintenance-active-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 250px;
    }
    .maintenance-inactive {
        all: unset;
        font-size: 1.2rem;
        color: green;
    }
    .maintenance-active {
        all: unset;
        font-size: 1.2rem;
        color: red;
    }
    svg {
        width: 70%;
        height: 70%;
    }
    .legend {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        font-size: 1.2rem;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
    }
    .color-box {
        width: 12px;
        height: 12px;
        margin-right: 8px;
    }
    .ressource-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 10px;
        background-color: #f0f0f040;
        border-radius: 8px;
        padding: 10px;
    }
    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
