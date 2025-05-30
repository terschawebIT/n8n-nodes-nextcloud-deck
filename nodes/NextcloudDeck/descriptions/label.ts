import { INodeProperties } from 'n8n-workflow';

export const labelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['label'],
			},
		},
		options: [
			{
				name: 'Alle Labels Abrufen',
				value: 'getAll',
				description: 'Alle Labels eines Boards abrufen',
				action: 'Alle Labels abrufen',
			},
			{
				name: 'Label Abrufen',
				value: 'get',
				description: 'Ein spezifisches Label abrufen',
				action: 'Label abrufen',
			},
			{
				name: 'Label Erstellen',
				value: 'create',
				description: 'Ein neues Label erstellen',
				action: 'Label erstellen',
			},
			{
				name: 'Label Aktualisieren',
				value: 'update',
				description: 'Ein Label aktualisieren',
				action: 'Label aktualisieren',
			},
			{
				name: 'Label Löschen',
				value: 'delete',
				description: 'Ein Label löschen',
				action: 'Label löschen',
			},
			{
				name: 'Label zu Karte zuweisen',
				value: 'assignToCard',
				description: 'Ein Label zu einer Karte zuweisen',
				action: 'Label zu Karte zuweisen',
			},
			{
				name: 'Label von Karte entfernen',
				value: 'removeFromCard',
				description: 'Ein Label von einer Karte entfernen',
				action: 'Label von Karte entfernen',
			},
		],
		default: 'getAll',
	},
];

export const labelFields: INodeProperties[] = [
	// Board-ID als resourceLocator für alle Label-Operationen
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
				resource: ['label'],
			},
		},
	},

	// Label-ID als resourceLocator für get, update, delete, assignToCard, removeFromCard
	{
		displayName: 'Label',
		name: 'labelId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Wählen Sie ein Label aus der Liste oder geben Sie dessen ID an',
		modes: [
			{
				displayName: 'Liste',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getLabels',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Label-ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Bitte eine gültige Label-ID (Zahl) eingeben',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['get', 'update', 'delete', 'assignToCard', 'removeFromCard'],
			},
		},
	},

	// Titel für create und update
	{
		displayName: 'Titel',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Der Titel des neuen Labels',
	},

	{
		displayName: 'Neuer Titel',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Der neue Titel des Labels (leer lassen wenn nicht ändern)',
	},

	// Farbe für create und update
	{
		displayName: 'Farbe',
		name: 'color',
		type: 'color',
		required: true,
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['create'],
			},
		},
		default: '#FF0000',
		description: 'Die Farbe des neuen Labels (Hexadezimal)',
	},

	{
		displayName: 'Neue Farbe',
		name: 'color',
		type: 'color',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Die neue Farbe des Labels (leer lassen wenn nicht ändern)',
	},

	// Stack-ID und Card-ID für assignToCard und removeFromCard
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
				resource: ['label'],
				operation: ['assignToCard', 'removeFromCard'],
			},
		},
	},

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
				resource: ['label'],
				operation: ['assignToCard', 'removeFromCard'],
			},
		},
	},
]; 