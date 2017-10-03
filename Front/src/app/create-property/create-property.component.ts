import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})
export class CreatePropertyComponent implements OnInit {

    constructor() { }

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
  }

  createFormControls() {
    //this.posterUsername = new FormControl('', Validators.required);
    //this.address = new FormControl('', Validators.required);
    this.streetAddress = new FormControl('', Validators.required);
    //console.log(this.streetAddress.value);
    this.city = new FormControl('', Validators.required);
    this.state = new FormControl('', Validators.required);
    this.zip = new FormControl('', Validators.required);
    this.leasingAgency = new FormControl('', Validators.required);
    this.rentValue = new FormControl('', Validators.required);//[Validators.required, Validators.pattern("[0-9]*")]);
    this.postingMessage = new FormControl();
    

  }

  getAddress(){
    this.address = new FormControl();
    this.addressValue = this.streetAddress.value + ", " + this.city.value + ", " + this.state.value + " " + this.zip.value
    console.log(this.streetAddress.value);
    this.address.setValue(this.addressValue);
  }

  getPosterUsername() {
    //Retrieve poster's username via http GET method
    this.posterUsername = new FormControl();
  }
  createPicures() {
    //Figure out how to upload images
    this.linkedPictureIDs = new FormControl();
  }

  createPropertyID() {
    //Figure out how to generate unique propertyID
    this.propertyID = new FormControl();
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
      console.log(this.streetAddress.value);
      this.newPropertyForm.reset();
      this.errorMessage = "";
      document.getElementById("errorMsg").innerText = this.errorMessage;
      //send json to server via http POST method
    }
    else {
      this.errorMessage = "Invalid entries at: \n";
      
      if(this.address.invalid) {
        this.errorMessage = this.errorMessage + "*Address \n";
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
