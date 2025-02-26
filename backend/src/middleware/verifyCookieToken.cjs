const jwt = require('jsonwebtoken');
const config = require('../../config/config.json'); // Assure-toi que la clé JWT est chargée correctement

function verifyCookieToken(req, res, next) {
    const SessionCookiePilOhPoil = req.cookies.SessionCookiePilOhPoil;
    console.log('SessionCookiePilOhPoil:', SessionCookiePilOhPoil);

    if (!SessionCookiePilOhPoil || SessionCookiePilOhPoil === undefined) {
        return res.status(401).json({ message: 'Utilisateur non connecté' });
    }

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(SessionCookiePilOhPoil, config.development.JWT_SECRET);
        console.log('Donnees utilisateur:', decoded);        // Attache les données décodées à la requête
        req.user = decoded;
        next(); // Passe à l'étape suivante (la route)
    } catch (error) {
        console.error('Erreur lors de la verification du token:', error);
        return res.status(401).json({ message: 'Session invalide ou expirée', error: error.message });
    }
}

module.exports = verifyCookieToken;