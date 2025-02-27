import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            svelte
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            'no-trailing-spaces': 'error',
            'eqeqeq': 'error',
            'camelcase': 'off'
        }
    }
];
