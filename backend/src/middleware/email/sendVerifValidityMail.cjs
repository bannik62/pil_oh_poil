const jwt = require('jsonwebtoken');
const Nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');
const dotenv = require('dotenv');

dotenv.config();

function verifyEmailMiddleware(req, res, next) {
    console.log('Requête reçue:', req.body);
    try {
        // Generate JWT token valid for 10 minutes
        const emailToken = jwt.sign(
            { email: req.body.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '10m' }
        );

        // Configure mailtrap transport
        // Looking to send emails in production? Check out our Email API/SMTP product!

        const TOKENMailtrap = '642213db4010e161c41b08a5559041ab';

        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: TOKENMailtrap,
                testInboxId: 3476769,
                host: 'sandbox.smtp.mailtrap.io',
            })
        );

        const sender = {
            address: 'hello@example.com',
            name: 'Mailtrap Test',
        };
        const recipients = [
            'djbk62@gmail.com',
        ];

        transport
            .sendMail({
                from: sender,
                to: recipients,
                subject: 'You are awesome!',
                text: 'Congrats for sending test email with Mailtrap!',
                category: 'Integration Test',
                sandbox: true
            })
            .then(console.log, console.error);

        // Email content
        const verificationLink = `http://localhost:3000/verify-email/token?token=${emailToken}`;

        const mailOptions = {
            from: {
                address: 'hello@example.com',
                name: 'Pile\'oh Poil'
            },
            to: req.body.email,
            subject: 'Vérification de votre email',
            html: `
                <h1>Vérification de votre compte</h1>
                <p>Cliquez sur le lien ci-dessous pour vérifier votre email. Le lien est valide pendant 10 minutes.</p>
                <a href="${verificationLink}">Vérifier mon email</a>
            `,
            category: 'Email Verification',
            sandbox: true
        };

        // Send email
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de vérification' });
            }
            console.log('Email envoyé:', info.response);
            req.emailToken = emailToken;
            next();
        });
    } catch (error) {
        console.error('Erreur dans le middleware:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = { verifyEmailMiddleware };
