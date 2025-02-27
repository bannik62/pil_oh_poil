import globals from 'globals';

export default [
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        ignores: ['**/__tests__/**', '**/*.test.js', '**/*.spec.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                myCustomGlobal: 'readonly',
                jest: 'readonly',
                expect: 'readonly',
                describe: 'readonly',
                test: 'readonly',
                it: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly'
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