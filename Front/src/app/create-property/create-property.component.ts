import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as sha1 from 'js-sha1'
import { HttpClient } from '@angular/common/http';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig } from 'angular4-files-upload/src/app/ng4-files';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})


export class CreatePropertyComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { 
    
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
  pictureTest: FormControl;
  errorMessage: string;
  hashMe: string;
  addressValue: string;
  sha1hash: string; 
  selectedFiles: any;
  public imageFolder: Array<File>;
  imageFolderSize: number;

  filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFiles = selectedFiles.status;
      console.log('Error during file uploaded');
      
      // Hnadle error statuses here
      
      return;
    }
 
    this.selectedFiles = Array.from(selectedFiles.files).map(file => file);
    console.log(this.selectedFiles);
    this.imageFolderSize = this.imageFolder.push(this.selectedFiles);
    console.log('Number of Images:' + this.imageFolderSize + 'Images:' + this.imageFolder);
  }


  ngOnInit() {
    this.createFormControls();
    this.getPosterUsername();
    this.createPicures();
    //this.createPropertyID();
    this.createAddressForm();
    this.createForm();
    
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
    //console.log(this.linkedPictureIDs.value);
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
      console.log(this.selectedFiles);
      console.log("New Property Request Submitted");
      this.getAddress();
      this.createPropertyID();
      console.log(this.newPropertyForm.value);
      let headers = new Headers({'Content-Type' : 'application/json'});
      this.http.post('/properties', {
          posterUsername: this.posterUsername.value,
          leasingAgency: this.leasingAgency.value,
          rentValue: this.rentValue.value,
          address: this.address.value,
          postingMessage: this.postingMessage.value,
          linkedPictureIDs: this.linkedPictureIDs.value,
          propertyID: this.propertyID.value
        }, headers).subscribe(
            res => {
                console.log(res);
                 if(!res['error']){
          console.log("no error");
          this.router.navigate(['main']);
        } else {
          console.log(res['error']);
        }
           //this.router.navigate(['login']);
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
