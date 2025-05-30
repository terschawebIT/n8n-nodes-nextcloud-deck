import { INodeProperties } from 'n8n-workflow';

export const stackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['stack'],
			},
		},
		options: [
			{
				name: 'Alle Stacks Abrufen',
				value: 'getAll',
				description: 'Alle Stacks eines Boards abrufen',
				action: 'Alle Stacks abrufen',
			},
			{
				name: 'Stack Abrufen',
				value: 'get',
				description: 'Einen spezifischen Stack abrufen',
				action: 'Stack abrufen',
			},
			{
				name: 'Stack Erstellen',
				value: 'create',
				description: 'Einen neuen Stack erstellen',
				action: 'Stack erstellen',
			},
			{
				name: 'Stack Aktualisieren',
				value: 'update',
				description: 'Einen Stack aktualisieren',
				action: 'Stack aktualisieren',
			},
			{
				name: 'Stack Löschen',
				value: 'delete',
				description: 'Einen Stack löschen',
				action: 'Stack löschen',
			},
		],
		default: 'getAll',
	},
];

export const stackFields: INodeProperties[] = [
	// Board-ID für alle Stack-Operationen
	{
		displayName: 'Board-ID',
		name: 'boardId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['stack'],
			},
		},
		default: 0,
		description: 'Die ID des Boards, zu dem der Stack gehört',
	},

	// Stack-ID für get, update, delete
	{
		displayName: 'Stack-ID',
		name: 'stackId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: 0,
		description: 'Die ID des Stacks',
	},

	// Titel für create
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel des neuen Stacks',
	},

	// Reihenfolge für create (optional)
	{
		displayName: 'Reihenfolge',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Die Position des Stacks im Board (optional)',
	},

	// Zusätzliche Felder für update
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Stacks (optional)',
	},

	{
		displayName: 'Reihenfolge',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['update'],
			},
		},
		default: 0,
		description: 'Die neue Position des Stacks im Board (optional)',
	},
]; 