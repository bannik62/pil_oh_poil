const express = require('express');
const router = express.Router();
const { UserProfile } = require('../../../models/userprofile.cjs'); // Modèle Sequelize User

// Route pour mettre à jour un utilisateur
router.patch('/patch/:userId', async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const userId = req.params.userId;
        const { csrfToken, ...updatedFields } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'ID utilisateur manquant' });
        }

        // Recherche de l'utilisateur
        let user = await UserProfile.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Filtrer les champs vides dans updatedFields
        const filteredFields = Object.fromEntries(
            Object.entries(updatedFields).filter(([_, value]) => value !== '')
        );

        console.log('Champs après filtrage :', filteredFields);

        // Mise à jour uniquement des champs non vides
        if (Object.keys(filteredFields).length > 0) {
            await user.update(filteredFields);
            res.json({ message: 'Mise à jour réussie', updatedFields: filteredFields });
        } else {
            res.status(400).json({ message: 'Aucun champ valide à mettre à jour' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
});

module.exports = router;