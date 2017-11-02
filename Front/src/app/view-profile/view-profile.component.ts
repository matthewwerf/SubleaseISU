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
  firstLoad: boolean = true;

  imagePreview(input) 
  {
      document.getElementById("previewLabel").style.display = 'block';
      console.log("Image is selected")
      var source = (<HTMLInputElement>document.getElementById("previewImage")).files[0];
      var reader = new FileReader();
       
      
      if(source){
        reader.readAsDataURL(source);
      }
      else{
      }
      reader.onload = function(){
        (<HTMLImageElement>document.getElementById('preview')).src = reader.result;
      } 
  }

  ngOnInit() {
    if(this.firstLoad){
          document.getElementById("previewLabel").style.display = 'none';
          this.firstLoad = false
    }
  	this.title = 'View or Update Your Profile';
  	this.uploader.onAfterAddingFile = (file)=> {file.withCredentials = false;};
  	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status, response);
    


    };
  }


}
