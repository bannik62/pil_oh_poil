module.exports = {
    testEnvironment: 'node',  // Utilisation d'un environnement Node.js pour les tests
    transform: {
        '^.+\\.mjs$': 'babel-jest',  // Si tu utilises Babel pour ton code
    },
    testTimeout: 10000,  // Permet d'augmenter le temps d'exécution si nécessaire
};
