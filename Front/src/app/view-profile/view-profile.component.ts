import { Component, OnInit } from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:4200/api/upload';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor() { }
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'newProfilePicture'});
  title: string;
  previewImage: any;
  tempImage: any;
  source: string;

  imagePreview(input) 
  {
      document.getElementById("previewImage").style.display="block";
      
        console.log("Image is selected")
        this.previewImage = document.getElementById("previewImage");
        console.log(this.previewImage);
        
        this.source = (<HTMLImageElement>document.getElementById('previewImage')).src
        console.log("Image Source: " + this.source + " Should be inbetween here");
        
      
      //var reader = new FileReader();
        
        //console.log(this.previewImage);
      
  }

  ngOnInit() {
  	this.title = 'View or Update Your Profile';
  	this.uploader.onAfterAddingFile = (file)=> {file.withCredentials = false;};
  	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status, response);
    //this.imagePreview();


    };
  }


}
