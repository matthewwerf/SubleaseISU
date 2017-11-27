/**
 * Pipe used for checkboxvto narrow down personal bathroom
 */

import { ListingInfo } from '../models/listing';
import {Pipe, PipeTransform} from '@angular/core';



@Pipe({
    name: 'personalBathroomSearch'
})

export class PersonalBathroomSearchPipe implements PipeTransform {
    transform(listofAddresses: ListingInfo[], needPersonalBathroom: boolean) {
        if(needPersonalBathroom) {
            return listofAddresses.filter((Listing: ListingInfo) => this.applyFilter(Listing.personalBathroom, needPersonalBathroom));
        }
        else {
            return listofAddresses;
        }

    }

    /**
     * Perform filtering
     * @param {number} actual what the listing has
     * @param {number} search what the user wants
     * @return {boolean} True if the if the actual and the want are the same
     */
    applyFilter(actual: boolean, search: boolean): boolean {
        if(actual === search) {
            return true;
        }
        return false;
    }
}