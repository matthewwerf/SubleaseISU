import { Component, OnInit } from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { UserInfo } from '../models/userInfo';
import { UserInfoService } from './user-info-service';

const URL = 'http://uploadProfilePicture/' + localStorage.getItem('username');

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userInfoService: UserInfoService) { }
  title: string;

  private UserInfoList: UserInfo;
  private isLoaded: boolean;

  uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'newProfilePicture'});
  firstLoad: boolean = true;
  fileSize: number;
  source: Array<File>;



  imagePreview() 
  {
      document.getElementById("previewLabel").style.display = 'block';
      console.log("Image is selected")
      //this.fileSize = (<HTMLInputElement>document.getElementById("previewImage")).files;
      //console.log(this.fileSize);
      this.fileSize = this.source.push((<HTMLInputElement>document.getElementById("previewImage")).files[0]);
      var reader = new FileReader();
      console.log(this.source);
      // if(){

      // } 
      
      if(this.source){
        reader.readAsDataURL(this.source[0]);
      }
      else{
      }
      reader.onload = function(){
        (<HTMLImageElement>document.getElementById('preview')).src = reader.result;
      }

  }

  ngOnInit() {

    this.isLoaded = false;
    this.userInfoService.getUserInfo().subscribe( UserInfo => {
      this.UserInfoList = UserInfo;
      this.isLoaded = true;
    });

    if(this.firstLoad){
          document.getElementById("previewLabel").style.display = 'none';
          this.firstLoad = false;
    }
    this.source = [];
  	this.title = 'View or Update Your Profile';
  	this.uploader.onAfterAddingFile = (file)=> {file.withCredentials = false;};
  	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status, response);
    


    };
  }


}
