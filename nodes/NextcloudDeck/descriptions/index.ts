import { INodeProperties } from 'n8n-workflow';
import { boardOperations, boardFields } from './board';
import { stackOperations, stackFields } from './stack';
import { cardOperations, cardFields } from './card';
import { labelOperations, labelFields } from './label';
import { commentOperations, commentFields } from './comment';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Board',
			value: 'board',
			description: 'Arbeiten mit Boards (Kanban-Boards)',
		},
		{
			name: 'Stack',
			value: 'stack',
			description: 'Arbeiten mit Stacks (Spalten)',
		},
		{
			name: 'Card',
			value: 'card',
			description: 'Arbeiten mit Karten',
		},
		{
			name: 'Label',
			value: 'label',
			description: 'Arbeiten mit Labels (Tags)',
		},
		{
			name: 'Comment',
			value: 'comment',
			description: 'Arbeiten mit Kommentaren',
		},
	],
	default: 'board',
};

export const nodeProperties: INodeProperties[] = [
	resourceOptions,
	...boardOperations,
	...stackOperations,
	...cardOperations,
	...labelOperations,
	...commentOperations,
	...boardFields,
	...stackFields,
	...cardFields,
	...labelFields,
	...commentFields,
];

// Export aller Operationen und Felder
export { boardOperations, boardFields };
export { stackOperations, stackFields };
export { cardOperations, cardFields };
export { labelOperations, labelFields }; 