//This method of uploading pictures was implemented from https://scotch.io/tutorials/angular-file-uploads-with-an-express-backend

import { Component, OnInit } from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:4200/api/upload';

@Component({
  selector: 'app-picture-test',
  templateUrl: './picture-test.component.html',
  styleUrls: ['./picture-test.component.css']
})
export class PictureTestComponent implements OnInit {

  constructor() { }
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'testImage'});
  title: string
  ngOnInit() {
  	this.title = 'Picture Test';
    //Overide property of uploader so it doesn't authenticate with credentials
  	this.uploader.onAfterAddingFile = (file)=> {file.withCredentials = false;};
    //Overide onCompleteItem property so that we can handle any server response
  	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

}
