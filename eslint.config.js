const js = require('@eslint/js');
module.exports = [
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'assets/js/bootstrap.min.js', 'assets/css/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021, sourceType: 'commonjs',
      globals: { window:'readonly', document:'readonly', localStorage:'readonly', console:'readonly',
                 module:'writable', require:'readonly', process:'readonly', navigator:'readonly',
                 evaluateExpression:'readonly', describe:'readonly', it:'readonly', expect:'readonly',
                  Tesseract:'readonly', MediaStream:'readonly', FileReader:'readonly', LAST_RESULT:'writable' },
    },
    rules: { 'no-unused-vars':'warn', 'eqeqeq':'error', 'semi':['error','always'] },
  },
  { files:['**/*.mjs'], languageOptions:{ ecmaVersion:2021, sourceType:'module', globals:{ console:'readonly' } } },
];
