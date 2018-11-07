module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 'off',
    'comma-dangle': ['error', 'never'],
    'one-var': ['error', 'always'],
    'no-param-reassign': [2, { props: false }],
    'function-paren-newline': ['error', 'never']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
