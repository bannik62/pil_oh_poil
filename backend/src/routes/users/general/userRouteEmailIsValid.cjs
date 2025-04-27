const express = require('express');
const router = express.Router();
const { User } = require('../../../../models/user.cjs');

// Route pour vérifier si l'email de l'utilisateur est validé
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Rechercher l'utilisateur
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Retourner le statut de validation de l'email
        return res.status(200).json({
            isValid: user.isvalid // Correct !
        });

    } catch (error) {
        console.error('Erreur lors de la vérification du statut de validation:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
    }
});

module.exports = router;
