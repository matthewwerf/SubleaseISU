/**
 * Pipe used for text box search to narrow down prices.
 */

import {Pipe, PipeTransform} from '@angular/core';
import { ListingInfo } from '../models/listing';


@Pipe({
    name: 'priceSearch'
})

export class PriceSearchPipe implements PipeTransform {
    transform(listofAddresses: ListingInfo[], lowPrice: number, highPrice: number) {
        if(lowPrice == null && highPrice == null) { // If neither of the values are entered return the list
            return listofAddresses;
        }
        else if(highPrice == null && lowPrice) {
            return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.rentValue, lowPrice, 9999999999));
        }
        else if(lowPrice == null && highPrice) {
            return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.rentValue, 0, highPrice));
        }
        else {
            return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.rentValue, lowPrice, highPrice));
        }
    }

    /**
     * Perform filtering
     * @param {number} listingPrice the price of the listing
     * @param {number} lowPrice the low price value
     * @param {number} highPrice the high price value
     * @return {boolean} True if the listingPrice is inbetween the lowPrice and highPrice, false otherwise
     */
    applyFilter(listingPrice: number, lowPrice: number, highPrice: number): boolean {
        if(listingPrice >= lowPrice && listingPrice <= highPrice) {
            return true;
        }
        return false;
    }
}