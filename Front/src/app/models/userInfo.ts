export class UserInfo {
	username: string;
	email: string;
	phoneNumber: string;
	venmoUsername: string;
	paypalUsername: string;
	accountType: string;
	accountTypeApproved: boolean;

	constructor(username: string, email: string, phoneNumber: string, venmoUsername: string, paypalUsername: string, accountType: string, accountTypeApproved: boolean) {
		this.username = username;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.venmoUsername = venmoUsername;
		this.paypalUsername = paypalUsername;
		this.accountType = accountType;
		this.accountTypeApproved = accountTypeApproved;
	}
}