export class ListingInfo {
	_id: string;
	posterUsername: string;
	leasingAgency: string;
	rentValue: number;
	address: string;
	postingMessage: string;
	propertyId: string;
	bathroomQuantity: number;
	roommateQuantity: number;
	personalBathroom: boolean;

	constructor(id: string, posterUsername: string, leasingAgency: string, rentValue: number, address: string, postingMessage: string, propertyId: string, bathroomQuantity: number, roommateQuantity: number, personalBathroom: boolean) {
		this._id = id;
		this.posterUsername = posterUsername;
		this.leasingAgency = leasingAgency;
		this.rentValue = rentValue;
		this.address = address;
		this.postingMessage = postingMessage;
		this.propertyId = propertyId;
		this.bathroomQuantity = bathroomQuantity;
		this.roommateQuantity = roommateQuantity;
		this.personalBathroom = personalBathroom;
	}
}