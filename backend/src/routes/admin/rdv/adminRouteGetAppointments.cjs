import { Router } from 'express';
import { Appointment } from '../../../models/appointment';

const router = Router();

router.get('/all/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous.' });
    }
});

export default router;