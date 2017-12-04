import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import * as sha1 from 'js-sha1'


import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers } from '@angular/http';
import { Router } from '@angular/router';
//import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig } from 'angular4-files-upload/src/app/ng4-files';

import * as crypto from 'crypto-js';
const URL = '/propertyPictures/'
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
      
      //document.getElementById("uploadButt").style.display = 'block';
      document.getElementById("previewLabel").style.display = 'block';
      document.getElementById("clearButt").style.display = 'block';

      if(((<HTMLInputElement>document.getElementById("previewImage")).files[0]) && (this.fileSize < 5))
      {
        this.fileSize = this.source.push((<HTMLInputElement>document.getElementById("previewImage")).files[0]);
        //this.currFile = this.source[0];
        
        //console.log(this.fileSize);
        console.log(this.source);
        
        if(this.source.length < 0)
        {
          console.log("Error");
        }
        else if(this.source.length == 1){
          
          let reader = new FileReader();

          reader.readAsDataURL(this.source[0]);

          reader.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview0')).src = reader.result;
            document.getElementById("previewPic").style.display = 'block';
          }
        }
        else if(this.source.length == 2){
          
          let reader = new FileReader();
          let reader1 = new FileReader();

          reader.readAsDataURL(this.source[0]);
          reader1.readAsDataURL(this.source[1]);
          
          reader.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview0')).src = reader.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader1.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview1')).src = reader1.result;
            document.getElementById("previewPic").style.display = 'block';
          }
        }
        else if(this.source.length == 3){
          
          let reader = new FileReader();
          let reader1 = new FileReader();
          let reader2 = new FileReader();

          reader.readAsDataURL(this.source[0]);
          reader1.readAsDataURL(this.source[1]);
          reader2.readAsDataURL(this.source[2]);

          reader.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview0')).src = reader.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader1.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview1')).src = reader1.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader2.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview2')).src = reader2.result;
            document.getElementById("previewPic").style.display = 'block';
          }
        }
        else if(this.source.length == 4){
          
          let reader = new FileReader();
          let reader1 = new FileReader();
          let reader2 = new FileReader();
          let reader3 = new FileReader();

          reader.readAsDataURL(this.source[0]);
          reader1.readAsDataURL(this.source[1]);
          reader2.readAsDataURL(this.source[2]);
          reader3.readAsDataURL(this.source[3]);

          reader.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview0')).src = reader.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader1.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview1')).src = reader1.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader2.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview2')).src = reader2.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader3.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview3')).src = reader3.result;
            document.getElementById("previewPic").style.display = 'block';
          }
        }
        else if(this.source.length == 5){
          
          let reader = new FileReader();
          let reader1 = new FileReader();
          let reader2 = new FileReader();
          let reader3 = new FileReader();
          let reader4 = new FileReader();

          reader.readAsDataURL(this.source[0]);
          reader1.readAsDataURL(this.source[1]);
          reader2.readAsDataURL(this.source[2]);
          reader3.readAsDataURL(this.source[3]);
          reader4.readAsDataURL(this.source[4]);

          reader.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview0')).src = reader.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader1.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview1')).src = reader1.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader2.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview2')).src = reader2.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader3.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview3')).src = reader3.result;
            document.getElementById("previewPic").style.display = 'block';
          }
          reader4.onload = function(e){
            (<HTMLImageElement>document.getElementById('preview4')).src = reader4.result;
            document.getElementById("previewPic").style.display = 'block';
          }
        }
        else if(this.source.length > 5){
          console.log("too Many");
        }
      }
      else{
        document.getElementById('tooMany').innerText = "Max of 5 images, use clear button to restart"
      }
  }

  clear(){
       //document.getElementById("uploadButt").style.display = 'none';
    document.getElementById("previewLabel").style.display = 'none';
    (<HTMLImageElement>document.getElementById('preview0')).src = "";
    (<HTMLImageElement>document.getElementById('preview1')).src = "";
    (<HTMLImageElement>document.getElementById('preview2')).src = "";
    (<HTMLImageElement>document.getElementById('preview3')).src = "";
    (<HTMLImageElement>document.getElementById('preview4')).src = "";
    this.source = [];
  }

  ngOnInit() {
    this.fileSize = 0;
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
    if ((this.newPropertyForm.valid && this.newAddressForm.valid) && (this.source.length > 0) ){
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

                  let formData: FormData = new FormData();
                  formData.append('username', localStorage.getItem('username'));
                  formData.append('subleaseISUcookie', localStorage.getItem('subleaseISUcookie'));
                  formData.append('propertyID', shaPropertyID);
                  if(this.source.length > 0){
                    let i = 0

                    for(i; i< this.source.length; i++){
                      formData.append('fileArray[]', this.source[i]);
                    }

                    this.http.post(URL + shaPropertyID, formData).subscribe(
                            res => {
                                //console.log(res);
                                 if(!res['error']){
                          console.log("no error");
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
                  }

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

      if(this.source.length < 1) {
        this.errorMessage = this.errorMessage + "*Upload Pictures Please \n";
      }
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
