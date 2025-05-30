import { IExecuteFunctions } from 'n8n-workflow';
import { nextcloudDeckOcsApiRequest } from '../helpers/api';
import { IComment, ICommentCreate, ICommentUpdate } from '../interfaces/comment';

export async function getComments(this: IExecuteFunctions, cardId: number): Promise<IComment[]> {
	// Kommentare über OCS Comments API abrufen
	// objectType 'deck_card' und objectId ist die Card-ID
	const endpoint = `/comments?objectType=deck_card&objectId=${cardId}`;
	const response = await nextcloudDeckOcsApiRequest.call(this, 'GET', endpoint);
	return response as unknown as IComment[];
}

export async function getComment(this: IExecuteFunctions, commentId: number): Promise<IComment> {
	const endpoint = `/comments/${commentId}`;
	const response = await nextcloudDeckOcsApiRequest.call(this, 'GET', endpoint);
	return response as unknown as IComment;
}

export async function createComment(this: IExecuteFunctions, cardId: number, commentData: ICommentCreate): Promise<IComment> {
	// Kommentar über OCS Comments API erstellen
	const endpoint = `/comments`;
	const body = {
		objectType: 'deck_card',
		objectId: cardId,
		message: commentData.message,
	};
	const response = await nextcloudDeckOcsApiRequest.call(this, 'POST', endpoint, body);
	return response as unknown as IComment;
}

export async function updateComment(this: IExecuteFunctions, commentId: number, commentData: ICommentUpdate): Promise<IComment> {
	const endpoint = `/comments/${commentId}`;
	const body = {
		message: commentData.message,
	};
	const response = await nextcloudDeckOcsApiRequest.call(this, 'PUT', endpoint, body);
	return response as unknown as IComment;
}

export async function deleteComment(this: IExecuteFunctions, commentId: number): Promise<{ success: boolean }> {
	const endpoint = `/comments/${commentId}`;
	await nextcloudDeckOcsApiRequest.call(this, 'DELETE', endpoint);
	return { success: true };
} 