const express = require('express');
const router = express.Router();
const verifyEmailTokenForValidity = require('../../../middleware/email/verifyemailTokenForValidity.cjs');
const { User } = require('../../../../models/user.cjs');
console.log('🔑 verifyEmailTokenForvalidity :', verifyEmailTokenForValidity);
console.log('🔑 User :', User);

// Route qui vérifie et valide l'email
router.get('/token', verifyEmailTokenForValidity, async (req, res) => {
    try {
        const { email } = req.user;
        console.log('🔑route Email :', email);
        // Trouver l'utilisateur
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        if (user.isvalid) {
            return res.status(400).json({ message: 'Email déjà vérifié.' });
        }

        // Mettre à jour la vérification de l'email
        user.isvalid = true;
        await user.save();

        console.log('🔑 Email vérifié avec succès.');

        return res.status(200).json({ message: 'Email vérifié avec succès.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
    }
});

module.exports = router;
