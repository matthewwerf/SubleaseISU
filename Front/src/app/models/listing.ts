import { Comment } from './comment';
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
	comments: Array<any>;
	linkedPictureIDs: Array<any>;
	ratings: Array<any>;

	constructor(id: string, posterUsername: string, leasingAgency: string, rentValue: number, address: string, postingMessage: string, propertyId: string, bathroomQuantity: number, roommateQuantity: number, personalBathroom: boolean, comments: Array<any>, linkedPictureIDs: Array<any>, ratings: Array<any>) {
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
		this.comments = comments;
		this.linkedPictureIDs = linkedPictureIDs;
		this.ratings = ratings;
	}
}