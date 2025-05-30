import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

// Importe der Aktionen
import * as boardActions from './actions/board';
import * as stackActions from './actions/stack';
import { IBoardUpdate } from './interfaces/board';
import { IStackUpdate } from './interfaces/stack';

// Beschreibungen importieren
import {
	resources,
	boardOperations,
	boardFields,
	stackOperations,
	stackFields,
	cardOperations,
	cardFields,
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
			// Ressource: Board, Stack oder Card
			...resources,

			// Board-Operationen
			...boardOperations,

			// Stack-Operationen
			...stackOperations,

			// Card-Operationen
			...cardOperations,

			// Feld-Definitionen
			...boardFields,
			...stackFields,
			...cardFields,
		],
	};

	methods = {
		loadOptions: {
			async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const boards = await boardActions.getBoards.call(this);
					if (!boards || boards.length === 0) {
						return [{ name: 'Keine Boards gefunden', value: '' }];
					}
					return boards.map((board) => ({
						name: board.title,
						value: board.id?.toString() || '',
					}));
				} catch (_error) {
					return [{ name: 'Fehler beim Laden der Boards', value: '' }];
				}
			},
			async getStacks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const boardIdString = this.getCurrentNodeParameter('boardId') as string;
					if (!boardIdString) {
						return [{ name: 'Bitte wählen Sie zuerst ein Board', value: '' }];
					}
					
					const boardId = parseInt(boardIdString, 10);
					if (isNaN(boardId)) {
						return [{ name: 'Ungültige Board-ID', value: '' }];
					}
					
					const stacks = await stackActions.getStacks.call(this, boardId);
					if (!stacks || stacks.length === 0) {
						return [{ name: 'Keine Stacks gefunden', value: '' }];
					}
					return stacks.map((stack) => ({
						name: stack.title,
						value: stack.id?.toString() || '',
					}));
				} catch (_error) {
					return [{ name: 'Fehler beim Laden der Stacks', value: '' }];
				}
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
				if (resource === 'board') {
					// Board-Operationen
					if (operation === 'getAll') {
						const boards = await boardActions.getBoards.call(this);
						returnData.push({
							success: true,
							operation: 'getAll',
							resource: 'board',
							data: { boards },
						});
					} else if (operation === 'get') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const board = await boardActions.getBoard.call(this, boardId);
						returnData.push({
							success: true,
							operation: 'get',
							resource: 'board',
							data: { board },
						});
					} else if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const color = this.getNodeParameter('color', i) as string;
						
						const boardData = { title, color };
						const board = await boardActions.createBoard.call(this, boardData);
						returnData.push({
							success: true,
							operation: 'create',
							resource: 'board',
							message: 'Board erfolgreich erstellt',
							data: { board },
						});
					} else if (operation === 'update') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const title = this.getNodeParameter('title', i, '') as string;
						const color = this.getNodeParameter('color', i, '') as string;
						
						const boardData: IBoardUpdate = { id: boardId };
						if (title) boardData.title = title;
						if (color) boardData.color = color;
						
						const board = await boardActions.updateBoard.call(this, boardData);
						returnData.push({
							success: true,
							operation: 'update',
							resource: 'board',
							message: 'Board erfolgreich aktualisiert',
							data: { board },
						});
					} else if (operation === 'delete') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const response = await boardActions.deleteBoard.call(this, boardId);
						returnData.push({
							success: true,
							operation: 'delete',
							resource: 'board',
							message: 'Board erfolgreich gelöscht',
							data: response,
						});
					}
				} else if (resource === 'stack') {
					// Stack-Operationen
					if (operation === 'getAll') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const stacks = await stackActions.getStacks.call(this, boardId);
						returnData.push({
							success: true,
							operation: 'getAll',
							resource: 'stack',
							data: { stacks },
						});
					} else if (operation === 'get') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const stackId = parseInt(this.getNodeParameter('stackId', i) as string, 10);
						const stack = await stackActions.getStack.call(this, boardId, stackId);
						returnData.push({
							success: true,
							operation: 'get',
							resource: 'stack',
							data: { stack },
						});
					} else if (operation === 'create') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const title = this.getNodeParameter('title', i) as string;
						const order = this.getNodeParameter('order', i, 0) as number;
						
						const stackData = { title, boardId, order };
						const stack = await stackActions.createStack.call(this, boardId, stackData);
						returnData.push({
							success: true,
							operation: 'create',
							resource: 'stack',
							message: 'Stack erfolgreich erstellt',
							data: { stack },
						});
					} else if (operation === 'update') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const stackId = parseInt(this.getNodeParameter('stackId', i) as string, 10);
						const title = this.getNodeParameter('title', i, '') as string;
						const order = this.getNodeParameter('order', i, undefined) as number | undefined;
						
						const stackData: IStackUpdate = { id: stackId, boardId };
						if (title) stackData.title = title;
						if (order !== undefined && order > 0) stackData.order = order;
						
						const stack = await stackActions.updateStack.call(this, boardId, stackData);
						returnData.push({
							success: true,
							operation: 'update',
							resource: 'stack',
							message: 'Stack erfolgreich aktualisiert',
							data: { stack },
						});
					} else if (operation === 'delete') {
						const boardId = parseInt(this.getNodeParameter('boardId', i) as string, 10);
						const stackId = parseInt(this.getNodeParameter('stackId', i) as string, 10);
						const response = await stackActions.deleteStack.call(this, boardId, stackId);
						returnData.push({
							success: true,
							operation: 'delete',
							resource: 'stack',
							message: 'Stack erfolgreich gelöscht',
							data: response,
						});
					}
				} else if (resource === 'card') {
					// Card-Operationen (Platzhalter)
					if (operation === 'getAll') {
						returnData.push({
							success: false,
							message: 'Card-Operationen sind noch nicht implementiert',
						});
					}
				}
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