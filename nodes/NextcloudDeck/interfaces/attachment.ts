export interface IAttachment {
	id: number;
	cardId: number;
	type: 'deck_file' | 'file';
	data: string;
	lastModified: number;
	createdAt: string;
	createdBy: string;
	deletedAt: number;
	extendedData: {
		filesize?: number;
		mimetype?: string;
		info?: {
			dirname: string;
			basename: string;
			extension: string;
			filename: string;
		};
	};
}

export interface IAttachmentCreate {
	type: 'deck_file' | 'file';
	data: string;
}

export interface IAttachmentUpdate {
	id: number;
	data?: string;
} 