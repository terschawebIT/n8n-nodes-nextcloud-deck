import { IExecuteFunctions } from 'n8n-workflow';
import { nextcloudDeckOcsApiRequest } from '../helpers/api';
import { IComment, ICommentCreate, ICommentUpdate } from '../interfaces/comment';

export async function getComments(this: IExecuteFunctions, cardId: number): Promise<IComment[]> {
	// GET /ocs/v2.php/apps/deck/api/v1.0/cards/{cardId}/comments
	const endpoint = `/cards/${cardId}/comments`;
	const response = await nextcloudDeckOcsApiRequest.call(this, 'GET', endpoint);
	return response as unknown as IComment[];
}

export async function getComment(this: IExecuteFunctions, cardId: number, commentId: number): Promise<IComment> {
	// Single comment endpoint not documented, but we can get all and filter
	const comments = await getComments.call(this, cardId);
	const comment = comments.find(c => c.id === commentId);
	if (!comment) {
		throw new Error(`Kommentar ${commentId} nicht gefunden`);
	}
	return comment;
}

export async function createComment(this: IExecuteFunctions, cardId: number, commentData: ICommentCreate): Promise<IComment> {
	// POST /ocs/v2.php/apps/deck/api/v1.0/cards/{cardId}/comments
	const endpoint = `/cards/${cardId}/comments`;
	const body = {
		message: commentData.message,
		parentId: null
	};
	const response = await nextcloudDeckOcsApiRequest.call(this, 'POST', endpoint, body);
	return response as unknown as IComment;
}

export async function updateComment(this: IExecuteFunctions, cardId: number, commentId: number, commentData: ICommentUpdate): Promise<IComment> {
	// PUT /ocs/v2.php/apps/deck/api/v1.0/cards/{cardId}/comments/{commentId}
	const endpoint = `/cards/${cardId}/comments/${commentId}`;
	const body = {
		message: commentData.message
	};
	const response = await nextcloudDeckOcsApiRequest.call(this, 'PUT', endpoint, body);
	return response as unknown as IComment;
}

export async function deleteComment(this: IExecuteFunctions, cardId: number, commentId: number): Promise<{ success: boolean }> {
	// DELETE /ocs/v2.php/apps/deck/api/v1.0/cards/{cardId}/comments/{commentId}
	const endpoint = `/cards/${cardId}/comments/${commentId}`;
	await nextcloudDeckOcsApiRequest.call(this, 'DELETE', endpoint);
	return { success: true };
} 