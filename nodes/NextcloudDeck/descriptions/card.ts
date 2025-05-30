import { INodeProperties } from 'n8n-workflow';

export const cardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['card'],
			},
		},
		options: [
			{
				name: 'Stack mit Karten Abrufen',
				value: 'getAll',
				description: 'Stack abrufen mit allen enthaltenen Karten',
				action: 'Stack mit Karten abrufen',
			},
			{
				name: 'Karte Abrufen',
				value: 'get',
				description: 'Eine spezifische Karte abrufen',
				action: 'Karte abrufen',
			},
			{
				name: 'Karte Erstellen',
				value: 'create',
				description: 'Eine neue Karte erstellen',
				action: 'Karte erstellen',
			},
			{
				name: 'Karte Aktualisieren',
				value: 'update',
				description: 'Eine Karte aktualisieren',
				action: 'Karte aktualisieren',
			},
			{
				name: 'Karte Löschen',
				value: 'delete',
				description: 'Eine Karte löschen',
				action: 'Karte löschen',
			},
			{
				name: 'Benutzer Zuweisen',
				value: 'assignUser',
				description: 'Einen Benutzer zu einer Karte zuweisen',
				action: 'Benutzer zuweisen',
			},
			{
				name: 'Benutzer Entfernen',
				value: 'unassignUser',
				description: 'Einen Benutzer von einer Karte entfernen',
				action: 'Benutzer entfernen',
			},
		],
		default: 'getAll',
	},
];

export const cardFields: INodeProperties[] = [
	// Board-ID als resourceLocator für alle Card-Operationen
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
				resource: ['card'],
			},
		},
	},

	// Stack-ID als resourceLocator für alle Card-Operationen
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
				resource: ['card'],
			},
		},
	},

	// Card-ID als resourceLocator für get, update, delete, assignUser, unassignUser
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
				resource: ['card'],
				operation: ['get', 'update', 'delete', 'assignUser', 'unassignUser'],
			},
		},
	},

	// Titel für create
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel der neuen Karte',
	},

	// Beschreibung für create (optional)
	{
		displayName: 'Beschreibung',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Die Beschreibung der neuen Karte (optional)',
	},

	// Typ für create (optional)
	{
		displayName: 'Typ',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Standard',
				value: 'plain',
			},
			{
				name: 'Markdown',
				value: 'markdown',
			},
		],
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: 'plain',
		description: 'Der Typ der Karte',
	},

	// Reihenfolge für create (optional)
	{
		displayName: 'Reihenfolge',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Die Position der Karte im Stack (optional, 0 = am Ende)',
	},

	// Fälligkeitsdatum für create (optional)
	{
		displayName: 'Fälligkeitsdatum',
		name: 'duedate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Das Fälligkeitsdatum der Karte (optional)',
	},

	// Benutzer zuweisen für create (optional)
	{
		displayName: 'Benutzer zuweisen',
		name: 'assignUser',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: false,
		description: 'Optional: Weisen Sie direkt einen Benutzer zu dieser neuen Karte zu',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Benutzer-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-zA-Z0-9._@-]+$',
							errorMessage: 'Bitte eine gültige Benutzer-ID eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
	},

	// Labels zuweisen für create (optional)
	{
		displayName: 'Labels zuweisen',
		name: 'assignLabels',
		type: 'multiOptions',
		default: [],
		required: false,
		description: 'Optional: Weisen Sie direkt Labels zu dieser neuen Karte zu',
		typeOptions: {
			loadOptionsMethod: 'getLabels',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
	},

	// Felder für update
	{
		displayName: 'Neuer Titel',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel der Karte (leer lassen wenn nicht ändern)',
	},

	{
		displayName: 'Neue Beschreibung',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neue Beschreibung der Karte (leer lassen wenn nicht ändern)',
	},

	{
		displayName: 'Neuer Typ',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Keine Änderung',
				value: '',
			},
			{
				name: 'Standard',
				value: 'plain',
			},
			{
				name: 'Markdown',
				value: 'markdown',
			},
		],
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Typ der Karte',
	},

	{
		displayName: 'Neue Reihenfolge',
		name: 'order',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: 0,
		description: 'Die neue Position der Karte im Stack (0 = nicht ändern)',
	},

	{
		displayName: 'Neues Fälligkeitsdatum',
		name: 'duedate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Das neue Fälligkeitsdatum der Karte (leer lassen wenn nicht ändern)',
	},

	// Benutzer zuweisen für update (optional)
	{
		displayName: 'Benutzer zuweisen',
		name: 'assignUser',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: false,
		description: 'Optional: Weisen Sie einen zusätzlichen Benutzer zu dieser Karte zu',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Benutzer-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-zA-Z0-9._@-]+$',
							errorMessage: 'Bitte eine gültige Benutzer-ID eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
	},

	// Labels zuweisen für update (optional)
	{
		displayName: 'Labels zuweisen',
		name: 'assignLabels',
		type: 'multiOptions',
		default: [],
		required: false,
		description: 'Optional: Weisen Sie zusätzliche Labels zu dieser Karte zu',
		typeOptions: {
			loadOptionsMethod: 'getLabels',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
	},

	// Benutzer-ID für assignUser und unassignUser
	{
		displayName: 'Benutzer',
		name: 'userId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie einen Benutzer aus der Liste oder geben Sie dessen ID an',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Benutzer-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-zA-Z0-9._@-]+$',
							errorMessage: 'Bitte eine gültige Benutzer-ID eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['assignUser', 'unassignUser'],
			},
		},
	},
]; 