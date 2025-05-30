import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
	INodeListSearchResult,
} from 'n8n-workflow';

// Modulare Handler importieren
import { BoardHandler, StackHandler, CardHandler, LabelHandler } from './handlers/resource.handlers';
import { NodeLoadOptions, NodeListSearch } from './helpers/node.methods';

// Beschreibungen importieren
import {
	resources,
	boardOperations,
	boardFields,
	stackOperations,
	stackFields,
	cardOperations,
	cardFields,
	labelOperations,
	labelFields,
} from './descriptions';

export class NextcloudDeck implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nextcloud Deck',
		name: 'nextcloudDeck',
		icon: 'file:nextcloud-deck.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Verwalten Sie Ihre Nextcloud Deck Boards, Stacks und Karten',
		defaults: {
			name: 'Nextcloud Deck',
		},
		inputs: [{ type: NodeConnectionType.Main }],
		outputs: [{ type: NodeConnectionType.Main }],
		credentials: [
			{
				name: 'nextcloudDeckApi',
				required: true,
				displayName: 'Nextcloud Deck API',
			},
		],
		properties: [
			// Ressource: Board, Stack, Card oder Label
			...resources,

			// Operationen
			...boardOperations,
			...stackOperations,
			...cardOperations,
			...labelOperations,

			// Feld-Definitionen
			...boardFields,
			...stackFields,
			...cardFields,
			...labelFields,
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
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject;

				// Delegiere an entsprechende Handler
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
					case 'label':
						result = await LabelHandler.execute.call(this, operation, i);
						break;
					default:
						throw new Error(`Unbekannte Ressource: ${resource}`);
				}

				returnData.push(result);
			} catch (error: unknown) {
				const nodeError = error as Error;
				if (this.continueOnFail()) {
					returnData.push({
						success: false,
						error: nodeError.message || 'Unbekannter Fehler',
						operation,
						resource,
					});
				} else {
					throw error;
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
} 