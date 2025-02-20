const express = require('express');
const router = express.Router();
const { User } = require('../../../models/user.cjs');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Tentative de connexion : ${email}`);

    // Ici, ajoute ta logique de connexion (vérification en base de données, bcrypt, etc.)
    res.json({ message: 'Connexion réussie !' });
});