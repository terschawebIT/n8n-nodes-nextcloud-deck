import { IExecuteFunctions } from 'n8n-workflow';
import { nextcloudDeckApiRequest } from '../helpers/api';
import { IAttachment, IAttachmentCreate, IAttachmentUpdate } from '../interfaces/attachment';

export async function getAttachments(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number): Promise<IAttachment[]> {
	// GET /boards/{boardId}/stacks/{stackId}/cards/{cardId}/attachments
	const endpoint = `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/attachments`;
	const response = await nextcloudDeckApiRequest.call(this, 'GET', endpoint);
	return response as unknown as IAttachment[];
}

export async function getAttachment(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, attachmentId: number): Promise<IAttachment> {
	// Get all attachments and filter for the specific one
	const attachments = await getAttachments.call(this, boardId, stackId, cardId);
	const attachment = attachments.find(a => a.id === attachmentId);
	if (!attachment) {
		throw new Error(`Anhang ${attachmentId} nicht gefunden`);
	}
	return attachment;
}

export async function createAttachment(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, attachmentData: IAttachmentCreate): Promise<IAttachment> {
	// POST /boards/{boardId}/stacks/{stackId}/cards/{cardId}/attachments
	const endpoint = `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/attachments`;
	const body = {
		type: attachmentData.type,
		data: attachmentData.data
	};
	const response = await nextcloudDeckApiRequest.call(this, 'POST', endpoint, body);
	return response as unknown as IAttachment;
}

export async function updateAttachment(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, attachmentData: IAttachmentUpdate): Promise<IAttachment> {
	// PUT /boards/{boardId}/stacks/{stackId}/cards/{cardId}/attachments/{attachmentId}
	const endpoint = `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/attachments/${attachmentData.id}`;
	const body: { data?: string } = {};
	if (attachmentData.data) body.data = attachmentData.data;
	
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', endpoint, body);
	return response as unknown as IAttachment;
}

export async function deleteAttachment(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number, attachmentId: number): Promise<{ success: boolean }> {
	// DELETE /boards/{boardId}/stacks/{stackId}/cards/{cardId}/attachments/{attachmentId}
	const endpoint = `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/attachments/${attachmentId}`;
	await nextcloudDeckApiRequest.call(this, 'DELETE', endpoint);
	return { success: true };
} 