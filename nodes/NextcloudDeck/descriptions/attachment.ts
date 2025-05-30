import { INodeProperties } from 'n8n-workflow';

export const attachmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['attachment'],
			},
		},
		options: [
			{
				name: 'Alle Anhänge Abrufen',
				value: 'getAll',
				description: 'Alle Anhänge einer Karte abrufen',
				action: 'Alle Anhänge abrufen',
			},
			{
				name: 'Anhang Abrufen',
				value: 'get',
				description: 'Einen spezifischen Anhang abrufen',
				action: 'Anhang abrufen',
			},
			{
				name: 'Anhang Erstellen',
				value: 'create',
				description: 'Einen neuen Anhang zu einer Karte hinzufügen',
				action: 'Anhang erstellen',
			},
			{
				name: 'Anhang Aktualisieren',
				value: 'update',
				description: 'Einen Anhang aktualisieren',
				action: 'Anhang aktualisieren',
			},
			{
				name: 'Anhang Löschen',
				value: 'delete',
				description: 'Einen Anhang löschen',
				action: 'Anhang löschen',
			},
		],
		default: 'getAll',
	},
];

export const attachmentFields: INodeProperties[] = [
	// Board-ID als resourceLocator für alle Attachment-Operationen
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
				resource: ['attachment'],
			},
		},
	},

	// Stack-ID als resourceLocator für alle Attachment-Operationen
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
				resource: ['attachment'],
			},
		},
	},

	// Card-ID als resourceLocator für alle Attachment-Operationen
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
				resource: ['attachment'],
			},
		},
	},

	// Attachment-ID für get, update, delete
	{
		displayName: 'Anhang-ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachment'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'Die ID des Anhangs',
		placeholder: 'z.B. 123',
	},

	// Typ für create
	{
		displayName: 'Anhang-Typ',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachment'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Deck-Datei',
				value: 'deck_file',
				description: 'Datei, die innerhalb der Deck-App gespeichert wird',
			},
			{
				name: 'Nextcloud-Datei',
				value: 'file',
				description: 'Datei aus der regulären Nextcloud-Dateiverwaltung',
			},
		],
		default: 'file',
		description: 'Der Typ des Anhangs',
	},

	// Daten für create
	{
		displayName: 'Daten',
		name: 'data',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Dateipfad oder Dateiinhalt für den Anhang',
		placeholder: 'z.B. /path/to/file.pdf oder file-content',
	},

	// Daten für update (optional)
	{
		displayName: 'Neue Daten',
		name: 'data',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['attachment'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neuen Daten für den Anhang (optional)',
		placeholder: 'z.B. /path/to/updated-file.pdf',
	},
]; 