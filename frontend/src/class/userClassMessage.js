class UserClassMessage {
    #userId;
    #userAuthor;
    #content;
    #erreur;

    constructor(userId, userAuthorName, content) {
        this.#erreur = []; // Initialisation des erreurs

        this.setUserId(userId);
        this.setUserAuthor(userAuthorName);
        this.setContent(content);
    }

    get userId() { return this.#userId; }
    get userAuthor() { return this.#userAuthor; }
    get content() { return this.#content; }
    get erreur() { return this.#erreur; }

    setUserId(value) {
        if (typeof value !== 'number' || value <= 0) {
            this.#erreur.push('L\'ID de l\'utilisateur doit être un nombre positif.');
        } else {
            this.#userId = value;
        }
    }

    setUserAuthor(value) {
        if (typeof value !== 'string' || value.length === 0) {
            this.#erreur.push('Le nom de l\'auteur doit être une chaîne de caractères non vide.');
        } else if (value.length > 30) {
            this.#erreur.push('Le nom de l\'auteur doit contenir moins de 30 caractères.');
        } else {
            this.#userAuthor = value;
        }
    }

    setContent(value) {
        if (typeof value !== 'string' || value.length === 0) {
            this.#erreur.push('Le contenu doit être une chaîne de caractères non vide.');
        } else if (value.length > 100) {
            this.#erreur.push('Le contenu doit contenir moins de 100 caractères.');
        } else {
            this.#content = value;
        }
    }

    /**
     * Vérifie si l'objet est valide (aucune erreur)
     */
    isValid() {
        return this.#erreur.length === 0;
    }

    /**
     * Convertit l'instance en objet JSON
     */
    toJSON() {
        return {
            userId: this.#userId,
            userAuthor: this.#userAuthor,
            content: this.#content,
            erreur: this.#erreur
        };
    }
}

export default UserClassMessage;
