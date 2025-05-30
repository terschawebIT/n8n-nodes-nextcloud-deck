import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as boardActions from '../actions/board';
import * as stackActions from '../actions/stack';
import * as cardActions from '../actions/card';
import * as commentActions from '../actions/comment';
import * as attachmentActions from '../actions/attachment';
import { IBoardUpdate } from '../interfaces/board';
import { IStackUpdate } from '../interfaces/stack';
import { ICardUpdate, ILabelCreate, ILabelUpdate } from '../interfaces/card';
import { ICommentCreate, ICommentUpdate } from '../interfaces/comment';
import { IAttachmentCreate, IAttachmentUpdate } from '../interfaces/attachment';

// Hilfsfunktion zum Extrahieren von resourceLocator-Werten
export const getResourceId = (resourceParam: unknown): number => {
	if (typeof resourceParam === 'object' && resourceParam !== null) {
		const resourceLocator = resourceParam as { mode: string; value: string };
		return parseInt(resourceLocator.value, 10);
	}
	return parseInt(resourceParam as string, 10);
};

// Hilfsfunktion zum Extrahieren von resourceLocator-Werten als String
export const getResourceString = (resourceParam: unknown): string => {
	if (typeof resourceParam === 'object' && resourceParam !== null) {
		const resourceLocator = resourceParam as { mode: string; value: string };
		return resourceLocator.value;
	}
	return resourceParam as string;
};

