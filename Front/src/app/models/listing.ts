export class ListingInfo {
	_id: string;
	posterUsername: string;
	leasingAgency: string;
	rentValue: number;
	address: string;
	postingMessage: string;
	propertyId: string;

	constructor(id: string, posterUsername: string, leasingAgency: string, rentValue: number, address: string, postingMessage: string, propertyId: string) {
		this._id = id;
		this.posterUsername = posterUsername;
		this.leasingAgency = leasingAgency;
		this.rentValue = rentValue;
		this.address = address;
		this.postingMessage = postingMessage;
		this.propertyId = propertyId;
	}
}