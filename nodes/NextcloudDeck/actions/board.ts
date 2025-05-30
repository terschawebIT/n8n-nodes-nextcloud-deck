import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
} from 'n8n-workflow';
import { nextcloudDeckApiRequest } from '../helpers/api';
import { IBoard, IBoardCreate, IBoardUpdate } from '../interfaces/board';
import { ILabel, ILabelCreate, ILabelUpdate } from '../interfaces/card';

export async function getBoards(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<IBoard[]> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', '/boards');
	return response as unknown as IBoard[];
}

export async function getBoard(this: IExecuteFunctions, boardId: number): Promise<IBoard> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}`);
	return response as unknown as IBoard;
}

export async function createBoard(this: IExecuteFunctions, boardData: IBoardCreate): Promise<IBoard> {
	const response = await nextcloudDeckApiRequest.call(this, 'POST', '/boards', boardData);
	return response as unknown as IBoard;
}

export async function updateBoard(this: IExecuteFunctions, boardData: IBoardUpdate): Promise<IBoard> {
	const { id, ...updateData } = boardData;
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${id}`, updateData);
	return response as unknown as IBoard;
}

export async function deleteBoard(this: IExecuteFunctions, boardId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'DELETE', `/boards/${boardId}`);
	return response;
}

export async function undoDeleteBoard(this: IExecuteFunctions, boardId: number): Promise<IBoard> {
	const response = await nextcloudDeckApiRequest.call(this, 'POST', `/boards/${boardId}/undo_delete`);
	return response as unknown as IBoard;
}

// Label-Management-Funktionen
export async function getLabels(this: IExecuteFunctions | ILoadOptionsFunctions, boardId: number): Promise<ILabel[]> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}`);
	const board = response as unknown as { labels?: ILabel[] };
	return board.labels || [];
}

export async function getLabel(this: IExecuteFunctions, boardId: number, labelId: number): Promise<ILabel> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}/labels/${labelId}`);
	return response as unknown as ILabel;
}

export async function createLabel(this: IExecuteFunctions, boardId: number, labelData: ILabelCreate): Promise<ILabel> {
	const response = await nextcloudDeckApiRequest.call(this, 'POST', `/boards/${boardId}/labels`, labelData);
	return response as unknown as ILabel;
}

export async function updateLabel(this: IExecuteFunctions, boardId: number, labelData: ILabelUpdate): Promise<ILabel> {
	const { id, ...updateData } = labelData;
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/labels/${id}`, updateData);
	return response as unknown as ILabel;
}

export async function deleteLabel(this: IExecuteFunctions, boardId: number, labelId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'DELETE', `/boards/${boardId}/labels/${labelId}`);
	return response;
} 