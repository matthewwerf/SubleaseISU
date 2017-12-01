export class messageInfo {
	senderUsername: string;
	receiverUsername: string;
	message: string;
	timeSent: string;

	constructor(senderUsername: string, reveiverUsername: string, message: string, lastMessageDate: string) {
		this.senderUsername = senderUsername;
		this.receiverUsername = reveiverUsername;
		this.message = message;
		this.timeSent = lastMessageDate;
	}
}