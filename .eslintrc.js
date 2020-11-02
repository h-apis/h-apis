module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    env: {
        es2021: true,
        node: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        quotes: ['warn', 'single'],
        'comma-dangle': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    overrides: [{
        files: ['*.vue'],
        extends: ['plugin:vue/essential'],
    }],
    ignorePatterns: ['*.js'],
};
