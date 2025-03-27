const express = require('express');
const { Message } = require('../../../../models/message.cjs'); // Assurez-vous de bien importer le modèle Message
const router = express.Router();

// Route pour envoyer un message
router.post('/post/messages/:id', async (req, res) => {
    console.log('req.body', req.body);
    console.log('req.params', req.params);
    try {
        const  userId  = req.params.id;
        const { content } = req.body;
        console.log('userId', userId);
        console.log('content', content);
        // Créer un nouveau message
        const newMessage = await Message.create({
            userId,
            content,
            response: null, // L'admin n'a pas encore répondu
            checked: false // Le message n'a pas encore été vu par l'admin
        });
        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
    }
});

router.get('/fetch/messages/:id', async (req, res) => {
    try {
        const userIdAuthor = req.params.id;
        const messages = await Message.findAll({
            where: { userId: userIdAuthor }
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
});

// Route pour récupérer tous les messages d'un utilisateur (uniquement l'admin peut y accéder)
router.get('/admin', async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { checked: false },
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
});

// Route pour marquer un message comme vu par l'admin
router.put('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé.' });
        }

        message.checked = true; // Marquer comme vu
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du message.' });
    }
});

module.exports = router;
