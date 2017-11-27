export class CommentInfo {
	posterUsername: string;
	timeStamp: any;
	commentBody: string;

	constructor(posterUsername: string, timeStamp: any, commentBody: string){
		this.posterUsername = posterUsername;
		this.timeStamp = timeStamp;
		this.commentBody = commentBody;
	}
}