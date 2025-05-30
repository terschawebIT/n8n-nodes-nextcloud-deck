import { INodeProperties } from 'n8n-workflow';
import { boardOperations, boardFields } from './board';
import { stackOperations, stackFields } from './stack';

export const resources: INodeProperties[] = [
	{
		displayName: 'Ressource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Board',
				value: 'board',
				description: 'Verwalten Sie Ihre Deck-Boards',
			},
			{
				name: 'Stack',
				value: 'stack',
				description: 'Verwalten Sie Stacks innerhalb von Boards',
			},
			{
				name: 'Card',
				value: 'card',
				description: 'Verwalten Sie Karten innerhalb von Stacks',
			},
		],
		default: 'board',
	},
];

// Export aller Operationen und Felder
export { boardOperations, boardFields };
export { stackOperations, stackFields };

// Temporäre Platzhalter für Card Operationen
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
				name: 'Alle Karten Abrufen',
				value: 'getAll',
				description: 'Alle Karten eines Stacks abrufen',
				action: 'Alle Karten abrufen',
			},
		],
		default: 'getAll',
	},
];

export const cardFields: INodeProperties[] = []; 