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
  	posterUsername: FormControl;
	leasingAgency: FormControl;
	rentValue: FormControl;
	address: FormControl;
	postingMessage: FormControl;
	linkedPictureIDs: FormControl;
	propertyID: FormControl;

  	ngOnInit() {
  		this.createFormControls();
  		this.createForm();
  }

  createFormControls() {
  	this.posterUsername = new FormControl('', Validators.required);
  	this.leasingAgency = new FormControl('', Validators.required);
  	this.rentValue = new FormControl('', [Validators.required, Validators.pattern("[0-9]*")]);
  	this.address = new FormControl('', Validators.required);
  	this.postingMessage = new FormControl();
  	

  }

  createPicures() {
  	//Figure out how to upload images
  	//this.linkedPictureIDs = new FormControl();
  }

  createPropertyID() {
  	//Figure out how to generate unique propertyID

  }

  createForm() {
  	this.newPropertyForm = new FormGroup ({
  		posterUsername: this.posterUsername,
		leasingAgency: this.leasingAgency,
		rentValue: this.rentValue,
		address: this.address,
		postingMessage: this.postingMessage,
		linkedPictureIDs: this.linkedPictureIDs,
		propertyID: this.propertyID
  	});
  }
  onsubmit() {
  	if (this.newPropertyForm.valid) {
  		console.log("New Property Request Submitted");
  		this.newPropertyForm.reset();
  		//send json to server via http
  	}
  }
}
