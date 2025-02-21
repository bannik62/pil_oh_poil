import axios from 'axios';
class Utilisateur {
  #email;
  #password;

  constructor(email, password) {
    this.#email = email;
    this.#password = password;
 
  }

  // Getters
  get email() { return this.#email; }
  get password() { return this.#password; }

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

  async envoyer() {
    try {
      const response = await axios.post('http://localhost:3000/users/api/register', {
        email: this.email,
        password: this.password
      });
      
      return response.data; // On retourne les données de la réponse
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      return error.response.data; // On retourne le message d'erreur du serveur
    }
  }
  // Méthodes
  toJSON() {
    return {
      email: this.#email,
      password: this.#password,
    };
  }
}

export default  Utilisateur ;