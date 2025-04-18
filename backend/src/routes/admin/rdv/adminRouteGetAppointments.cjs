const express = require('express');
const router = express.Router();
const { Appointment } = require('../../../../models/appointment.cjs');
const { verifyCookieToken } = require('../../../middleware/verifyCookieToken.cjs');

router.get('/all/appointments', verifyCookieToken, async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous.' });
    }
});

router.delete('/delete/:id', verifyCookieToken, async (req, res) => {
    const { id } = req.params;
    console.log('headers', req.headers);
    try {
        const deletedCount = await Appointment.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Rendez-vous non trouvé.' });
        }
        res.json({ message: 'Rendez-vous supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du rendez-vous:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du rendez-vous.' });
    }
});

module.exports = router;
