const express = require('express');
const router = express.Router();
const { Message } = require('../../../../models/message.cjs');

router.get('/get/messages',  async (req, res) => {
    console.log('req', req);
    try {
        const messages = await Message.findAll();

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
});

router.get('/get/messages/count', async (req, res) => {
    const messages = await Message.findAll({
        where: { checked: false },
    });
    res.status(200).json(messages.length);
});

router.put('/:userId', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.userId);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé.' });
        }

        message.checked = true; // Marquer comme vu
        console.log('message', message);
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du message.' });
    }
});

router.put('/response/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const content = req.body.message;
        console.log('req.params.responseValue', req.params.messageId);
        console.log('content', content);
        const message = await Message.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé.' });
        }

        message.response = content;
        await message.save();

        res.status(200).json({ message: 'Message mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du message.' });
    }
});

router.delete('/delete/message/:id', async (req, res) => {
    console.log('req.paramsmessage', req.params);
    try {
        const message = await Message.findByPk(req.params.id);
        await message.destroy();
        res.status(200).json({ message: 'Message supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du message.' });
    }
});

module.exports = router;