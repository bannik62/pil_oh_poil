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
        if (typeof value !== 'string' || !/^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(value)) {
            throw new Error('Le numéro de téléphone doit être au format français (ex: 01 23 45 67 89 ou +33 6 12 34 56 78)');
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
        console.log('csrfToken:', this.#csrfToken);
        let erreurMiseAJour = '';
        try {
            const response = await axios.post('http://localhost:3000/users/api/user/info', {
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
            // Capture et affichage de l'erreur
            console.error('Erreur lors de l\'enregistrement :', error);
            erreurMiseAJour = error || 'Une erreur est survenue lors de la mise à jour.';// eslint-disable-line no-unused-vars

            // Efface le message d'erreur après 5 secondes
            setTimeout(() => {
                erreurMiseAJour = '';
            }, 5000);
        }

    }
    async updateUserInfos(updatedFields) {
        let erreurMiseAJour = '';
        try {
            if (!updatedFields || Object.keys(updatedFields).length === 0) {
                console.warn('Aucune modification détectée.');
                return;
            }

            // Ajouter l'ID de l'utilisateur
            updatedFields.userId = this.#userId;
            updatedFields.csrfToken = this.#csrfToken;

            const response = await axios.patch(`http://localhost:3000/users/api/update/patch/${this.#userId}`, updatedFields, {
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': this.#csrfToken,
                },
                withCredentials: true
            });

            console.log('Mise à jour réussie:', response.data);
            return response.data;

        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
            erreurMiseAJour = error.message || 'Une erreur est survenue lors de la mise à jour.';// eslint-disable-line no-unused-vars

            setTimeout(() => {
                erreurMiseAJour = error.message || 'Une erreur est survenue lors de la mise à jour.';
            }, 5000);
        }
    }

}

export default UserInfo;
