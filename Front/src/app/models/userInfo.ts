export class UserInfo {
	username: string;
	//hashedPassword: String,
	email: string;
	phoneNumber: string;
	venmoUsername: string;
	//venmoEncryptedPassword: String,
	paypalUsername: string;
	//paypalEncryptedPassword: String,
	//favoriteProperties: Object,
	// profilePicture: object;

	constructor(username: string, email: string, phoneNumber: string, venmoUsername: string, paypalUsername: string) {
		this.username = username;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.venmoUsername = venmoUsername;
		this.paypalUsername = paypalUsername;
		
	}
}