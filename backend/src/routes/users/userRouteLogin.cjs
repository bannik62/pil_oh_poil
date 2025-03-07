const express = require('express');
const router = express.Router();
const { User } = require('../../../models/user.cjs');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('../../../config/config.json');
const dotenv = require('dotenv');

dotenv.config();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Requête de connexion:', req.body);

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe (assure-toi d'avoir un mécanisme de hachage)
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }
        // Générer un token JWT

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, isvalid: user.isvalid }, config.development.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token crée :', token);

        // Envoyer le token avec un cookie HttpOnly (ou dans le corps de la réponse)
        res.cookie('SessionCookiePilOhPoil', token, {
            httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'lax'
        });
        res.status(200).json({ message: 'Connexion reussie', token });
        console.log('Cookie envoyé :', res.getHeaders()['set-cookie']);

    } catch (error) {
        console.error('Erreur de connexion :', error);  // Enregistrer l'erreur dans la console ou un fichier log
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