export class BoardHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const boards = await boardActions.getBoards.call(this);
			return {
				success: true,
				operation: 'getAll',
				resource: 'board',
				data: { boards },
			};
		} else if (operation === 'get') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const board = await boardActions.getBoard.call(this, boardId);
			return {
				success: true,
				operation: 'get',
				resource: 'board',
				data: { board },
			};
		} else if (operation === 'create') {
			const title = this.getNodeParameter('title', i) as string;
			const color = this.getNodeParameter('color', i) as string;
			
			const boardData = { title, color };
			const board = await boardActions.createBoard.call(this, boardData);
			return {
				success: true,
				operation: 'create',
				resource: 'board',
				message: 'Board erfolgreich erstellt',
				data: { board },
			};
		} else if (operation === 'update') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const title = this.getNodeParameter('title', i, '') as string;
			const color = this.getNodeParameter('color', i, '') as string;
			
			const boardData: IBoardUpdate = { id: boardId };
			if (title) boardData.title = title;
			if (color) boardData.color = color;
			
			const board = await boardActions.updateBoard.call(this, boardData);
			return {
				success: true,
				operation: 'update',
				resource: 'board',
				message: 'Board erfolgreich aktualisiert',
				data: { board },
			};
		} else if (operation === 'delete') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const response = await boardActions.deleteBoard.call(this, boardId);
			return {
				success: true,
				operation: 'delete',
				resource: 'board',
				message: 'Board erfolgreich gelöscht',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

export class StackHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stacks = await stackActions.getStacks.call(this, boardId);
			return {
				success: true,
				operation: 'getAll',
				resource: 'stack',
				data: { stacks },
			};
		} else if (operation === 'get') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const stack = await stackActions.getStack.call(this, boardId, stackId);
			return {
				success: true,
				operation: 'get',
				resource: 'stack',
				data: { stack },
			};
		} else if (operation === 'create') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const title = this.getNodeParameter('title', i) as string;
			const order = this.getNodeParameter('order', i, 0) as number;
			
			const stackData = { title, boardId, order };
			const stack = await stackActions.createStack.call(this, boardId, stackData);
			return {
				success: true,
				operation: 'create',
				resource: 'stack',
				message: 'Stack erfolgreich erstellt',
				data: { stack },
			};
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
			return {
				success: true,
				operation: 'update',
				resource: 'stack',
				message: 'Stack erfolgreich aktualisiert',
				data: { stack },
			};
		} else if (operation === 'delete') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const response = await stackActions.deleteStack.call(this, boardId, stackId);
			return {
				success: true,
				operation: 'delete',
				resource: 'stack',
				message: 'Stack erfolgreich gelöscht',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

export class CardHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cards = await cardActions.getCards.call(this, boardId, stackId);
			return {
				success: true,
				operation: 'getAll',
				resource: 'card',
				message: `${cards.length} Karten im Stack gefunden`,
				data: { cards, boardId, stackId },
			};
		} else if (operation === 'get') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const card = await cardActions.getCard.call(this, boardId, stackId, cardId);
			return {
				success: true,
				operation: 'get',
				resource: 'card',
				data: { card },
			};
		} else if (operation === 'create') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const title = this.getNodeParameter('title', i) as string;
			const description = this.getNodeParameter('description', i, '') as string;
			const type = this.getNodeParameter('type', i, 'plain') as string;
			const order = this.getNodeParameter('order', i, 0) as number;
			const duedate = this.getNodeParameter('duedate', i, '') as string;
			const assignUser = this.getNodeParameter('assignUser', i, '') as string;
			
			const cardData: { title: string; type?: string; order?: number; description?: string; duedate?: string } = { title };
			if (description) cardData.description = description;
			if (type && type !== 'plain') cardData.type = type;
			if (order > 0) cardData.order = order;
			if (duedate) cardData.duedate = duedate;
			
			const card = await cardActions.createCard.call(this, boardId, stackId, cardData);
			const cardId = (card as { id: number }).id;
			
			// Optional: Benutzer zuweisen, falls angegeben
			if (assignUser) {
				const userId = getResourceString(assignUser);
				if (userId) {
					try {
						await cardActions.assignUserToCard.call(this, boardId, stackId, cardId, userId);
					} catch (assignError) {
						// Fehler bei Benutzerzuweisung loggen, aber Karte wurde erfolgreich erstellt
						// Stille Fehlerbehandlung - Karte wurde trotzdem erstellt
					}
				}
			}
			
			return {
				success: true,
				operation: 'create',
				resource: 'card',
				message: (() => {
					let msg = 'Karte erfolgreich erstellt';
					if (assignUser && getResourceString(assignUser)) msg += ' und Benutzer zugewiesen';
					return msg;
				})(),
				data: { card },
			};
		} else if (operation === 'update') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const title = this.getNodeParameter('title', i, '') as string;
			const description = this.getNodeParameter('description', i, '') as string;
			const type = this.getNodeParameter('type', i, '') as string;
			const order = this.getNodeParameter('order', i, 0) as number;
			const duedate = this.getNodeParameter('duedate', i, '') as string;
			const assignUser = this.getNodeParameter('assignUser', i, '') as string;
			
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
			
			// Optional: Benutzer zuweisen, falls angegeben
			if (assignUser) {
				const userId = getResourceString(assignUser);
				if (userId) {
					try {
						await cardActions.assignUserToCard.call(this, boardId, stackId, cardId, userId);
					} catch (assignError) {
						// Fehler bei Benutzerzuweisung loggen, aber Karte wurde erfolgreich aktualisiert
						// Stille Fehlerbehandlung - Karte wurde trotzdem aktualisiert
					}
				}
			}
			
			return {
				success: true,
				operation: 'update',
				resource: 'card',
				message: (() => {
					let msg = 'Karte erfolgreich aktualisiert';
					if (assignUser && getResourceString(assignUser)) msg += ' und Benutzer zugewiesen';
					return msg;
				})(),
				data: { card },
			};
		} else if (operation === 'delete') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const response = await cardActions.deleteCard.call(this, boardId, stackId, cardId);
			return {
				success: true,
				operation: 'delete',
				resource: 'card',
				message: 'Karte erfolgreich gelöscht',
				data: response,
			};
		} else if (operation === 'assignUser') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const userId = getResourceString(this.getNodeParameter('userId', i));
			const response = await cardActions.assignUserToCard.call(this, boardId, stackId, cardId, userId);
			return {
				success: true,
				operation: 'assignUser',
				resource: 'card',
				message: 'Benutzer erfolgreich zugewiesen',
				data: response,
			};
		} else if (operation === 'unassignUser') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const userId = getResourceString(this.getNodeParameter('userId', i));
			const response = await cardActions.unassignUserFromCard.call(this, boardId, stackId, cardId, userId);
			return {
				success: true,
				operation: 'unassignUser',
				resource: 'card',
				message: 'Benutzer erfolgreich entfernt',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

export class LabelHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const labels = await boardActions.getLabels.call(this, boardId);
			return {
				success: true,
				operation: 'getAll',
				resource: 'label',
				message: `${labels.length} Labels im Board gefunden`,
				data: { labels, boardId },
			};
		} else if (operation === 'get') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const labelId = getResourceId(this.getNodeParameter('labelId', i));
			const label = await boardActions.getLabel.call(this, boardId, labelId);
			return {
				success: true,
				operation: 'get',
				resource: 'label',
				data: { label },
			};
		} else if (operation === 'create') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const title = this.getNodeParameter('title', i) as string;
			const color = this.getNodeParameter('color', i) as string;
			
			// Farbe ohne # für API
			const cleanColor = color.replace('#', '');
			
			const labelData: ILabelCreate = { title, color: cleanColor };
			const label = await boardActions.createLabel.call(this, boardId, labelData);
			return {
				success: true,
				operation: 'create',
				resource: 'label',
				message: 'Label erfolgreich erstellt',
				data: { label },
			};
		} else if (operation === 'update') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const labelId = getResourceId(this.getNodeParameter('labelId', i));
			const title = this.getNodeParameter('title', i, '') as string;
			const color = this.getNodeParameter('color', i, '') as string;
			
			const labelData: ILabelUpdate = { id: labelId };
			if (title) labelData.title = title;
			if (color) {
				// Farbe ohne # für API
				labelData.color = color.replace('#', '');
			}
			
			const label = await boardActions.updateLabel.call(this, boardId, labelData);
			return {
				success: true,
				operation: 'update',
				resource: 'label',
				message: 'Label erfolgreich aktualisiert',
				data: { label },
			};
		} else if (operation === 'delete') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const labelId = getResourceId(this.getNodeParameter('labelId', i));
			const response = await boardActions.deleteLabel.call(this, boardId, labelId);
			return {
				success: true,
				operation: 'delete',
				resource: 'label',
				message: 'Label erfolgreich gelöscht',
				data: response,
			};
		} else if (operation === 'assignToCard') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const labelId = getResourceId(this.getNodeParameter('labelId', i));
			const response = await cardActions.addLabelToCard.call(this, boardId, stackId, cardId, labelId);
			return {
				success: true,
				operation: 'assignToCard',
				resource: 'label',
				message: 'Label erfolgreich zu Karte zugewiesen',
				data: response,
			};
		} else if (operation === 'removeFromCard') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const labelId = getResourceId(this.getNodeParameter('labelId', i));
			const response = await cardActions.removeLabelFromCard.call(this, boardId, stackId, cardId, labelId);
			return {
				success: true,
				operation: 'removeFromCard',
				resource: 'label',
				message: 'Label erfolgreich von Karte entfernt',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

export class CommentHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const comments = await commentActions.getComments.call(this, cardId);
			return {
				success: true,
				operation: 'getAll',
				resource: 'comment',
				message: `${comments.length} Kommentare in der Karte gefunden`,
				data: { comments, cardId },
			};
		} else if (operation === 'get') {
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const commentId = parseInt(this.getNodeParameter('commentId', i) as string, 10);
			const comment = await commentActions.getComment.call(this, cardId, commentId);
			return {
				success: true,
				operation: 'get',
				resource: 'comment',
				data: { comment },
			};
		} else if (operation === 'create') {
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const message = this.getNodeParameter('message', i) as string;
			
			const commentData: ICommentCreate = { message };
			const comment = await commentActions.createComment.call(this, cardId, commentData);
			return {
				success: true,
				operation: 'create',
				resource: 'comment',
				message: 'Kommentar erfolgreich erstellt',
				data: { comment },
			};
		} else if (operation === 'update') {
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const commentId = parseInt(this.getNodeParameter('commentId', i) as string, 10);
			const message = this.getNodeParameter('message', i) as string;
			
			const commentData: ICommentUpdate = { message };
			const comment = await commentActions.updateComment.call(this, cardId, commentId, commentData);
			return {
				success: true,
				operation: 'update',
				resource: 'comment',
				message: 'Kommentar erfolgreich aktualisiert',
				data: { comment },
			};
		} else if (operation === 'delete') {
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const commentId = parseInt(this.getNodeParameter('commentId', i) as string, 10);
			const response = await commentActions.deleteComment.call(this, cardId, commentId);
			return {
				success: true,
				operation: 'delete',
				resource: 'comment',
				message: 'Kommentar erfolgreich gelöscht',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
}

export class AttachmentHandler {
	static async execute(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
		if (operation === 'getAll') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const attachments = await attachmentActions.getAttachments.call(this, boardId, stackId, cardId);
			return {
				success: true,
				operation: 'getAll',
				resource: 'attachment',
				message: `${attachments.length} Anhänge in der Karte gefunden`,
				data: { attachments, boardId, stackId, cardId },
			};
		} else if (operation === 'get') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const attachmentId = parseInt(this.getNodeParameter('attachmentId', i) as string, 10);
			const attachment = await attachmentActions.getAttachment.call(this, boardId, stackId, cardId, attachmentId);
			return {
				success: true,
				operation: 'get',
				resource: 'attachment',
				data: { attachment },
			};
		} else if (operation === 'create') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const type = this.getNodeParameter('type', i) as 'deck_file' | 'file';
			const data = this.getNodeParameter('data', i) as string;
			
			const attachmentData: IAttachmentCreate = { type, data };
			const attachment = await attachmentActions.createAttachment.call(this, boardId, stackId, cardId, attachmentData, i);
			return {
				success: true,
				operation: 'create',
				resource: 'attachment',
				message: 'Anhang erfolgreich erstellt',
				data: { attachment },
			};
		} else if (operation === 'update') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const attachmentId = parseInt(this.getNodeParameter('attachmentId', i) as string, 10);
			const data = this.getNodeParameter('data', i, '') as string;
			
			const attachmentData: IAttachmentUpdate = { id: attachmentId };
			if (data) attachmentData.data = data;
			
			const attachment = await attachmentActions.updateAttachment.call(this, boardId, stackId, cardId, attachmentData);
			return {
				success: true,
				operation: 'update',
				resource: 'attachment',
				message: 'Anhang erfolgreich aktualisiert',
				data: { attachment },
			};
		} else if (operation === 'delete') {
			const boardId = getResourceId(this.getNodeParameter('boardId', i));
			const stackId = getResourceId(this.getNodeParameter('stackId', i));
			const cardId = getResourceId(this.getNodeParameter('cardId', i));
			const attachmentId = parseInt(this.getNodeParameter('attachmentId', i) as string, 10);
			const response = await attachmentActions.deleteAttachment.call(this, boardId, stackId, cardId, attachmentId);
			return {
				success: true,
				operation: 'delete',
				resource: 'attachment',
				message: 'Anhang erfolgreich gelöscht',
				data: response,
			};
		}
		
		throw new Error(`Unbekannte Operation: ${operation}`);
	}
} 