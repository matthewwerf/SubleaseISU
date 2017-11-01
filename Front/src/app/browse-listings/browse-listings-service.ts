import { Component, OnInit } from '@angular/core';
import { ListingInfo } from '../models/listing';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


import { ListingsResponse } from './ListingsResponse';




@Injectable()
export class BrowseListingsService {

  constructor(private http: Http) { }


  getListings(): Observable<ListingInfo[]> {
  	// Get the json data string
  	return this.http.post('/listAllProperties', {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map( res => {
        res.json().results.map(item => {
          return new ListingInfo(
            item._id,
            item.posterUsername,
            item.leasingAgency,
            item.rentValue,
            item.address,
            item.postingMessage,
            item.propertyId);
        });
      }).catch(this.handleError);
  }

      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}