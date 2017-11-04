/**
 * Pipe used for text box search to narrow down address.
 */

import {Pipe, PipeTransform} from '@angular/core';
import { ListingInfo } from '../models/listing';


@Pipe({
    name: 'addressSearch'
})

export class AddressSearchPipe implements PipeTransform {
    transform(listofAddresses: ListingInfo[], searchForString: string) {
        if(searchForString == null) {
            return listofAddresses;
        }
        return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.address, searchForString));
    }

    /**
     * Perform filtering
     * @param {string} BrowserSpec the spec that is to be tested
     * @param {string} searchForString the string that the spec is being compared to
     * @return {boolean} True if the BrowserSpec if equal to the searchForString or if the string is null/empty, false otherwise
     */
    applyFilter(Address: string, searchForString: string): boolean {
        if (!searchForString) {
            return true;
        }
        return Address.toLowerCase().indexOf(searchForString.toLowerCase()) !== -1;
    }
}