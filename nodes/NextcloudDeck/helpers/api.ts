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

export async function nextcloudShareeApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('nextcloudDeckApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${serverUrl}/ocs/v2.php/apps/files_sharing/api/v1${endpoint}`;

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

export async function nextcloudOcsUsersApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('nextcloudDeckApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${serverUrl}/ocs/v2.php/cloud${endpoint}`;

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

export async function nextcloudWebDavCommentsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body?: string,
	contentType = 'application/xml',
): Promise<IDataObject> {
	const credentials = await this.getCredentials('nextcloudDeckApi');
	const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${serverUrl}/remote.php/dav/comments${endpoint}`;

	const config: AxiosRequestConfig = {
		method,
		url,
		headers: {
			'Content-Type': contentType,
			'Accept': 'application/xml',
		},
		auth: {
			username,
			password,
		},
	};

	// Add body if provided
	if (body) {
		config.data = body;
	}

	try {
		const response: AxiosResponse = await axios(config);
		
		// For WebDAV, we might get XML response that needs parsing
		// For now, return the raw response data
		return { 
			data: response.data,
			status: response.status,
			headers: response.headers 
		};
	} catch (error: unknown) {
		const axiosError = error as { response?: { status?: number; data?: any } };
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
		if (axiosError.response?.status === 415) {
			throw new NodeOperationError(
				this.getNode(),
				`Nicht unterstützter Media-Type. Server erwartet anderen Content-Type als ${contentType}.`,
			);
		}
		const errorMessage = error instanceof Error ? error.message : 'Unbekannter API-Fehler';
		throw new NodeOperationError(this.getNode(), `WebDAV API-Fehler: ${errorMessage}`);
	}
} 