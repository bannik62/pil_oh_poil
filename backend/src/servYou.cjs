const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
// const sequelize = require("./config/database.js");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

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