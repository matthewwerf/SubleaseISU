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
	accountType: string;

	constructor(username: string, email: string, phoneNumber: string, venmoUsername: string, paypalUsername: string, accountType: string) {
		this.username = username;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.venmoUsername = venmoUsername;
		this.paypalUsername = paypalUsername;
		this.accountType = accountType;
	}
}