/**
 * Pipe used for text box search to narrow down number of roommates.
 */

import { ListingInfo } from '../models/listing';
import {Pipe, PipeTransform} from '@angular/core';



@Pipe({
    name: 'roommateSearch'
})

export class RoommateSearchPipe implements PipeTransform {
    transform(listofAddresses: ListingInfo[], maxNumber: number) {
        if(maxNumber) {
            return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.roommateQuantity, maxNumber));
        }
        else {
            return listofAddresses;
        }

    }

    /**
     * Perform filtering
     * @param {number} listingPrice the price of the listing
     * @param {number} lowPrice the low price value
     * @param {number} highPrice the high price value
     * @return {boolean} True if the listingPrice is inbetween the lowPrice and highPrice, false otherwise
     */
    applyFilter(Actual: number, search: number): boolean {
        if(search >= Actual) {
            return true;
        }
        return false;
    }
}