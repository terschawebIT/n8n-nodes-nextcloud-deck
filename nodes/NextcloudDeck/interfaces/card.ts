import { IDataObject } from 'n8n-workflow';

export interface ICardCreate extends IDataObject {
	title: string;
	type?: string;
	order?: number;
	description?: string;
	duedate?: string;
}

export interface ICardUpdate extends Partial<ICardCreate> {
	id: number;
	owner?: string;
}

export interface ICardAssignment {
	userId: string;
	type: number;
}

export interface ICardLabel {
	id: number;
}

export interface IComment {
	id?: string;
	objectId?: string;
	message: string;
	actorId?: string;
	actorType?: string;
	actorDisplayName?: string;
	creationDateTime?: string;
	mentions?: IMention[];
	parentId?: string;
}

export interface ICommentCreate extends IDataObject {
	message: string;
	parentId?: string;
}

export interface IMention {
	mentionId: string;
	mentionType: string;
	mentionDisplayName: string;
}

// Label interfaces
export interface ILabel {
	id: number;
	title: string;
	color: string;
	boardId: number;
	cardId?: number | null;
}

export interface ILabelCreate {
	title: string;
	color: string;
	[key: string]: string;
}

export interface ILabelUpdate {
	id: number;
	title?: string;
	color?: string;
	[key: string]: string | number | undefined;
} 