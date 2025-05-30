import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NextcloudDeckApi implements ICredentialType {
	name = 'nextcloudDeckApi';
	displayName = 'Nextcloud Deck API';
	documentationUrl = 'https://deck.readthedocs.io/en/latest/API/';
	properties: INodeProperties[] = [
		{
			displayName: 'Nextcloud URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://cloud.example.com',
			placeholder: 'https://ihre-nextcloud-instanz.de',
			description: 'Die URL Ihrer Nextcloud-Instanz (ohne /index.php/apps/deck/api/)',
		},
		{
			displayName: 'Benutzername',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'max.mustermann',
			description: 'Ihr Nextcloud Benutzername',
		},
		{
			displayName: 'Passwort oder App Passwort',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Ihr Nextcloud Passwort oder ein App-Passwort (empfohlen). Bei 401-Fehlern erstellen Sie ein App-Passwort unter Einstellungen > Sicherheit > App-Passwörter.',
		},
	];
} 