import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
} from 'n8n-workflow';
import { nextcloudDeckApiRequest, nextcloudDeckOcsApiRequest } from '../helpers/api';
import { ICard } from '../interfaces/stack';
import { ICardCreate, ICardUpdate, IComment, ICommentCreate } from '../interfaces/card';

export async function getCards(this: IExecuteFunctions | ILoadOptionsFunctions, boardId: number, stackId: number): Promise<ICard[]> {
	// Da es keinen direkten Endpunkt für alle Karten gibt, holen wir den Stack und extrahieren die Karten
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}/stacks/${stackId}`);
	const stack = response as unknown as { cards?: ICard[] };
	return stack.cards || [];
}

export async function getCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number): Promise<ICard> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}`);
	return response as unknown as ICard;
}

export async function createCard(this: IExecuteFunctions, boardId: number, stackId: number, cardData: ICardCreate): Promise<ICard> {
	const response = await nextcloudDeckApiRequest.call(this, 'POST', `/boards/${boardId}/stacks/${stackId}/cards`, cardData);
	return response as unknown as ICard;
}

export async function updateCard(this: IExecuteFunctions, boardId: number, stackId: number, cardData: ICardUpdate): Promise<ICard> {
	const { id, ...updateData } = cardData;
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${stackId}/cards/${id}`, updateData);
	return response as unknown as ICard;
}

export async function deleteCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'DELETE', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}`);
	return response;
}

export async function assignUserToCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, userId: string): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/assignUser`, { userId });
	return response;
}

export async function unassignUserFromCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, userId: string): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/unassignUser`, { userId });
	return response;
}

export async function addLabelToCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, labelId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/assignLabel`, { labelId });
	return response;
}

export async function removeLabelFromCard(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, labelId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/removeLabel`, { labelId });
	return response;
}

// Comments (using OCS API)
export async function getComments(this: IExecuteFunctions, cardId: number, limit?: number, offset?: number): Promise<IComment[]> {
	let endpoint = `/cards/${cardId}/comments`;
	const params: string[] = [];
	if (limit) params.push(`limit=${limit}`);
	if (offset) params.push(`offset=${offset}`);
	if (params.length > 0) endpoint += `?${params.join('&')}`;
	
	const response = await nextcloudDeckOcsApiRequest.call(this, 'GET', endpoint);
	return response as unknown as IComment[];
}

export async function createComment(this: IExecuteFunctions, cardId: number, commentData: ICommentCreate): Promise<IComment> {
	const response = await nextcloudDeckOcsApiRequest.call(this, 'POST', `/cards/${cardId}/comments`, commentData);
	return response as unknown as IComment;
}

export async function updateComment(this: IExecuteFunctions, cardId: number, commentId: string, message: string): Promise<IComment> {
	const response = await nextcloudDeckOcsApiRequest.call(this, 'PUT', `/cards/${cardId}/comments/${commentId}`, { message });
	return response as unknown as IComment;
}

export async function deleteComment(this: IExecuteFunctions, cardId: number, commentId: string): Promise<IDataObject> {
	const response = await nextcloudDeckOcsApiRequest.call(this, 'DELETE', `/cards/${cardId}/comments/${commentId}`);
	return response;
} 