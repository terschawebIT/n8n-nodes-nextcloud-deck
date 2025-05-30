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
	// Board-ID als resourceLocator für get, update, delete
	{
		displayName: 'Board',
		name: 'boardId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie ein Board aus der Liste oder geben Sie dessen ID an',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getBoards',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Board-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Board-ID (Zahl) eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// Titel für create
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		required: true,
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel des neuen Boards',
		placeholder: 'Board-Name eingeben...',
	},

	// Farbe für create
	{
		displayName: 'Farbe',
		name: 'color',
		type: 'string',
		required: true,
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['create'],
			},
		},
		default: '000000',
		description: 'Die Farbe des Boards (Hex-Code ohne #)',
		placeholder: '0066CC',
	},

	// Zusätzliche Felder für update
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Boards (optional)',
		placeholder: 'Neuer Board-Name...',
	},

	{
		displayName: 'Farbe',
		name: 'color',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neue Farbe des Boards (Hex-Code ohne #) (optional)',
		placeholder: '0066CC',
	},
]; 