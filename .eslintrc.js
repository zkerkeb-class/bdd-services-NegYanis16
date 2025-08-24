module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // Console logs autorisés pour le logging
    'no-console': 'off',

    // Permettre les underscores dans les noms de variables (MongoDB _id)
    'no-underscore-dangle': ['error', { allow: ['_id', '__dirname', '__filename'] }],

    // Permettre les fonctions async sans await
    'require-await': 'off',

    // Permettre l'utilisation de console pour Winston
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],

    // Permettre l'import de modules sans extension
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
      },
    ],

    // Permettre les dépendances dev en imports
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

    // Permettre l'utilisation de variables avant leur déclaration (hoisting)
    'no-use-before-define': ['error', { functions: false }],

    // Permettre les fonctions fléchées pour les callbacks
    'prefer-arrow-callback': 'error',

    // Encourager l'utilisation de const
    'prefer-const': 'error',

    // Limiter la longueur des lignes
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreUrls: true }],

    // Permettre les paramètres non utilisés avec underscore
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  // Ignorer certains fichiers
  ignorePatterns: ['node_modules/', 'coverage/', '*.min.js'],
};
