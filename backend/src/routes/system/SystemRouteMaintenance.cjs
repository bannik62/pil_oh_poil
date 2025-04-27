// maintenanceRouter.js
const express = require('express');
const router = express.Router();
const { isMaintenanceActive } = require('../../../models/ismaintenanceActive.cjs');
const { User } = require('../../../models/user.cjs');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config.json');

console.log('🚀 ~ router.get ~ isMaintenanceActive:', isMaintenanceActive);

// Route pour vérifier l'état de la maintenance
router.get('/maintenance-status', async (req, res) => {
    try {
        console.log('🚀 ~ router.get ~ req:', req);
        const maintenance = await isMaintenanceActive.findOne(
            {
                where: {
                    id: 0
                }
            }
        );
        console.log('🚀 ~ router.get ~ maintenance 1:', maintenance);
        if (!maintenance) {
            return res.status(404).json({ message: 'Aucun état de maintenance trouvé.' });
        }
        console.log('🚀 ~ router.get ~ maintenance 2:', maintenance);
        res.json({ isActive: maintenance.isActive, message: ' statusmaintenance inactive'});
    } catch (err) {

        res.status(500).json({ error: 'Erreur lors de la récupération de l\'état de maintenance.' });
    }
});

// Route pour changer l'état de la maintenance (basculer entre true/false)
router.put('/maintenance-set', async (req, res) => {
    const { isActive } = req.body; // La valeur de isActive doit être envoyée dans le corps de la requête

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: 'L\'état de maintenance doit être un booléen (true ou false).' });
    }

    try {
        const maintenance = await isMaintenanceActive.findOne();
        if (!maintenance) {
            return res.status(404).json({ message: 'Aucun état de maintenance trouvé.' });
        }

        // Mettre à jour l'état de maintenance
        maintenance.isActive = isActive;
        await maintenance.save();

        res.json({ message: `L'état de maintenance a été mis à jour en ${isActive ? 'actif' : 'inactif'}.` });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'état de maintenance.' });
    }
});
router.post('/loginMaintenance', async (req, res) => {
    try {
        console.log('Tentative de connexion admin:', req.body);
        const { email, password } = req.body;
        console.log('Tentative de connexion admin:', req.body);

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Vérifie si c'est bien un admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Vous n\'avez pas les droits pour accéder à cette section.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, isvalid: user.isvalid },
            config.development.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Token admin créé :', token);

        res.cookie('SessionCookiePilOhPoil', token, {
            httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'lax'
        });

        res.status(200).json({ message: 'Connexion admin réussie', token });
        console.log('Cookie envoyé :', res.getHeaders()['set-cookie']);

    } catch (error) {
        console.error('Erreur de connexion admin :', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
