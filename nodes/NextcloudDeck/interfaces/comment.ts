export interface IComment {
	id: number;
	objectType: string;
	objectId: number;
	actorType: string;
	actorId: string;
	actorDisplayName: string;
	message: string;
	creationDateTime: string;
	latestChildDateTime?: string;
	verb: string;
	mentions?: IMention[];
}

export interface IMention {
	mentionId: string;
	mentionType: string;
	mentionDisplayName: string;
}

export interface ICommentCreate {
	message: string;
}

export interface ICommentUpdate {
	message: string;
} 