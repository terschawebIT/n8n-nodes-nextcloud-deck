import { INodeProperties } from 'n8n-workflow';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['comment'],
			},
		},
		options: [
			{
				name: 'Alle Kommentare Abrufen',
				value: 'getAll',
				description: 'Alle Kommentare einer Karte abrufen',
				action: 'Alle Kommentare abrufen',
			},
			{
				name: 'Kommentar Abrufen',
				value: 'get',
				description: 'Einen spezifischen Kommentar abrufen',
				action: 'Kommentar abrufen',
			},
			{
				name: 'Kommentar Erstellen',
				value: 'create',
				description: 'Einen neuen Kommentar erstellen',
				action: 'Kommentar erstellen',
			},
			{
				name: 'Kommentar Aktualisieren',
				value: 'update',
				description: 'Einen Kommentar aktualisieren',
				action: 'Kommentar aktualisieren',
			},
			{
				name: 'Kommentar Löschen',
				value: 'delete',
				description: 'Einen Kommentar löschen',
				action: 'Kommentar löschen',
			},
		],
		default: 'getAll',
	},
];

export const commentFields: INodeProperties[] = [
	// Board-ID als resourceLocator für alle Comment-Operationen
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
				resource: ['comment'],
			},
		},
	},

	// Stack-ID als resourceLocator für alle Comment-Operationen
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
				resource: ['comment'],
			},
		},
	},

	// Card-ID als resourceLocator für alle Comment-Operationen
	{
		displayName: 'Karte',
		name: 'cardId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie eine Karte aus der Liste oder geben Sie deren ID an',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCards',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Card-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Card-ID (Zahl) eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['comment'],
			},
		},
	},

	// Comment-ID für get, update, delete
	{
		displayName: 'Kommentar ID',
		name: 'commentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'Die ID des Kommentars',
		placeholder: 'z.B. 123',
	},

	// Nachricht für create
	{
		displayName: 'Nachricht',
		name: 'message',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Inhalt des Kommentars',
		placeholder: 'Schreiben Sie hier Ihren Kommentar...',
	},

	// Nachricht für update
	{
		displayName: 'Neue Nachricht',
		name: 'message',
		type: 'string',
		typeOptions: {
			canBeExpression: true,
			AIEnabled: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Inhalt des Kommentars',
		placeholder: 'Aktualisierter Kommentartext...',
	},
]; 