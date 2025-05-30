import { IDataObject } from 'n8n-workflow';

export interface IUser {
	primaryKey: string;
	uid: string;
	displayname: string;
}

export interface IBoard {
	id?: number;
	title: string;
	owner?: IUser;
	color: string;
	archived?: boolean;
	labels?: ILabel[];
	permissions?: {
		PERMISSION_READ: boolean;
		PERMISSION_EDIT: boolean;
		PERMISSION_MANAGE: boolean;
		PERMISSION_SHARE: boolean;
	};
	users?: IUser[];
	shared?: number;
	deletedAt?: number;
	lastModified?: number;
	settings?: {
		'notify-due'?: string;
		calendar?: boolean;
	};
}

export interface IBoardCreate extends IDataObject {
	title: string;
	color: string;
}

export interface IBoardUpdate extends Partial<IBoardCreate> {
	id: number;
}

export interface ILabel {
	id?: number;
	title: string;
	color: string;
	boardId?: number;
	cardId?: number;
} 