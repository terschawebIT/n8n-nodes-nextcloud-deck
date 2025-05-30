import { IDataObject } from 'n8n-workflow';
import { IUser } from './board';

export interface IAttachment {
	id?: number;
	type: string;
	data?: string;
	createdAt?: string;
	createdBy?: string;
}

export interface IStack {
	id?: number;
	title: string;
	boardId: number;
	deletedAt?: number;
	lastModified?: number;
	order?: number;
	cards?: ICard[];
}

export interface IStackCreate extends IDataObject {
	title: string;
	boardId: number;
	order?: number;
}

export interface IStackUpdate extends Partial<IStackCreate> {
	id: number;
}

export interface ICard {
	id?: number;
	title: string;
	description?: string;
	stackId?: number;
	type?: string;
	lastModified?: number;
	createdAt?: number;
	archived?: boolean;
	duedate?: string;
	order?: number;
	owner?: IUser;
	deletedAt?: number;
	commentsUnread?: number;
	labels?: ILabel[];
	assignedUsers?: IUser[];
	attachments?: IAttachment[];
	attachmentCount?: number;
	commentsCount?: number;
}

interface ILabel {
	id?: number;
	title: string;
	color: string;
	boardId?: number;
	cardId?: number;
} 