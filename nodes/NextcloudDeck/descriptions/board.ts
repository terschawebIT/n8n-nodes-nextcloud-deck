import { INodeProperties } from 'n8n-workflow';

export const boardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['board'],
			},
		},
		options: [
			{
				name: 'Alle Boards Abrufen',
				value: 'getAll',
				description: 'Alle verfügbaren Boards abrufen',
				action: 'Alle Boards abrufen',
			},
			{
				name: 'Board Abrufen',
				value: 'get',
				description: 'Ein spezifisches Board abrufen',
				action: 'Board abrufen',
			},
			{
				name: 'Board Erstellen',
				value: 'create',
				description: 'Ein neues Board erstellen',
				action: 'Board erstellen',
			},
			{
				name: 'Board Aktualisieren',
				value: 'update',
				description: 'Ein Board aktualisieren',
				action: 'Board aktualisieren',
			},
			{
				name: 'Board Löschen',
				value: 'delete',
				description: 'Ein Board löschen',
				action: 'Board löschen',
			},
		],
		default: 'getAll',
	},
];

export const boardFields: INodeProperties[] = [
	// Board-ID für get, update, delete
	{
		displayName: 'Board-ID',
		name: 'boardId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: 0,
		description: 'Die ID des Boards',
	},

	// Titel für create
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel des neuen Boards',
	},

	// Farbe für create
	{
		displayName: 'Farbe',
		name: 'color',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['create'],
			},
		},
		default: '000000',
		description: 'Die Farbe des Boards (Hex-Code ohne #)',
		placeholder: '000000',
	},

	// Zusätzliche Felder für update
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Boards (optional)',
	},

	{
		displayName: 'Farbe',
		name: 'color',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neue Farbe des Boards (Hex-Code ohne #) (optional)',
		placeholder: '000000',
	},
]; 