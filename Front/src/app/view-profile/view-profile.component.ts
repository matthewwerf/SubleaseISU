import { Component, OnInit, ElementRef, Input} from '@angular/core';
//import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Router } from '@angular/router';
import { UserInfo } from '../models/userInfo';
import { UserInfoService } from './user-info-service';
import { ProfilePictureGrabService } from './profile-picture-grab-service';

import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as crypto from 'crypto-js';

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

const URL = '/uploadProfilePicture/' + localStorage.getItem('username');
const URL2 = '/users/' + localStorage.getItem('username');

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  //private header = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  constructor(private userInfoService: UserInfoService, private profilePictureGrabService: ProfilePictureGrabService, private http: HttpClient, private el: ElementRef, private router: Router) { }
  title: string;

  private UserInfoList: UserInfo;
  private isLoaded: boolean;

  //uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'fileName'});
  firstLoad: boolean = true;
  fileSize: number;
  source: Array<File>;
  profilePic: File;
  currFile: File;
  oldFile: File;
  newPassword: string;
  newEmail: string;
  newPhone: string;
  retrievePic: any;

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
  


  clear(){
    (<HTMLInputElement>document.getElementById("previewImage")).value = "";
    document.getElementById("clearButt").style.display = 'none';
    document.getElementById("uploadButt").style.display = 'none';
    document.getElementById("previewPic").style.display = 'none';
  }
  uploadGang(){
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#previewImage');
    let fileCount: number = inputEl.files.length;
    let formData: FormData = new FormData();
    var reader2 = new FileReader();
    this.profilePic = inputEl.files[0];
    if(this.profilePic){
      reader2.readAsDataURL(this.profilePic);
    }else{
    }
    reader2.onload = function(){
        localStorage.setItem('profPic', JSON.stringify(inputEl.files[0]));
        (<HTMLImageElement>document.getElementById('profilePic')).src = reader2.result;
    }

    formData.append('username', localStorage.getItem('username'));
    formData.append('subleaseISUcookie', localStorage.getItem('subleaseISUcookie'));
    if(fileCount > 0){
      formData.append('fileName', inputEl.files[0]);
      console.log(inputEl.files[0]);
      this.http.post(URL, formData).subscribe(
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

  }

  updatePassword(){
    this.newPassword = (<HTMLInputElement>document.getElementById('newPassword')).value;
    console.log(this.newPassword);
    document.getElementById("rowOne").style.display = 'none';
    document.getElementById("b1").style.display = 'block';
    if(this.newPassword.length > 8){
      var hashedPassword = crypto.SHA1(this.newPassword);
      console.log(hashedPassword.toString());
      document.getElementById("invalidPassword").style.display = 'none';
      // this.http.put(URL2, {username: localStorage.getItem('username'),
      //                         subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
      //                         hashedPassword: hashedPassword.toString()
      //                       }).subscribe(
      //         res => {
      //             //console.log(res);
      //             if(!res['error']){
      //               console.log("no error");
      //               localStorage.setItem('subleaseISUcookie', res['subleaseISUcookie'].value )

      //             } else {
      //               console.log(res['error']);
      //             }
                     
      //                 },
      //                 err => {
      //                 console.log("there was an error");
      //             console.log(err);
      //                 }
      //               );
    }else{
      console.log("Invalid Password")
      document.getElementById("invalidPassword").style.display = 'block';
    }
  }
  updateEmail(){
    this.newEmail = (<HTMLInputElement>document.getElementById('newEmail')).value;
    console.log(this.newEmail);
    document.getElementById("rowTwo").style.display = 'none';
    document.getElementById("b2").style.display = 'block';
    if(this.newEmail.includes('@') && this.newEmail.includes('.')){
      document.getElementById("invalidEmail").style.display = 'none';
      this.http.put(URL2, {username: localStorage.getItem('username'),
                              subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
                              email: this.newEmail 
                            }).subscribe(
              res => {
                  //console.log(res);
                   if(!res['error']){
            console.log("no error");
            this.isLoaded = false;
            
            this.userInfoService.getUserInfo().subscribe( UserInfo => {
              this.UserInfoList = UserInfo;
              console.log(this.UserInfoList)
              this.isLoaded = true;
            });

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
      else{
        console.log("Invalid Email Address")
        document.getElementById("invalidEmail").style.display = 'block';
      }
  }

  updatePhone(){
    this.newPhone = (<HTMLInputElement>document.getElementById('newPhone')).value;
    console.log(this.newPhone);
    document.getElementById("rowThree").style.display = 'none';
    document.getElementById("b3").style.display = 'block';
    if(this.newPhone.length == 10 && !(isNaN(Number(this.newPhone)))){
      document.getElementById("invalidPhone").style.display = 'none';
      this.http.put(URL2, {username: localStorage.getItem('username'),
                              subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
                              phoneNumber: this.newPhone 
                            }).subscribe(
              res => {
                  //console.log(res);
                   if(!res['error']){
            console.log("no error");
            this.isLoaded = false;
            
            this.userInfoService.getUserInfo().subscribe( UserInfo => {
              this.UserInfoList = UserInfo;
              console.log(this.UserInfoList)
              this.isLoaded = true;
            });

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
      }else{
        console.log("Invalid Phone Number");
        document.getElementById("invalidPhone").style.display = 'block';
      }
  }

  cancel(){
    document.getElementById("rowOne").style.display = 'none';
    document.getElementById("rowTwo").style.display = 'none';
    document.getElementById("rowThree").style.display = 'none';
    document.getElementById("b1").style.display = 'block';
    document.getElementById("b2").style.display = 'block';
    document.getElementById("b3").style.display = 'block';
  }

  showRowOne(){
    document.getElementById("rowOne").style.display = 'block';
    document.getElementById("b1").style.display = 'none';
  }
  showRowTwo(){
    document.getElementById("rowTwo").style.display = 'block';
    document.getElementById("b2").style.display = 'none';
  }
  showRowThree(){
    document.getElementById("rowThree").style.display = 'block';
    document.getElementById("b3").style.display = 'none';
  }

  ngOnInit() {
    this.isLoaded = false;
    this.userInfoService.getUserInfo().subscribe( UserInfo => {
      this.UserInfoList = UserInfo;
      console.log(this.UserInfoList);
      this.isLoaded = true;
    });

    this.profilePictureGrabService.getProfilePic().subscribe( data => {
      this.retrievePic = data;
      //console.log(this.retrievePic);
    

      var reader2 = new FileReader();
      this.profilePic = this.retrievePic;
      if(this.profilePic){
        //console.log("test")
        reader2.readAsDataURL(this.profilePic);
      }else{
        console.log("wtfffff")
      }
      reader2.onload = function(){
        //localStorage.setItem('profPic', JSON.stringify(inputEl.files[0]));
        //console.log("test");
        (<HTMLImageElement>document.getElementById('profilePic')).src = reader2.result;
      }
    });
    this.source = [];
  	this.title = 'View or Update Your Profile';
  	
  }


}
