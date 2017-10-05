import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as sha1 from 'js-sha1'


@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})
export class CreatePropertyComponent implements OnInit {

  constructor() { 

  }

  newPropertyForm: FormGroup;
  newAddressForm: FormGroup;
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
  errorMessage: string;
  hashMe: string;
  addressValue: string;
  sha1hash: string; 

  ngOnInit() {
    this.createFormControls();
    this.getPosterUsername();
    this.createPicures();
    this.createPropertyID();
    this.createAddressForm();
    this.createForm();
    console.log(this.streetAddress.value);
  }

  createFormControls() {
    this.propertyID = new FormControl();
    this.address = new FormControl();
    this.streetAddress = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.state = new FormControl('', Validators.required);
    this.zip = new FormControl('', Validators.required);
    this.leasingAgency = new FormControl('', Validators.required);
    this.rentValue = new FormControl('', Validators.required);
    this.postingMessage = new FormControl();
  }

  getAddress(){
    this.addressValue = this.streetAddress.value + ", " + this.city.value + ", " + this.state.value + " " + this.zip.value;
    this.address.setValue(this.addressValue);
  }

  getPosterUsername() {
    //How do we retrieve the poster's username?
    this.posterUsername = new FormControl();
  }
  createPicures() {
    //Still need to figure out how to upload images
    this.linkedPictureIDs = new FormControl();
  }

  createPropertyID() {
    // var sha1 = require('sha1');
    this.hashMe = this.address.value + ", " + this.posterUsername;
    this.sha1hash = sha1(this.hashMe);
    this.propertyID.setValue(this.sha1hash);
  }


  createAddressForm(){
    this.newAddressForm = new FormGroup ({
      streetAddress: this.streetAddress,
      city: this.city,
      state: this.state,
      zip: this.zip
    });
  }

  createForm() {
    this.newPropertyForm = new FormGroup ({
      posterUsername: this.posterUsername,
      address: this.address,
      leasingAgency: this.leasingAgency,
      rentValue: this.rentValue,
      postingMessage: this.postingMessage,
      linkedPictureIDs: this.linkedPictureIDs,
      propertyID: this.propertyID
    });
  }

  onSubmit() {
    if (this.newPropertyForm.valid && this.newAddressForm.valid) {
      console.log("New Property Request Submitted");
      this.getAddress();
      this.createPropertyID();
      console.log(this.newPropertyForm.value);
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
