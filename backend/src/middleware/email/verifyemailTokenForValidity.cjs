// dotenv
const dotenv = require('dotenv');
dotenv.config();

// jwt
const jwt = require('jsonwebtoken');

const verifyEmailTokenForValidity = (req, res, next) => {
    const { token } = req.query;
    console.log('🔑 Token reçu mail :', token);

    if (!token) {
        return res.status(400).json({ message: 'Token manquant.' });
    }

    try {
        console.log('🔑 a decode :', token);
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        console.log('🔑 Decoded token :', decoded);
        // Ajouter l'email à req.user et passer au prochain middleware
        req.user = { email: decoded.email };
        console.log('🔑 envoid de req.user :', req.user);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token invalide ou expiré.' }); // 🚀 Retourne une erreur propre

    }
};

module.exports = verifyEmailTokenForValidity;
