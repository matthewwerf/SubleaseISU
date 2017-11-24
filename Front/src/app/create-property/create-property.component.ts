import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import * as sha1 from 'js-sha1'


import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig } from 'angular4-files-upload/src/app/ng4-files';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})


export class CreatePropertyComponent implements OnInit {

  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient, private router: Router) { 
    
  }
  
  
  
  newPropertyForm: FormGroup;
  newAddressForm: FormGroup;

  housingType: FormControl;
  bathroomQuantity: FormControl;
  roommateQuantity: FormControl;
  personalBathroom: FormControl;

  posterUsername: FormControl;
  leasingAgency: FormControl;
  rentValue: FormControl;
  address: FormControl;
  streetAddress: FormControl;
  city: FormControl;
  state: FormControl;
  zip: FormControl;
  postingMessage: FormControl;
  linkedPictureIDs: FormControl;
  propertyID: FormControl;
  pictureTest: FormControl;
  errorMessage: string;
  hashMe: string;
  addressValue: string;
  sha1hash: string; 
  source: Array<File>;
  currFile: File;
  oldFile: File;
  fileSize: number;

  imagePreview() 
  {
      document.getElementById("clearButt").style.display = 'block';
      document.getElementById("uploadButt").style.display = 'block';
      document.getElementById("previewLabel").style.display = 'block';
      
      if(this.source.length > 0){
        this.oldFile = this.source.pop();
      }
      this.fileSize = this.source.push((<HTMLInputElement>document.getElementById("previewImage")).files[0]);
      this.currFile = this.source[0];
      var reader = new FileReader();
      console.log(this.source);
      
      if(this.source){
        reader.readAsDataURL(this.currFile);
        //reader.readAsDataURL(this.oldFile);
      }
      else{
      }


      reader.onload = function(){
        (<HTMLImageElement>document.getElementById('preview')).src = reader.result;
        document.getElementById("previewPic").style.display = 'block';
      }

  }


  ngOnInit() {
    this.source = [];
    this.createFormControls();
    this.getPosterUsername();
    this.createPicures();
    //this.createPropertyID();
    this.createAddressForm();
    this.createForm();

  }

  
  createFormControls() {
    this.posterUsername = new FormControl();
    this.propertyID = new FormControl();
    this.address = new FormControl();
    this.housingType = new FormControl();
    this.streetAddress = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.state = new FormControl('', Validators.required);
    this.zip = new FormControl('', Validators.required);
    this.leasingAgency = new FormControl('', Validators.required);
    this.rentValue = new FormControl('', Validators.required);
    this.postingMessage = new FormControl();

    this.personalBathroom = new FormControl();
    this.bathroomQuantity = new FormControl();
    this.roommateQuantity = new FormControl();
  }

  getHousingType(){
    if((<HTMLInputElement>document.getElementById('apartment')).checked){
      this.housingType.setValue("apartment");
    }
    else{
      this.housingType.setValue("house");
    }
  }

  getAddress(){
    this.addressValue = this.streetAddress.value + ", " + this.city.value + ", " + this.state.value + " " + this.zip.value;
    this.address.setValue(this.addressValue);
  }

  getPosterUsername() {
    
    this.posterUsername.setValue(localStorage.getItem('username'));
  }
  createPicures() {
    //Still need to figure out how to upload images
    //this.linkedPictureIDs = new FormControl();
    //console.log(this.linkedPictureIDs.value);
    //this.linkedPictureIDs.setValue(this.imageFolder);
  }

  createPropertyID() {
    // var sha1 = require('sha1');
    this.hashMe = this.address.value + " " + localStorage.getItem('username');
    this.sha1hash = crypto.SHA1(this.hashMe);
    this.propertyID.setValue(this.sha1hash);
  }


  createAddressForm(){
    this.newAddressForm = new FormGroup ({
      streetAddress: this.streetAddress,
      city: this.city,
      state: this.state,
      zip: this.zip,
      personalBathroom: this.personalBathroom,
      bathroomQuantity: this.bathroomQuantity,
      roommateQuantity: this.roommateQuantity
    });
  }

  createForm() {
    this.newPropertyForm = new FormGroup ({
      housingType: this.housingType,
      personalBathroom: this.personalBathroom,
      bathroomQuantity: this.bathroomQuantity,
      roommateQuantity: this.roommateQuantity,
      posterUsername: this.posterUsername,
      address: this.address,
      leasingAgency: this.leasingAgency,
      rentValue: this.rentValue,
      postingMessage: this.postingMessage,
      //linkedPictureIDs: this.linkedPictureIDs,
      propertyID: this.propertyID
    });
  }

  onSubmit() {
    if (this.newPropertyForm.valid && this.newAddressForm.valid) {
      //console.log(this.selectedFiles);
      console.log("New Property Request Submitted");
      this.getHousingType();
      this.getAddress();
      this.createPropertyID();
      this.createPicures();
      
      if(!this.personalBathroom.value){
        this.personalBathroom.setValue(false);
      }
      console.log(this.newPropertyForm.value);
      console.log(this.personalBathroom.value);
      //let headers = new Headers({'Content-Type' : 'application/json'});
      var localUsername = localStorage.getItem('username');
      var d = new Date();
      var shaPropertyID = crypto.SHA1(localUsername + d.getTime()).toString();
      //console.log(shaPropertyID);
      this.http.post('/properties', {
	        username: localUsername,
          housingType: this.housingType.value,
          personalBathroom: this.personalBathroom.value,
          bathroomQuantity: this.bathroomQuantity.value,
          roommateQuantity: this.roommateQuantity.value,
          posterUsername: this.posterUsername.value,
          leasingAgency: this.leasingAgency.value,
          rentValue: this.rentValue.value,
          address: this.address.value,
          postingMessage: this.postingMessage.value,
          //linkedPictureIDs: this.linkedPictureIDs.value,
          propertyID: shaPropertyID, //change back to use function later
	        subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
        }, this.header).subscribe(
            res => {
                //console.log(res);
                if(!res['error']){
                  console.log("no error");
                  this.router.navigate(['main']);
                } 
                else {
                console.log(res['error']);
                }
            },
            err => {
              console.log("there was an error");
              console.log(err);
            }
          );
      //For some reason this.streetAddress logs a value here but not in the code above
      this.newAddressForm.reset();
      this.newPropertyForm.reset();
      this.errorMessage = "";
      document.getElementById("errorMsg").innerText = this.errorMessage;
      //send json to server via http POST method

    }
    else {
      this.errorMessage = "Invalid entries at: \n";
      
      if(this.streetAddress.invalid) {
        this.errorMessage = this.errorMessage + "*Street Address \n";
      }
      if(this.city.invalid) {
        this.errorMessage = this.errorMessage + "*City \n";
      }
      if(this.state.invalid) {
        this.errorMessage = this.errorMessage + "*State \n";
      }
      if(this.zip.invalid) {
        this.errorMessage = this.errorMessage + "*Zip Code \n";
      }
      if(this.leasingAgency.invalid) {
        this.errorMessage = this.errorMessage + "*Leasing Agency \n";
      }
      if(this.rentValue.invalid) {
        this.errorMessage = this.errorMessage + "*Rent Value \n";
      }
      if(this.postingMessage.invalid) {
        this.errorMessage = this.errorMessage + "*Property Description \n";
      }
      document.getElementById("errorMsg").innerText = this.errorMessage;
      
    }
  }
}
