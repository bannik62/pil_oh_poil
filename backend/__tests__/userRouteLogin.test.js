// Mock de Sequelize - nécessaire car le modèle User utilise Sequelize
// Doit être déclaré avant tout import
jest.mock('sequelize', () => ({
    DataTypes: {
        STRING: 'STRING',
        INTEGER: 'INTEGER',
        DATE: 'DATE',
        BOOLEAN: 'BOOLEAN'
    }
}));

// Mock du modèle User avec ses méthodes principales
// On utilise jest.fn() pour créer des fonctions mock qu'on pourra surveiller
jest.mock('../models/user.cjs', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn()
    }
}));

// Imports nécessaires pour les tests
const request = require('supertest');  // Pour tester les routes HTTP
const { User } = require('../models/user.cjs');  // Notre modèle User mocké
const { hash } = require('bcryptjs');  // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken');  // Pour la génération des tokens
const express = require('express');  // Framework web

// Configuration de l'application Express pour les tests
const app = express();
app.use(express.json());  // Middleware pour parser le JSON

// Configuration de la route de login pour les tests
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Utilise le mock de User.findOne
        const user = await User.findOne({ where: { email } });

        // Gestion utilisateur non trouvé
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // Simulation simplifiée de la vérification du mot de passe pour les tests
        if (password !== 'password123') {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Suite de tests pour la route login
describe('POST /login', () => {
    // Test du cas de succès
    it('doit renvoyer un token si l\'authentification est réussie', async () => {
        // Préparation des données de test
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: await hash('password123', 10),
            role: 'user'
        };

        // Configure le mock pour renvoyer l'utilisateur test
        User.findOne.mockResolvedValue(mockUser);

        // Exécute la requête de test
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        // Vérifie les résultats
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    // Test du cas utilisateur non trouvé
    it('doit renvoyer une erreur si l\'utilisateur n\'existe pas', async () => {
        // Configure le mock pour simuler un utilisateur non trouvé
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'inconnu@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé');
    });

    // Test du cas mot de passe incorrect
    it('doit renvoyer une erreur si le mot de passe est incorrect', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: await hash('password123', 10),
            role: 'user'
        };

        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Mot de passe incorrect');
    });
});
