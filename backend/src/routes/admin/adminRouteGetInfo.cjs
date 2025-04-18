const express = require('express');
const router = express.Router();
const { UserProfile } = require('../../../models/userprofile.cjs');
const { User } = require('../../../models/user.cjs');
const { verifyCookieToken } = require('../../middleware/verifyCookieToken.cjs');
const { Op } = require('sequelize');
// Route pour récupérer tous les utilisateurs
router.get('/getAllUsers/infos',verifyCookieToken, async (req, res) => {
    try {
        // Récupérer tous les profils utilisateurs
        const userProfiles = await UserProfile.findAll();

        if (!userProfiles || userProfiles.length === 0) {
            return res.status(404).json({ error: 'Aucun profil utilisateur trouvé' });
        }

        // Retourner les informations des profils
        res.status(200).json({
            message: 'Informations des utilisateurs récupérées avec succès',
            userProfiles
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getAllUsers/infos/forMail',verifyCookieToken, async (req, res) => {
    try {
        const user = await User.findAll();
        const userProfilesWithoutPassword = user.map(user => {
            const { password, ...userWithoutPassword } = user.dataValues; // Exclure le champ password
            return userWithoutPassword;
        });
        res.status(200).json({
            message: 'Informations des utilisateurs récupérées avec succès',
            userProfilesInfos: userProfilesWithoutPassword
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        res.status(500).json({ error: error.message });
    }
});
// Route pour chercher un utilisateur par nom
router.get('/getUserByName/:firstName', async (req, res) => {
    try {
        let { firstName } = req.params;

        // Vérification du paramètre
        if (!firstName || typeof firstName !== 'string') {
            return res.status(400).json({ error: 'Le prénom est invalide' });
        }

        // Nettoyage du prénom
        firstName = firstName.trim().toLowerCase().replace(/ /g, '');

        console.log('Recherche avec :', firstName);

        // Rechercher les profils utilisateurs par prénom
        const userProfiles = await UserProfile.findAll({
            where: {
                firstName: { [Op.like]: `${firstName}%` }
            }
        });

        if (!userProfiles || userProfiles.length === 0) {
            return res.status(404).json({ error: 'Aucun profil utilisateur trouvé avec ce prénom' });
        }

        // Retourner les informations des profils
        res.status(200).json({
            message: 'Informations des utilisateurs récupérées avec succès',
            userProfiles
        });

    } catch (error) {
        console.error('Erreur lors de la recherche des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getUserByEmail/:email', async (req, res) => {
    try {
        let { email } = req.params;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'L\'email est invalide' });
        }

        email = email.trim().toLowerCase().replace(/ /g, '');

        console.log('Recherche avec :', email);
        const userEmail = await User.findAll({
            where: {
                email: { [Op.like]: `${email}%` }

            }

        });

        if (!userEmail || userEmail.length === 0) {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email' });
        }

        res.status(200).json({
            message: 'Informations des utilisateurs récupérées avec succès',
            users: userEmail
        });

    } catch (error) {
        console.error('Erreur lors de la recherche des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getUserByPhone/:phone', async (req, res) => {
    try {
        let { phone } = req.params;
        console.log('phoneeeeeeeeeeeeeeee', phone);

        if (!phone || typeof phone !== 'string') {
            return res.status(400).json({ error: 'Le numéro de téléphone est invalide' });
        }

        phone = phone.trim().replace(/ /g, '');

        console.log('Recherche avec :', phone);

        const users = await UserProfile.findAll({
            where: {
                telephone: { [Op.like]: `${phone}%` }
            }
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé avec ce numéro de téléphone' });
        }

        res.status(200).json({
            message: 'Numéro de téléphone récupéré avec succès',
            userPhone: users
        });

    } catch (error) {
        console.error('Erreur lors de la recherche des informations:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getUserById/:id',verifyCookieToken, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserProfile.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({
            message: 'Utilisateur récupéré avec succès',
            user
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de l utilisateur pour le rdv:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteUser/:profileId', verifyCookieToken, async (req, res) => {
    try {
        const { profileId } = req.params;

        console.log('profileId:', profileId);

        // Trouver le UserProfile via son ID
        const userProfile = await UserProfile.findByPk(profileId);
        if (!userProfile) {
            return res.status(404).json({ error: 'Profil utilisateur non trouvé' });
        }

        // Récupérer l'utilisateur lié
        const user = await User.findByPk(userProfile.userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Supprimer l'utilisateur (cascade supprimera le UserProfile si bien configuré)
        await user.destroy();

        res.status(200).json({ message: 'Utilisateur et profil supprimés avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
