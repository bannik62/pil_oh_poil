const express = require('express');
const { Appointment, User } = require('../../../models/appointment.cjs'); // Assure-toi que le modèle est bien importé

const router = express.Router();

// Obtenir tous les rendez-vous (avec utilisateur associé)
router.get('/get/:userId', async (req, res) => {
    try {
        console.log('userId :', req.params);
        const { userId } = req.params; // Récupération de l'ID utilisateur depuis l'URL

        const appointments = await Appointment.findAll({
            where: { userId }, // Filtrer par utilisateur

        });
        console.log('appointments!!!!! :', appointments);

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous.' });
    }
});

// Créer un rendez-vous
router.post('/:userId', async (req, res) => {
    try {
        console.log('userId :', req.params);
        console.log('req.body :', req.body);
        const { userId } = req.params; // Récupération de l'ID utilisateur depuis l'URL
        const { day, timeSlot } = req.body;

        // Vérifie si le créneau est déjà pris
        const exists = await Appointment.findOne({ where: { day, timeSlot } });
        if (exists) {
            return res.status(400).json({ error: 'Ce créneau est déjà réservé.' });
        }

        // Création du rendez-vous
        const appointment = await Appointment.create({ userId, day, timeSlot });
        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du rendez-vous.' });
    }
});

// Supprimer un rendez-vous
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await Appointment.destroy({ where: { userId } });
        res.json({ message: 'Rendez-vous supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du rendez-vous.' });
    }
});

module.exports = router;
