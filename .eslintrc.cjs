module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    plugins: ['testing-library', "jest-dom"],
    extends: [
        'airbnb-base', "plugin:testing-library/dom", 'plugin:jest-dom/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        "testing-library/await-async-query": "error",
        "testing-library/no-await-sync-query": "error",
        "testing-library/no-debugging-utils": "warn",
        "testing-library/no-dom-import": "off",
        "jest-dom/prefer-checked": "error",
        "jest-dom/prefer-enabled-disabled": "error",
        "jest-dom/prefer-required": "error",
        "jest-dom/prefer-to-have-attribute": "error",
    },
};
