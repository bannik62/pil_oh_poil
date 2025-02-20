const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const { User } = require('../../../models/user.cjs');
// const { verifyEmailMiddleware, verifyEmailToken } = require('../../middleware/verifValidityMail.cjs');

console.log("user chargé !!! ", User);

const { validationRegister } = require('../../validations/validationRegister.cjs');

router.post('/register',  async (req, res) => {
    console.log('Début de la requête /register');
    console.log('Données reçues :', req.body);
    console.log('début validation des données');
    const { error, value } = validationRegister(req.body);
    if (error) {
      console.log('Erreur de validation :', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log('fin validation des données');

    const { email, password } = value;
    console.log('email', email);
    console.log('password', password);
    console.log(' Recherche de l\'utilisateur...',value);

    try {
        console.log('user email', User);
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log('Utilisateur déjà existant.');
            return res.status(401).json({ error: 'Utilisateur déjà existant' });
        }

        console.log('Utilisateur non existant. Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(password, 10); // Étape critique

        console.log('Mot de passe haché. Création de l\'utilisateur...');
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: 'user'
        });

        console.log('Nouvel utilisateur créé :', newUser);
        res.json({ message: "Enregistrement réussi!" });
    } catch (err) {
        console.error('Erreur interne :', err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
