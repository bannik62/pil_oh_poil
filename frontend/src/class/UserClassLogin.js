import axios from 'axios';

class UtilisateurLogin {
    #email;
    #password;
    #csrfToken;

    constructor(email, password, csrfToken) {
        this.#email = email;
        this.#password = password;
        this.#csrfToken = csrfToken;
    }

    // Getters
    get email() { return this.#email; }
    get password() { return this.#password; }
    get csrfToken() { return this.#csrfToken; }

    // Setters
    set email(newEmail) {
        if (!newEmail || typeof newEmail !== 'string') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(newEmail)) {
                throw new Error('Format d\'email invalide');
            }
            throw new Error('Email invalide');
        }
        this.#email = newEmail;
    }

    set password(newPassword) {
        if (!newPassword || typeof newPassword !== 'string') {
            throw new Error('Mot de passe invalide');
        }
        this.#password = newPassword;
    }

    set csrfToken(newToken) {
        if (!newToken || typeof newToken !== 'string') {
            throw new Error('Token CSRF invalide');
        }
        this.#csrfToken = newToken;
    }

    async connexion() {
        try {
            const response = await axios.post('http://localhost:3000/users/api/login', {
                email: this.email,
                password: this.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.csrfToken
                },
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            return error.response.data;
        }
    }

    toJSON() {
        return {
            email: this.#email,
            password: this.#password
        };
    }
}

export default UtilisateurLogin;
