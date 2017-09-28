import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})
export class CreatePropertyComponent implements OnInit {

    //constructor() { }

    newPropertyForm: FormGroup;
    posterUsername: FormControl;
    leasingAgency: FormControl;
    rentValue: FormControl;
    address: FormControl;
    postingMessage: FormControl;
    linkedPictureIDs: FormControl;
    propertyID: FormControl;
    errorMessage: string; 

    ngOnInit() {
      this.createFormControls();
      this.getPosterUsername();
      this.createPicures();
      this.createPropertyID();
      this.createForm();
  }

  createFormControls() {
    //this.posterUsername = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.leasingAgency = new FormControl('', Validators.required);
    this.rentValue = new FormControl('', Validators.required);//[Validators.required, Validators.pattern("[0-9]*")]);
    this.postingMessage = new FormControl();
    

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
