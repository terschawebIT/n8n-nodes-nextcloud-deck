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
	// Board-ID als resourceLocator für alle Stack-Operationen
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
				resource: ['stack'],
			},
		},
	},

	// Stack-ID als resourceLocator für get, update, delete
	{
		displayName: 'Stack',
		name: 'stackId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie einen Stack aus der Liste oder geben Sie dessen ID an',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getStacks',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Stack-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Stack-ID (Zahl) eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['stack'],
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
				resource: ['stack'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel des neuen Stacks',
		placeholder: 'Stack-Name eingeben (z.B. "To Do", "In Progress", "Done")...',
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
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		displayOptions: {
			show: {
				resource: ['stack'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Stacks (leer lassen wenn nicht ändern)',
		placeholder: 'Neuer Stack-Name...',
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
		default: 0,
		description: 'Die neue Position des Stacks im Board (0 = nicht ändern)',
	},
]; 