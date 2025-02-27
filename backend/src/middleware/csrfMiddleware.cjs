const csrf = require('csurf');

// Middleware de protection CSRF
const csrfProtection = csrf({ cookie: true });

const csrfErrorHandler = (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'Jeton CSRF invalide ou manquant' });
    }
    next(err);
};

module.exports = { csrfProtection, csrfErrorHandler };
