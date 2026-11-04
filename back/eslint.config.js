import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node,
		},
		rules: {
			eqeqeq: 'error',
			'prefer-const': 'error',
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
		},
	},
	eslintConfigPrettier,
];
