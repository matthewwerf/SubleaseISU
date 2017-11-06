import { Component, OnInit, ElementRef, Input } from '@angular/core';
//import the file-upload plugin
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
//import the native angular http and respone libraries
import { Http, Response } from '@angular/http';
//import the do function to be used with the http library.
import "rxjs/add/operator/do";
//import the map function to be used with the http library
import "rxjs/add/operator/map";

const URL = '/uploadProfilePicture/' + localStorage.getItem('username');

@Component({
  selector: 'app-picture-test',
  templateUrl: './picture-test.component.html',
  styleUrls: ['./picture-test.component.css']
})
export class PictureTestComponent implements OnInit {

  constructor(private http: Http, private el: ElementRef) { }
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'testImage'});
  title: string
  ngOnInit() {
  	this.title = 'Picture Test';
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            console.log("ImageUpload:uploaded:", item, status, response);
        };
  }
   upload() {
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
        let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('photo', inputEl.files.item(0));
                formData.append('username', localStorage.getItem('username'));
                formData.append('subleasISUcookie', localStorage.getItem('subleaseISUcookie'));
                console.log('Test');
            //call the angular http method
            
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
    			this.http.post(URL, formData).map((res:Response) => res.json()).subscribe(
                //map the success function and alert the response
                 (success) => {
                         alert(success._body);
                },
                (error) => alert(error))
          }
    }

}
