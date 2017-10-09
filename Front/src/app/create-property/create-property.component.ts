import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';



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
  testStr: string;
  addressValue: string; 

  ngOnInit() {
    this.createFormControls();
    this.getAddress();
    this.getPosterUsername();
    this.createPicures();
    this.createPropertyID();
    this.createAddressForm();
    this.createForm();
    console.log(this.streetAddress.value);
  }

  createFormControls() {
    
    this.streetAddress = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.state = new FormControl('', Validators.required);
    this.zip = new FormControl('', Validators.required);
    this.leasingAgency = new FormControl('', Validators.required);
    this.rentValue = new FormControl('', Validators.required);
    this.postingMessage = new FormControl();
  }

  getAddress(){
    //this.streetAddress.value, this.city.value, this.state.value, and this.zip.value
    //are not saving any values, they remain empty for some reason, however in the onSubmit() method they have values in them
    this.address = new FormControl();
    this.addressValue = this.streetAddress.value + ", " + this.city.value + ", " + this.state.value + " " + this.zip.value
    //this.addressValue is empty for some reason
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
    //Figure out how to generate unique propertyID
    //Sha1 hash not working, referencing from these websites:
    //https://www.npmjs.com/package/sha1
    //https://www.npmjs.com/package/@types/sha1
    
    this.propertyID = new FormControl();
    // var sha1 = require('sha1');
    // this.testStr = sha1('message');
    // console.log(this.testStr);
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
    if (this.newPropertyForm.valid) {
      console.log("New Property Request Submitted");
      console.log(this.newPropertyForm.value);
      //For some reason this.streetAddress logs a value here but not in the code above
      console.log(this.streetAddress.value);
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
