const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

const TOKEN = "";

const verifyEmailMiddleware = async (req, res, next) => {
    try {
        // Generate JWT token valid for 10 minutes
        const emailToken = jwt.sign(
            { email: req.body.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '10m' }
        );

        // Configure mailtrap transport
        const transport = nodemailer.createTransport(
            MailtrapTransport({
                token: TOKEN,
                testInboxId: 3476769,
            })
        );

        // Email content
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;
        
        const mailOptions = {
            from: {
                address: "hello@example.com",
                name: "Pil'oh Poil"
            },
            to: req.body.email,
            subject: "Vérification de votre email",
            html: `
                <h1>Vérification de votre compte</h1>
                <p>Cliquez sur le lien ci-dessous pour vérifier votre email. Le lien est valide pendant 10 minutes.</p>
                <a href="${verificationLink}">Vérifier mon email</a>
            `,
            category: "Email Verification",
            sandbox: true
        };

        // Send email
        await transport.sendMail(mailOptions);

        // Store token in request for later use
        req.emailToken = emailToken;
        
        next();
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de vérification' });
    }
};

const verifyEmailToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = { verifyEmailMiddleware, verifyEmailToken };
