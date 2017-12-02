export class User {
	username: any;
	password: any;
	email: any;
	phonenumber: any;
	accountType: string;
	constructor(username?: any, password?: any, email?: any, phonenumber?: any, accountType?: any) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.phonenumber = phonenumber;
		this.accountType = accountType;
	}
}
