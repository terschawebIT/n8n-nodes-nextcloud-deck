import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeListSearchResult,
} from 'n8n-workflow';

// Modulare Handler importieren
import { BoardHandler, StackHandler, CardHandler, CommentHandler, AttachmentHandler } from './handlers/resource.handlers';
import { NodeLoadOptions, NodeListSearch } from './helpers/node.methods';

// Beschreibungen importieren
import { boardOperations, boardFields } from './descriptions/board';
import { stackOperations, stackFields } from './descriptions/stack';
import { cardOperations, cardFields } from './descriptions/card';
import { commentOperations, commentFields } from './descriptions/comment';
import { attachmentOperations, attachmentFields } from './descriptions/attachment';

export class NextcloudDeck implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nextcloud Deck',
		name: 'nextcloudDeck',
		icon: 'file:nextcloud-deck.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Verwalten Sie Ihre Nextcloud Deck-Boards, Stacks, Karten und mehr',
		defaults: {
			name: 'Nextcloud Deck',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'nextcloudDeckApi',
				required: true,
			},
		],
		usableAsTool: true,
		// @ts-expect-error: aiEnabled ist kein Standardfeld, wird aber von n8n AI genutzt
		aiEnabled: true,
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Board',
						value: 'board',
						description: 'Operationen mit Deck-Boards',
					},
					{
						name: 'Stack',
						value: 'stack',
						description: 'Operationen mit Deck-Stacks',
					},
					{
						name: 'Karte',
						value: 'card',
						description: 'Operationen mit Deck-Karten',
					},
					{
						name: 'Kommentar',
						value: 'comment',
						description: 'Operationen mit Karten-Kommentaren',
					},
					{
						name: 'Anhang',
						value: 'attachment',
						description: 'Operationen mit Karten-Anhängen',
					},
				],
				default: 'board',
				description: 'Die Ressource für diese Operation',
			},
			// Operationen und Felder
			...boardOperations,
			...boardFields,
			...stackOperations,
			...stackFields,
			...cardOperations,
			...cardFields,
			...commentOperations,
			...commentFields,
			...attachmentOperations,
			...attachmentFields,
		],
	};

	methods = {
		loadOptions: {
			async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getBoards.call(this);
			},
			async getStacks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getStacks.call(this);
			},
			async getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return NodeLoadOptions.getLabels.call(this);
			},
		},
		listSearch: {
			async getBoards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return NodeListSearch.getBoards.call(this, filter);
			},
			async getStacks(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return NodeListSearch.getStacks.call(this, filter);
			},
			async getCards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return NodeListSearch.getCards.call(this, filter);
			},
			async getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return NodeListSearch.getUsers.call(this, filter);
			},
			async getLabels(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return NodeListSearch.getLabels.call(this, filter);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let result;
				switch (resource) {
					case 'board':
						result = await BoardHandler.execute.call(this, operation, i);
						break;
					case 'stack':
						result = await StackHandler.execute.call(this, operation, i);
						break;
					case 'card':
						result = await CardHandler.execute.call(this, operation, i);
						break;
					case 'comment':
						result = await CommentHandler.execute.call(this, operation, i);
						break;
					case 'attachment':
						result = await AttachmentHandler.execute.call(this, operation, i);
						break;
					default:
						throw new Error(`Unbekannte Ressource: ${resource}`);
				}

				returnData.push({ json: result });
			} catch (error) {
				const nodeError = error as Error;
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: nodeError.message },
					});
				} else {
					throw error;
				}
			}
		}

		return this.prepareOutputData(returnData);
	}
} 