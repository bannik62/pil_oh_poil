const express = require('express');
const router = express.Router();
const { UserProfile } = require('../../../models/userprofile.cjs');

// Route pour récupérer les informations de profil de l'utilisateur
router.get('/get/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Vérification de l'existence du profil utilisateur dans UserProfile
        const userProfile = await UserProfile.findOne({ where: { userId } });

        if (!userProfile) {
            return res.status(404).json({ error: 'Profil utilisateur non trouvé' });
        }

        // Retourner les informations du profil
        res.status(200).json({
            message: 'Informations récupérées avec succès',
            userProfile
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
