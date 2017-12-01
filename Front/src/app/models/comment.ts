export class Comment {
	commentPosterUsername: string;
	timePosted: number;
	message: string;

	constructor(username: string, time: number, message: string) {
		this.commentPosterUsername = username;
		this.timePosted = time;
		this.message = message;
	}
}