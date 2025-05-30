import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
} from 'n8n-workflow';
import * as boardActions from '../actions/board';
import * as stackActions from '../actions/stack';
import * as cardActions from '../actions/card';
import { nextcloudShareeApiRequest, nextcloudOcsUsersApiRequest } from './api';

export class NodeLoadOptions {
	static async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
	}

	static async getStacks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
	}

	static async getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Holen der Board-ID aus resourceLocator mit ausführlichem Debugging
			const boardParam = this.getCurrentNodeParameter('boardId');
			console.log('boardParam:', JSON.stringify(boardParam, null, 2));
			
			let boardId: number;
			
			if (typeof boardParam === 'object' && boardParam !== null) {
				const boardResourceLocator = boardParam as { mode: string; value: string };
				console.log('resourceLocator mode:', boardResourceLocator.mode);
				console.log('resourceLocator value:', boardResourceLocator.value);
				boardId = parseInt(boardResourceLocator.value, 10);
			} else {
				console.log('boardParam as string:', boardParam);
				boardId = parseInt(boardParam as string, 10);
			}
			
			console.log('Final boardId:', boardId);
			
			if (!boardId || isNaN(boardId)) {
				console.log('Board-ID ist ungültig oder nicht gesetzt');
				return [{ name: 'Bitte wählen Sie zuerst ein Board', value: '' }];
			}
			
			const labels = await boardActions.getLabels.call(this, boardId);
			if (!labels || labels.length === 0) {
				return [{ name: 'Keine Labels gefunden', value: '' }];
			}
			return labels.map((label) => ({
				name: label.title,
				value: label.id?.toString() || '',
			}));
		} catch (error) {
			console.error('Fehler in getLabels:', error);
			return [{ name: 'Fehler beim Laden der Labels', value: '' }];
		}
	}
}

export class NodeListSearch {
	static async getBoards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
	}

	static async getStacks(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
	}

	static async getCards(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
	}

	static async getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
					// Stille Fehlerbehandlung - zeige nur aktuellen Benutzer
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
	}

	static async getLabels(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
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
			
			const labels = await boardActions.getLabels.call(this, boardId);
			if (!labels || labels.length === 0) {
				return { results: [{ name: 'Keine Labels gefunden', value: '' }] };
			}
			
			let filteredLabels = labels;
			if (filter && filter.trim().length > 0) {
				const normalized = filter.toLowerCase();
				filteredLabels = labels.filter(label => 
					label.title.toLowerCase().includes(normalized)
				);
			}
			
			return {
				results: filteredLabels.map((label) => ({
					name: label.title,
					value: label.id?.toString() || '',
				}))
			};
		} catch (_error) {
			return { results: [{ name: 'Fehler beim Laden der Labels', value: '' }] };
		}
	}
} 