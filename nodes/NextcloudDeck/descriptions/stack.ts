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
	// Board-ID als Dropdown für alle Stack-Operationen
	{
		displayName: 'Board',
		name: 'boardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBoards',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['stack'],
			},
		},
		default: '',
		description: 'Wählen Sie das Board aus',
	},

	// Stack-ID als Dropdown für get, update, delete
	{
		displayName: 'Stack',
		name: 'stackId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getStacks',
			loadOptionsDependsOn: ['boardId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'Wählen Sie den Stack aus',
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
		description: 'Die Position des Stacks im Board (optional, 0 = am Ende)',
	},

	// Zusätzliche Felder für update
	{
		displayName: 'Neuer Titel',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Stacks (leer lassen wenn nicht ändern)',
	},

	{
		displayName: 'Neue Reihenfolge',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['update'],
			},
		},
		default: undefined,
		description: 'Die neue Position des Stacks im Board (leer lassen wenn nicht ändern)',
	},
]; 