module.exports = {
    env: {
        es2021: true,
        node: true,
        browser: true,
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        quotes: ['warn', 'single'],
        'comma-dangle': ['warn', {
            arrays: 'never',
            objects: 'always',
            functions: 'always',
        }],
    },
    overrides: [
        {
            files: ['.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: ['plugin:@typescript-eslint/recommended'],
        },
        {
            files: ['.vue'],
            extends: ['plugin:vue/essential'],
        }
    ],
};
