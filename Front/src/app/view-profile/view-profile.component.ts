import { Component, OnInit, ElementRef, Input} from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { UserInfo } from '../models/userInfo';
import { UserInfoService } from './user-info-service';

import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

const URL = '/uploadProfilePicture/' + localStorage.getItem('username');

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private userInfoService: UserInfoService, private http: HttpClient, private el: ElementRef) { }
  title: string;

  private UserInfoList: UserInfo;
  private isLoaded: boolean;

  uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'fileName'});
  firstLoad: boolean = true;
  fileSize: number;
  source: Array<File>;
  currFile: File;
  oldFile: File;

  imagePreview() 
  {
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
      }
  }
  
  uploadGang(){
    let formData: FormData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    formData.append('subleaseISUcookie', localStorage.getItem('subleaseISUcookie'));
    formData.append('fileName', this.currFile);
    console.log();
    this.http.post(URL, formData, this.header).subscribe(
        res => {
          console.log(res);
          if(!res['error'])
          {
            console.log("no error");
          } 
          else 
          {
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

  ngOnInit() {

    this.isLoaded = false;
    this.userInfoService.getUserInfo().subscribe( UserInfo => {
      this.UserInfoList = UserInfo;
      console.log(this.UserInfoList)
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
