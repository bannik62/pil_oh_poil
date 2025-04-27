// routes/api/systemInfo.js
const express = require('express');
const router = express.Router();
const si = require('systeminformation');

const getFullSystemStats = async () => {
    const [
        mem,
        cpu,
        currentLoad,
        disk,
        uptime,
        osInfo,
        temp,
        net,
        netStats
    ] = await Promise.all([
        si.mem(),
        si.cpu(),
        si.currentLoad(),
        si.fsSize(),
        si.time(),
        si.osInfo(),
        si.cpuTemperature(),
        si.networkInterfaces(),
        si.networkStats()
    ]);

    return {
        system: {
            manufacturer: osInfo.manufacturer,
            model: osInfo.model,
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            arch: osInfo.arch,
            hostname: osInfo.hostname,
        },
        cpu: {
            brand: cpu.brand,
            speed: cpu.speed,
            cores: cpu.cores,
            physicalCores: cpu.physicalCores,
            load: currentLoad.currentLoad.toFixed(2),
        },
        memory: {
            total: mem.total,
            used: mem.used,
            free: mem.free,
            active: mem.active,
            available: mem.available,
            swapUsed: mem.swaptotal > 0 ? mem.swapused : null,
        },
        disk: disk.map(d => ({
            filesystem: d.fs,
            type: d.type,
            size: d.size,
            used: d.used,
            use: d.use,
            mount: d.mount
        })),
        temperature: {
            main: temp.main || null,
            max: temp.max || null
        },
        network: net.map((iface, i) => ({
            iface: iface.iface,
            ip4: iface.ip4,
            mac: iface.mac,
            speed: iface.speed,
            rxBytes: netStats[i]?.rx_bytes,
            txBytes: netStats[i]?.tx_bytes
        })),
        uptime: {
            seconds: uptime.uptime,
            since: uptime.current,
        }
    };
};

router.get('/get/system-info', async (req, res) => {
    try {
        const stats = await getFullSystemStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les infos système.' });
    }
});

module.exports = router;
