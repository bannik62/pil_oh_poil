// Mock de Sequelize - nécessaire car le modèle User utilise Sequelize
jest.mock('sequelize', () => ({
    DataTypes: {
        STRING: 'STRING',
        INTEGER: 'INTEGER',
        DATE: 'DATE',
        BOOLEAN: 'BOOLEAN'
    }
}));

// Mock du modèle User avec ses méthodes principales
jest.mock('../models/user.cjs', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn()
    }
}));

// Imports nécessaires pour les tests
const request = require('supertest');
const { User } = require('../models/user.cjs');
const { hash } = require('bcryptjs');
const express = require('express');

// Configuration de l'application Express pour les tests
const app = express();
app.use(express.json());

// Configuration de la route de register pour les tests
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(401).json({ error: 'Utilisateur déjà existant' });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: 'user'
        });

        res.status(200).json({ message: 'Enregistrement réussi!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Suite de tests pour la route register
describe('POST /register', () => {
    // Test du cas de succès
    it('doit créer un nouvel utilisateur avec succès', async () => {
        // Configure le mock pour simuler un utilisateur non existant
        User.findOne.mockResolvedValue(null);

        // Configure le mock pour simuler la création réussie
        User.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            role: 'user'
        });

        // Exécute la requête de test
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        // Vérifie les résultats
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Enregistrement réussi!');
    });

    // Test du cas utilisateur déjà existant
    it('doit renvoyer une erreur si l\'utilisateur existe déjà', async () => {
        // Configure le mock pour simuler un utilisateur existant
        User.findOne.mockResolvedValue({
            id: 1,
            email: 'test@example.com'
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Utilisateur déjà existant');
    });

    // Test du cas erreur serveur
    it('doit gérer les erreurs serveur', async () => {
        // Configure le mock pour simuler une erreur
        User.findOne.mockRejectedValue(new Error('Erreur de base de données'));

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Erreur de base de données');
    });
});