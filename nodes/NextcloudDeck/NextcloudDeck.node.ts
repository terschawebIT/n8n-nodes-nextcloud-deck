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

// Importe der Aktionen
import * as boardActions from './actions/board';
import * as stackActions from './actions/stack';
import * as cardActions from './actions/card';
import { IBoardUpdate } from './interfaces/board';
import { IStackUpdate } from './interfaces/stack';
import { ICardUpdate } from './interfaces/card';

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

import { nextcloudShareeApiRequest, nextcloudOcsUsersApiRequest } from './helpers/api';

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
		listSearch: {
			async getBoards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const boards = await boardActions.getBoards.call(this);
					if (!boards || boards.length === 0) {
						return { results: [{ name: 'Keine Boards gefunden', value: '' }] };
					}
					
					let filteredBoards = boards;
					if (filter && filter.trim().length > 0) {
						const normalized = filter.toLowerCase();
						filteredBoards = boards.filter(board => 
							board.title.toLowerCase().includes(normalized)
						);
					}
					
					return {
						results: filteredBoards.map((board) => ({
							name: board.title,
							value: board.id?.toString() || '',
						}))
					};
				} catch (_error) {
					return { results: [{ name: 'Fehler beim Laden der Boards', value: '' }] };
				}
			},
			async getStacks(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					// Holen der Board-ID aus resourceLocator
					const boardParam = this.getCurrentNodeParameter('boardId');
					let boardId: number;
					
					if (typeof boardParam === 'object' && boardParam !== null) {
						const boardResourceLocator = boardParam as { mode: string; value: string };
						boardId = parseInt(boardResourceLocator.value, 10);
					} else {
						boardId = parseInt(boardParam as string, 10);
					}
					
					if (!boardId || isNaN(boardId)) {
						return { results: [{ name: 'Bitte wählen Sie zuerst ein Board', value: '' }] };
					}
					
					const stacks = await stackActions.getStacks.call(this, boardId);
					if (!stacks || stacks.length === 0) {
						return { results: [{ name: 'Keine Stacks gefunden', value: '' }] };
					}
					
					let filteredStacks = stacks;
					if (filter && filter.trim().length > 0) {
						const normalized = filter.toLowerCase();
						filteredStacks = stacks.filter(stack => 
							stack.title.toLowerCase().includes(normalized)
						);
					}
					
					return {
						results: filteredStacks.map((stack) => ({
							name: stack.title,
							value: stack.id?.toString() || '',
						}))
					};
				} catch (_error) {
					return { results: [{ name: 'Fehler beim Laden der Stacks', value: '' }] };
				}
			},
			async getCards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					// Holen der Board-ID und Stack-ID aus resourceLocator
					const boardParam = this.getCurrentNodeParameter('boardId');
					const stackParam = this.getCurrentNodeParameter('stackId');
					
					let boardId: number;
					let stackId: number;
					
					if (typeof boardParam === 'object' && boardParam !== null) {
						const boardResourceLocator = boardParam as { mode: string; value: string };
						boardId = parseInt(boardResourceLocator.value, 10);
					} else {
						boardId = parseInt(boardParam as string, 10);
					}
					
					if (typeof stackParam === 'object' && stackParam !== null) {
						const stackResourceLocator = stackParam as { mode: string; value: string };
						stackId = parseInt(stackResourceLocator.value, 10);
					} else {
						stackId = parseInt(stackParam as string, 10);
					}
					
					if (!boardId || isNaN(boardId) || !stackId || isNaN(stackId)) {
						return { results: [{ name: 'Bitte wählen Sie zuerst Board und Stack', value: '' }] };
					}
					
					const cards = await cardActions.getCards.call(this, boardId, stackId);
					if (!cards || cards.length === 0) {
						return { results: [{ name: 'Keine Karten gefunden', value: '' }] };
					}
					
					let filteredCards = cards;
					if (filter && filter.trim().length > 0) {
						const normalized = filter.toLowerCase();
						filteredCards = cards.filter(card => 
							card.title.toLowerCase().includes(normalized)
						);
					}
					
					return {
						results: filteredCards.map((card) => ({
							name: card.title,
							value: card.id?.toString() || '',
						}))
					};
				} catch (_error) {
					return { results: [{ name: 'Fehler beim Laden der Karten', value: '' }] };
				}
			},
			async getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const credentials = await this.getCredentials('nextcloudDeckApi');
					const currentUser = credentials.username as string;
					const results: Array<{ name: string; value: string }> = [];
					
					// Füge den aktuellen Benutzer immer als ersten Eintrag hinzu
					const currentUserDisplayName = `${currentUser} (Sie selbst)`;
					results.push({ name: currentUserDisplayName, value: currentUser });
					
					try {
						// Verwende den Sharee-Endpunkt, um weitere Benutzer zu suchen
						const searchTerm = filter || '';
						const endpoint = `/sharees?search=${encodeURIComponent(searchTerm)}&itemType=0&perPage=50`;
						
						const response = await nextcloudShareeApiRequest.call(this, 'GET', endpoint);
						const shareeData = response as { users?: Array<{ value: { shareWith: string; shareWithDisplayName: string } }> };
						
						if (shareeData.users && shareeData.users.length > 0) {
							// Füge Sharee-Benutzer hinzu (aber nicht den aktuellen Benutzer doppelt)
							for (const user of shareeData.users) {
								if (user.value.shareWith !== currentUser) {
									results.push({
										name: user.value.shareWithDisplayName || user.value.shareWith,
										value: user.value.shareWith,
									});
								}
							}
						}
					} catch (shareeError) {
						// Fallback: Verwende OCS Users API, wenn Sharee API fehlschlägt
						try {
							const usersResponse = await nextcloudOcsUsersApiRequest.call(this, 'GET', '/users');
							const usersData = usersResponse as { users?: string[] };
							
							if (usersData.users && usersData.users.length > 0) {
								// Füge alle Benutzer hinzu (aber nicht den aktuellen Benutzer doppelt)
								for (const userId of usersData.users) {
									if (userId !== currentUser) {
										// Filter anwenden, wenn angegeben
										if (!filter || userId.toLowerCase().includes(filter.toLowerCase())) {
											results.push({
												name: userId,
												value: userId,
											});
										}
									}
								}
							}
						} catch (usersError) {
							// Wenn beide APIs fehlschlagen, zeige nur den aktuellen Benutzer
							console.warn('Benutzersuche fehlgeschlagen:', usersError);
						}
					}
					
					// Entferne Duplikate und begrenze auf 50 Ergebnisse
					const uniqueResults = results.filter((result, index, self) => 
						index === self.findIndex(r => r.value === result.value)
					).slice(0, 50);
					
					return { results: uniqueResults };
				} catch (_error) {
					return { results: [{ name: 'Fehler beim Laden der Benutzer', value: '' }] };
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Hilfsfunktion zum Extrahieren von resourceLocator-Werten
		const getResourceId = (resourceParam: unknown): number => {
			if (typeof resourceParam === 'object' && resourceParam !== null) {
				const resourceLocator = resourceParam as { mode: string; value: string };
				return parseInt(resourceLocator.value, 10);
			}
			return parseInt(resourceParam as string, 10);
		};

		// Hilfsfunktion zum Extrahieren von resourceLocator-Werten als String
		const getResourceString = (resourceParam: unknown): string => {
			if (typeof resourceParam === 'object' && resourceParam !== null) {
				const resourceLocator = resourceParam as { mode: string; value: string };
				return resourceLocator.value;
			}
			return resourceParam as string;
		};

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
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
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
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
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
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
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
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stacks = await stackActions.getStacks.call(this, boardId);
						returnData.push({
							success: true,
							operation: 'getAll',
							resource: 'stack',
							data: { stacks },
						});
					} else if (operation === 'get') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const stack = await stackActions.getStack.call(this, boardId, stackId);
						returnData.push({
							success: true,
							operation: 'get',
							resource: 'stack',
							data: { stack },
						});
					} else if (operation === 'create') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
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
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const title = this.getNodeParameter('title', i, '') as string;
						const order = this.getNodeParameter('order', i, 0) as number;
						
						// Wenn order = 0, holen wir die aktuelle Reihenfolge
						let finalOrder = order;
						if (order === 0) {
							const currentStack = await stackActions.getStack.call(this, boardId, stackId);
							finalOrder = currentStack.order || 0;
						}
						
						const stackData: IStackUpdate = { id: stackId, boardId, order: finalOrder };
						if (title) stackData.title = title;
						
						const stack = await stackActions.updateStack.call(this, boardId, stackData);
						returnData.push({
							success: true,
							operation: 'update',
							resource: 'stack',
							message: 'Stack erfolgreich aktualisiert',
							data: { stack },
						});
					} else if (operation === 'delete') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
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
					// Card-Operationen
					if (operation === 'getAll') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cards = await cardActions.getCards.call(this, boardId, stackId);
						returnData.push({
							success: true,
							operation: 'getAll',
							resource: 'card',
							message: `${cards.length} Karten im Stack gefunden`,
							data: { cards, boardId, stackId },
						});
					} else if (operation === 'get') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cardId = getResourceId(this.getNodeParameter('cardId', i));
						const card = await cardActions.getCard.call(this, boardId, stackId, cardId);
						returnData.push({
							success: true,
							operation: 'get',
							resource: 'card',
							data: { card },
						});
					} else if (operation === 'create') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const title = this.getNodeParameter('title', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const type = this.getNodeParameter('type', i, 'plain') as string;
						const order = this.getNodeParameter('order', i, 0) as number;
						const duedate = this.getNodeParameter('duedate', i, '') as string;
						
						const cardData: { title: string; type?: string; order?: number; description?: string; duedate?: string } = { title };
						if (description) cardData.description = description;
						if (type && type !== 'plain') cardData.type = type;
						if (order > 0) cardData.order = order;
						if (duedate) cardData.duedate = duedate;
						
						const card = await cardActions.createCard.call(this, boardId, stackId, cardData);
						returnData.push({
							success: true,
							operation: 'create',
							resource: 'card',
							message: 'Karte erfolgreich erstellt',
							data: { card },
						});
					} else if (operation === 'update') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cardId = getResourceId(this.getNodeParameter('cardId', i));
						const title = this.getNodeParameter('title', i, '') as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const type = this.getNodeParameter('type', i, '') as string;
						const order = this.getNodeParameter('order', i, 0) as number;
						const duedate = this.getNodeParameter('duedate', i, '') as string;
						
						// Wenn order = 0, holen wir die aktuelle Reihenfolge
						let finalOrder = order;
						if (order === 0) {
							const currentCard = await cardActions.getCard.call(this, boardId, stackId, cardId);
							finalOrder = currentCard.order || 0;
						}
						
						const cardData: ICardUpdate = { id: cardId, order: finalOrder };
						if (title) cardData.title = title;
						if (description) cardData.description = description;
						if (type) cardData.type = type;
						if (duedate) cardData.duedate = duedate;
						
						const card = await cardActions.updateCard.call(this, boardId, stackId, cardData);
						returnData.push({
							success: true,
							operation: 'update',
							resource: 'card',
							message: 'Karte erfolgreich aktualisiert',
							data: { card },
						});
					} else if (operation === 'delete') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cardId = getResourceId(this.getNodeParameter('cardId', i));
						const response = await cardActions.deleteCard.call(this, boardId, stackId, cardId);
						returnData.push({
							success: true,
							operation: 'delete',
							resource: 'card',
							message: 'Karte erfolgreich gelöscht',
							data: response,
						});
					} else if (operation === 'assignUser') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cardId = getResourceId(this.getNodeParameter('cardId', i));
						const userId = getResourceString(this.getNodeParameter('userId', i));
						const response = await cardActions.assignUserToCard.call(this, boardId, stackId, cardId, userId);
						returnData.push({
							success: true,
							operation: 'assignUser',
							resource: 'card',
							message: 'Benutzer erfolgreich zugewiesen',
							data: response,
						});
					} else if (operation === 'unassignUser') {
						const boardId = getResourceId(this.getNodeParameter('boardId', i));
						const stackId = getResourceId(this.getNodeParameter('stackId', i));
						const cardId = getResourceId(this.getNodeParameter('cardId', i));
						const userId = getResourceString(this.getNodeParameter('userId', i));
						const response = await cardActions.unassignUserFromCard.call(this, boardId, stackId, cardId, userId);
						returnData.push({
							success: true,
							operation: 'unassignUser',
							resource: 'card',
							message: 'Benutzer erfolgreich entfernt',
							data: response,
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