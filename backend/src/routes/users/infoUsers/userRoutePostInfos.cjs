const express = require('express');
const router = express.Router();
const { UserProfile } = require('../../../../models/userprofile.cjs');
const { User } = require('../../../../models/user.cjs');

// Route pour mettre à jour les informations de profil de l'utilisateur
router.post('/info', async (req, res) => {
    try {
        // Extraction des données envoyées par le client
        const { userId, firstName, lastName, telephone, address, dateOfBirth } = req.body;

        // Vérification de l'existence de l'utilisateur dans la table User
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérification de l'existence du profil utilisateur dans UserProfile
        let userProfile = await UserProfile.findOne({ where: { userId } });

        if (userProfile) {
            // Si le profil existe déjà, on met à jour les informations
            await userProfile.update({
                firstName,
                lastName,
                telephone,
                address,
                dateOfBirth,
                updatedAt: new Date()  // Mise à jour de la date de modification
            });
        } else {
            // Si le profil n'existe pas encore, on crée un nouvel enregistrement
            userProfile = await UserProfile.create({
                userId,  // Associe cet utilisateur avec le profil
                firstName,
                lastName,
                telephone,
                address,
                dateOfBirth
            });
        }

        // Retourner une réponse avec les données mises à jour
        res.status(200).json({
            message: 'Informations mises à jour avec succès',
            userProfile
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
