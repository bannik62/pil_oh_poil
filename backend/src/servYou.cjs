const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const userRouteRegister = require('./routes/users/userRouteRegister.cjs');
const userRouteLogin = require('./routes/users/userRouteLogin.cjs');
const { csrfProtection, csrfErrorHandler } = require('./middleware/csrfMiddleware.cjs');
const verifyCookieToken = require('./middleware/verifyCookieToken.cjs');
const { verifyEmailMiddleware } = require('./middleware/verifValidityMail.cjs');

dotenv.config();

const app = express();
console.log('🚀 Démarrage du serveur...');
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

// ✅ Route pour récupérer le token CSRF (protégée)
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

// ✅ Routes protection CSRF
app.use('/users/api/', csrfProtection, userRouteRegister);

// ✅ Routes protection CSRF
app.use('/users/api/', csrfProtection, userRouteLogin);

// ✅ Gestion des erreurs CSRF (après application de la protection CSRF)
app.use(csrfErrorHandler);

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

// ✅ Gestion des erreurs globales
app.use((err, req, res) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur interne du serveur ❌' });
});

// ✅ Route pour vérifier l'email
app.use('/api/verify/mail', verifyEmailMiddleware, (req, res) => {
  // Si le middleware réussit, vous pouvez envoyer une réponse de succès
  res.status(200).json({ message: 'Email de vérification envoyé avec succès', token: req.emailToken });
});

const PORT = process.env.PORT_EXPRESS || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));
