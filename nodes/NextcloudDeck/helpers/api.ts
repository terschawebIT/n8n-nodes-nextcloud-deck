import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function nextcloudDeckApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('nextcloudDeckApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${serverUrl}/index.php/apps/deck/api/v1.0${endpoint}`;

	const config: AxiosRequestConfig = {
		method,
		url,
		headers: {
			'OCS-APIRequest': 'true',
			'Content-Type': 'application/json',
		},
		auth: {
			username,
			password,
		},
	};

	if (Object.keys(body).length > 0) {
		config.data = body;
	}

	try {
		const response: AxiosResponse = await axios(config);
		return response.data as IDataObject;
	} catch (error: unknown) {
		const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
		if (axiosError.response?.status === 401) {
			throw new NodeOperationError(
				this.getNode(),
				'Authentifizierung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten oder erstellen Sie ein App-Passwort.',
			);
		}
		if (axiosError.response?.status === 403) {
			throw new NodeOperationError(
				this.getNode(),
				'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.',
			);
		}
		if (axiosError.response?.status === 404) {
			throw new NodeOperationError(
				this.getNode(),
				'Ressource nicht gefunden. Überprüfen Sie die angegebenen IDs.',
			);
		}
		if (axiosError.response?.data?.message) {
			throw new NodeOperationError(this.getNode(), axiosError.response.data.message);
		}
		const errorMessage = error instanceof Error ? error.message : 'Unbekannter API-Fehler';
		throw new NodeOperationError(this.getNode(), `API-Fehler: ${errorMessage}`);
	}
}

export async function nextcloudDeckOcsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('nextcloudDeckApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${serverUrl}/ocs/v2.php/apps/deck/api/v1.0${endpoint}`;

	const config: AxiosRequestConfig = {
		method,
		url,
		headers: {
			'OCS-APIRequest': 'true',
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		auth: {
			username,
			password,
		},
	};

	if (Object.keys(body).length > 0) {
		config.data = body;
	}

	try {
		const response: AxiosResponse = await axios(config);
		const data = response.data as { ocs?: { data?: IDataObject } };
		return data?.ocs?.data || (response.data as IDataObject);
	} catch (error: unknown) {
		const axiosError = error as { response?: { status?: number; data?: { ocs?: { meta?: { message?: string } } } } };
		if (axiosError.response?.status === 401) {
			throw new NodeOperationError(
				this.getNode(),
				'Authentifizierung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten oder erstellen Sie ein App-Passwort.',
			);
		}
		if (axiosError.response?.status === 403) {
			throw new NodeOperationError(
				this.getNode(),
				'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.',
			);
		}
		if (axiosError.response?.status === 404) {
			throw new NodeOperationError(
				this.getNode(),
				'Ressource nicht gefunden. Überprüfen Sie die angegebenen IDs.',
			);
		}
		if (axiosError.response?.data?.ocs?.meta?.message) {
			throw new NodeOperationError(this.getNode(), axiosError.response.data.ocs.meta.message);
		}
		const errorMessage = error instanceof Error ? error.message : 'Unbekannter API-Fehler';
		throw new NodeOperationError(this.getNode(), `API-Fehler: ${errorMessage}`);
	}
} 