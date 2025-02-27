import globals from 'globals';

export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                myCustomGlobal: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'off',
            'no-console': 'off',
            'no-undef': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            'no-trailing-spaces': 'error',
            'eqeqeq': 'error',
            'camelcase': 'warn'
        }
    }
];