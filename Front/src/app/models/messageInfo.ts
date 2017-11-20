export class messageInfo {
	senderUsername: string;
	receiverUsername: string;
	message: string;
	lastMessageDate: Date;

	constructor(senderUsername: string, reveiverUsername: string, message: string, lastMessageDate: Date) {
		this.senderUsername = senderUsername;
		this.receiverUsername = reveiverUsername;
		this.message = message;
		this.lastMessageDate = lastMessageDate;
	}
}