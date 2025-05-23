const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const csrf = require('csurf');

// routes user
const userRouteRegister = require('./routes/users/loginRegister/userRouteRegister.cjs');
const userRouteLogin = require('./routes/users/loginRegister/userRouteLogin.cjs');
const userRoutePostInfos = require('./routes/users/infoUsers/userRoutePostInfos.cjs');
const userRouteGetInfos = require('./routes/users/infoUsers/userRouteGetInfos.cjs');
const userRouteUpdateInfos = require('./routes/users/infoUsers/userRouteUpdateInfos.cjs');
const userRouteAppointments = require('./routes/users/appointments/userRouteAppointments.cjs');
const userRouteMessages = require('./routes/users/messagerie/userRoutesMessages.cjs');
const userRouteGetInfosAdmin = require('./routes/admin/search/adminRouteGetInfo.cjs');
const userRouteGetMessagesAdmin = require('./routes/admin/messagerie/adminRouterGetMessages.cjs');
const userRouteGetAppointmentsAdmin = require('./routes/admin/rdv/adminRouteGetAppointments.cjs');
// routes user email
const { verifyEmailMiddleware } = require('./middleware/email/sendVerifValidityMail.cjs');
const userRouteMailValidate = require('./routes/users/general/userRouteMailValidate.cjs');
const userRouteEmailIsValid = require('./routes/users/general/userRouteEmailIsValid.cjs');
// session
const {verifyCookieToken} = require('./middleware/verifyCookieToken.cjs');
// csrf
const { csrfProtection, csrfErrorHandler } = require('./middleware/csrfMiddleware.cjs');
// email
// const verifyEmailTokenForValidity = require('./middleware/email/verifyemailTokenForValidity.cjs');

//system
const userRouteGetDiskUsageAdmin = require('./routes/admin/parametre/adminRouterAdvanced.cjs');
const userRouteMaintenanceStatus = require('./routes/system/SystemRouteMaintenance.cjs');

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token', 'Cookie']
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

// ✅ Route pour vérifier si l'email de l'utilisateur est validé
app.use('/users/checkisvalid/', userRouteEmailIsValid);

// ✅ Route pour vérifier la session
app.get('/api/verifySession', verifyCookieToken, (req, res) => {
    console.log('Verifying session...', req.cookies);

    res.status(200).json({
        message: 'Session valide',
        data: req.user  // Renvoie les données utilisateur issues du token
    });
});

//                                      **********************
//                                      *                    *
//                                      *   enregistrement   *
//                                      *        login       *
// ____________________________________ **********************______________________________________________/

// ✅ Routes enregistrement protection CSRF
app.use('/users/api/', csrfProtection, userRouteRegister);

// ✅ Routes connexion protection CSRF
app.use('/users/api/', csrfProtection, userRouteLogin);

// ✅ Routes poste  infos personnelles protection CSRF
app.use('/users/api/user/',csrfProtection, userRoutePostInfos);

//                                      **********************
//                                      *                    *
//                                      *   recuperation     *
//                                      *       infos        *
// ____________________________________ **********************______________________________________________/

// ✅ Route pour récupérer les informations de l'utilisateur
app.use('/users/api/infos/', userRouteGetInfos);

// ✅ Route pour mettre à jour les informations de l'utilisateur
app.use('/users/api/update/', userRouteUpdateInfos);

// ✅ Route pour récupérer les informations de l'utilisateur admin
app.use('/users/api/admin/infos/', userRouteGetInfosAdmin);

// ✅ Route pour récupérer les messages de l'utilisateur admin
app.use('/users/api/admin/messages/',verifyCookieToken, userRouteGetMessagesAdmin);

// ✅ Route pour récupérer tous les rendez-vous
app.use('/users/api/admin/rdv/', userRouteGetAppointmentsAdmin);

// ✅ Route pour supprimer un rendez-vous
app.use('/users/api/admin/rdvuser/', userRouteGetAppointmentsAdmin);

// ✅ Route pour récupérer les informations système
app.use('/users/api/admin/advanced-parameter/disk-usage', userRouteGetDiskUsageAdmin);

// ✅ Route pour vérifier l'état de la maintenance
app.use('/api/system/', userRouteMaintenanceStatus);

// ✅ Route pour vérifier l'état de la maintenance
app.use('/api/system/', userRouteMaintenanceStatus);

//                                      **********************
//                                      *                    *
//                                      *   verification     *
//                                      *       email        *
// ____________________________________ **********************______________________________________________/

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

//                                      **********************
//                                      *                    *
//                                      *   gestion des      *
//                                      *     erreurs        *
// ____________________________________ **********************______________________________________________/
// ✅ Gestion des erreurs CSRF (après application de la protection CSRF)
app.use(csrfErrorHandler);

// ✅ Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur interne du serveur ❌' });
});

//                                      **********************
//                                      *                    *
//                                      *   gestion des      *
//                                      *   rendez-vous      *
// ____________________________________ **********************______________________________________________/

// ✅ Route pour obtenir tous les rendez-vous
app.use('/api/appointments/', userRouteAppointments);

// ✅ Route pour obtenir tous les rendez-vous
app.use('/api/appointments/getall', userRouteAppointments);

//                                      **********************
//                                      *                    *
//                                      *   gestion des      *
//                                      *     messages       *
// ____________________________________ **********************______________________________________________/

// ✅ Route pour obtenir tous les messages
app.use('/api/user/chat/', userRouteMessages);
//                                      **********************
//                                      *                    *
//                                      *   deconnexion      *
//                                      *                    *
// ____________________________________ **********************______________________________________________/

// ✅ Route de déconnexion
app.post('/api/user/auth/logout', (req, res) => {
    try {
        // Supprimer le cookie de session
        res.clearCookie('SessionCookiePilOhPoil', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
});

const PORT = process.env.PORT_EXPRESS || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));
