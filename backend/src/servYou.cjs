const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// routes user connexion
const userRouteRegister = require('./routes/users/userRouteRegister.cjs');
const userRouteLogin = require('./routes/users/userRouteLogin.cjs');
// routes user email
const { verifyEmailMiddleware } = require('./middleware/email/sendVerifValidityMail.cjs');
const userRouteMailValidate = require('./routes/users/userRouteMailValidate.cjs');
// session
const {verifyCookieToken} = require('./middleware/verifyCookieToken.cjs');
// csrf
const { csrfProtection, csrfErrorHandler } = require('./middleware/csrfMiddleware.cjs');
// email
// const verifyEmailTokenForValidity = require('./middleware/email/verifyemailTokenForValidity.cjs');

dotenv.config();

const app = express();
// console.log('🚀 Démarrage du serveur...');
// console.log('📦 Importing express...', express);
// console.log('📦 Importing cors...', cors);
// console.log('📦 Importing cookie-parser...', cookieParser);
// console.log('📦 Importing dotenv...', dotenv);
// console.log('📦 Importing userRouteRegister...', userRouteRegister);
// console.log('📦 Importing userRouteLogin...', userRouteLogin);
// console.log('📦 Importing verifyCookieToken...', verifyCookieToken);
// console.log('📦 Importing CSRF middleware...', { csrfProtection, csrfErrorHandler });

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token']
}));
// ✅ Middlewares globaux
app.use(express.json());
app.use(cookieParser());

// ✅ Route de test
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur Express ! ✅');
});

// ✅ Route pour récupérer le token CSRF (protégée les formulaire)
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ✅ Route pour vérifier la session
app.get('/api/verifySession', verifyCookieToken, (req, res) => {
    console.log('Verifying session...', req.cookies);

    res.status(200).json({
        message: 'Session valide',
        data: req.user  // Renvoie les données utilisateur issues du token
    });
});

// app.use('/users/api/email', userRouteMailValidate);

// ✅ Routes protection CSRF
app.use('/users/api/', csrfProtection, userRouteRegister);

// ✅ Routes protection CSRF
app.use('/users/api/', csrfProtection, userRouteLogin);

// ✅ Gestion des erreurs CSRF (après application de la protection CSRF)
app.use(csrfErrorHandler);

// ✅ Route pour envoyer un email de validation isvalid
app.use('/api/verify/mail',verifyEmailMiddleware, async (req, res) => {
    try {
        console.log('📩 Requête reçue:', req.body);

        if (!req.body.email) {
            return res.status(400).json({ message: '❌ Email non fourni !' });
        }

        console.log(`✉️ Envoi d'email à ${req.body.email}`);

        res.status(200).json({ message: '✅ Email de vérification envoyé avec succès' });
    } catch (error) {
        console.error('🔥 Erreur interne du serveur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

// ✅ Route pour vérifier le token de l'email
app.use('/verify-email/', userRouteMailValidate);

// ✅ Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur interne du serveur ❌' });
});

const PORT = process.env.PORT_EXPRESS || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));
