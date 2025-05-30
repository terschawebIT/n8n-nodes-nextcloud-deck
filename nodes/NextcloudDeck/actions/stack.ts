import {
	IExecuteFunctions,
	IDataObject,
} from 'n8n-workflow';
import { nextcloudDeckApiRequest } from '../helpers/api';
import { IStack, IStackCreate, IStackUpdate } from '../interfaces/stack';

export async function getStacks(this: IExecuteFunctions, boardId: number): Promise<IStack[]> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}/stacks`);
	return response as unknown as IStack[];
}

export async function getStack(this: IExecuteFunctions, boardId: number, stackId: number): Promise<IStack> {
	const response = await nextcloudDeckApiRequest.call(this, 'GET', `/boards/${boardId}/stacks/${stackId}`);
	return response as unknown as IStack;
}

export async function createStack(this: IExecuteFunctions, boardId: number, stackData: IStackCreate): Promise<IStack> {
	const response = await nextcloudDeckApiRequest.call(this, 'POST', `/boards/${boardId}/stacks`, stackData);
	return response as unknown as IStack;
}

export async function updateStack(this: IExecuteFunctions, boardId: number, stackData: IStackUpdate): Promise<IStack> {
	const { id, ...updateData } = stackData;
	const response = await nextcloudDeckApiRequest.call(this, 'PUT', `/boards/${boardId}/stacks/${id}`, updateData);
	return response as unknown as IStack;
}

export async function deleteStack(this: IExecuteFunctions, boardId: number, stackId: number): Promise<IDataObject> {
	const response = await nextcloudDeckApiRequest.call(this, 'DELETE', `/boards/${boardId}/stacks/${stackId}`);
	return response;
} 