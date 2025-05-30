import { IExecuteFunctions } from 'n8n-workflow';
import { nextcloudDeckApiRequest, nextcloudDeckFileUploadRequest } from '../helpers/api';
import { IAttachment, IAttachmentCreate, IAttachmentUpdate } from '../interfaces/attachment';
import FormData from 'form-data';

export async function getAttachments(this: IExecuteFunctions, boardId: number, stackId: number, cardId: number): Promise<IAttachment[]> {
	// GET /boards/{boardId}/stacks/{stackId}/cards/{cardId}/attachments
	const endpoint = `/boards/${boardId}/stacks/${stackId}/cards/${cardId}/attachments`;
	console.log(`DEBUG: Requesting attachments from: ${endpoint}`);
	
	try {
		const response = await nextcloudDeckApiRequest.call(this, 'GET', endpoint);
		console.log(`DEBUG: Attachments API response:`, JSON.stringify(response, null, 2));
		
		// Handle different response formats
		if (Array.isArray(response)) {
			return response as unknown as IAttachment[];
		} else if (response && typeof response === 'object' && 'data' in response) {
			const data = (response as any).data;
			if (Array.isArray(data)) {
				return data as unknown as IAttachment[];
			}
		}
		
		return response as unknown as IAttachment[];
	} catch (error) {
		console.error(`DEBUG: Error fetching attachments:`, error);
		throw error;
	}
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
	
	console.log(`DEBUG: Creating attachment with data:`, attachmentData);
	
	// Für File-Uploads müssen wir FormData verwenden
	const formData = new FormData();
	formData.append('type', attachmentData.type);
	
	// Je nach Typ unterschiedlich handhaben
	if (attachmentData.type === 'file') {
		// Für Nextcloud-Dateien wird der Dateipfad erwartet
		formData.append('data', attachmentData.data);
	} else {
		// Für deck_file muss eine echte Datei hochgeladen werden
		// Erstelle einen Buffer aus den Daten
		const buffer = Buffer.from(attachmentData.data, 'utf8');
		formData.append('file', buffer, {
			filename: 'attachment.txt',
			contentType: 'text/plain',
		});
	}
	
	console.log(`DEBUG: FormData prepared for endpoint: ${endpoint}`);
	
	const response = await nextcloudDeckFileUploadRequest.call(this, 'POST', endpoint, formData);
	console.log(`DEBUG: Create attachment response:`, JSON.stringify(response, null, 2));
	
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