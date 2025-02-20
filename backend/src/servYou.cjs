const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users/userRouteRegister.cjs");

// const sequelize = require("./config/database.js");

dotenv.config();


const app = express();
console.log('demarrage du serveur');
// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());


app.use("/users/api", userRoutes);







// // Route d'enregistrement
// const utilisateurs = [];

// app.post('/register', (req, res) => {
//   const { email, password } = req.body;

//   // Vérifier si l'email existe déjà
//   const utilisateurExiste = utilisateurs.find(user => user.email === email);

//   if (utilisateurExiste) {
//     // Si l'email est déjà utilisé
//     return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
//   }

//   // Vérifier si les champs sont remplis
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
//   }

//   // Ajout à la "base de données"
//   utilisateurs.push({ email, password });

//   console.log('Nouvel utilisateur ajouté :', email, password);

//   // Répondre avec un statut de succès
//   res.status(200).json({ message: 'Inscription réussie' });
// });

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});



// Test de connexion à la BDD
// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Connexion MySQL réussie"))
//   .catch((err) => console.error("❌ Erreur de connexion MySQL :", err));

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon serveur Express !");
});

const PORT = process.env.PORT_EXPRESS || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`)); 