module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['react', 'jsx-a11y', 'import'],
  globals: {
    document: 1,
    localStorage: 1,
  },
  rules: {
    'function-paren-newline': 0,
    'arrow-parens': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'no-confusing-arrow': 0,
  },
};
