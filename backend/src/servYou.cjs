const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users/userRouteRegister.cjs");
const userRouteLogin = require("./routes/users/userRouteLogin.cjs");
const { csrfProtection, csrfErrorHandler } = require("./middleware/csrfMiddleware.cjs");

dotenv.config();

const app = express();
console.log('🚀 Démarrage du serveur...');

// ✅ Middlewares globaux
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

// ✅ Route pour récupérer le token CSRF (protégée)
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
}); 

// ✅ Routes sans protection CSRF
app.use("/users/api", userRoutes);

// ✅ Appliquer CSRF uniquement à "/users/api/login"
app.use("/users/api/", csrfProtection, userRouteLogin);

// ✅ Gestion des erreurs CSRF (après application de la protection CSRF)
app.use(csrfErrorHandler);

// ✅ Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur interne du serveur ❌' });
});

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon serveur Express ! ✅");
});

const PORT = process.env.PORT_EXPRESS || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));
