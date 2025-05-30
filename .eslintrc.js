module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
	],
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-console': 'warn',
		'no-unused-vars': 'off', // TypeScript handled this
	},
	env: {
		node: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
}; 