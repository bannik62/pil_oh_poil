import axios from 'axios';

class UserInfo {
    #userId;
    #firstName;
    #lastName;
    #telephone;
    #address;
    #dateOfBirth;
    #csrfToken;

    constructor( userId, firstName, lastName, address, telephone, dateOfBirth, csrfToken) {
        this.#userId = userId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#address = address;
        this.#telephone = telephone;
        this.#dateOfBirth = dateOfBirth;
        this.#csrfToken = csrfToken;
    }

    get userId() {
        return this.#userId;
    }
    // Getters
    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    get address() {
        return this.#address;
    }

    get telephone() {
        return this.#telephone;
    }

    get dateOfBirth() {
        return this.#dateOfBirth;
    }

    get csrfToken() {
        return this.#csrfToken;
    }

    // Setters
    set userId(value) {
        if (!this.#userId || typeof this.#userId !== 'string') {
            throw new Error('Id invalide');
        }
        this.#userId = value;
    }

    set firstName(value) {
        if (!this.#lastName || typeof this.#lastName !== 'string') {
            throw new Error('Nom invalide');
        }
        const nameRegex = /^[a-zA-Z.-]{2,}$/;
        if (!nameRegex.test(this.#lastName)) {
            throw new Error('Le nom ne peut contenir que des lettres, des tirets et des points, minimum 2 caractères');
        }
        this.#firstName = value;
    }

    set lastName(value) {
        if (!this.#lastName || typeof this.#lastName !== 'string') {
            throw new Error('Nom invalide');
        }
        const nameRegex = /^[a-zA-Z.-]{2,}$/;
        if (!nameRegex.test(this.#lastName)) {
            throw new Error('Le nom ne peut contenir que des lettres, des tirets et des points, minimum 2 caractères');
        }
        this.#lastName = value;
    }

    set address(value) {
        if (!this.#address || typeof this.#address !== 'string') {
            throw new Error('Adresse invalide');
        }
        this.#address = value;
    }

    set telephone(value) {
        if (!this.#telephone || typeof this.#telephone !== 'string') {
            const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            if (!phoneRegex.test(this.#telephone)) {
                throw new Error('Le numéro de téléphone doit être au format français (ex: 06 12 34 56 78)');
            }
            throw new Error('Téléphone invalide');
        }
        this.#telephone = value;
    }

    set dateOfBirth(value) {
        if (!this.#dateOfBirth || typeof this.#dateOfBirth !== 'string') {
            throw new Error('Date de naissance invalide');
        }
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dateRegex.test(this.#dateOfBirth)) {
            throw new Error('Le format de date de naissance doit être YYYY-MM-DD');
        }
    }

    set csrfToken(value) {
        if (!this.#csrfToken || typeof this.#csrfToken !== 'string') {
            throw new Error('Token CSRF invalide');
        }
        this.#csrfToken = value;
    }
    // Méthode pour enregistrer les informations
    async saveInfosUser() {
        try {
            const response = await axios.post('http://localhost:3000/users/api/info', {
                userId: this.#userId,
                firstName: this.#firstName,
                lastName: this.#lastName,
                telephone: this.#telephone,
                address: this.#address,
                dateOfBirth: this.#dateOfBirth,
                csrfToken: this.#csrfToken
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.#csrfToken,
                },
                withCredentials: true
            });

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des informations:', error);
            throw error;
        }
    }
    async updateInfosUser() {
        try {
            const response = await axios.put('http://localhost:3000/users/api/info', {
                userId: this.#userId,
                firstName: this.#firstName,
                lastName: this.#lastName,
                telephone: this.#telephone,
                address: this.#address,
                dateOfBirth: this.#dateOfBirth,
                csrfToken: this.#csrfToken
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.#csrfToken,
                },
                withCredentials: true
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations:', error);
            throw error;
        }
    }
}

export default UserInfo;
