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
    
  }

}
