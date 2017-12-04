import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ListingInfo } from '../models/listing';
//import { Headers, Http } from '@angular/http';
import { CommentInfo } from '../models/commentInfo';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, Http, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const URL = '/propertyComment/';
@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.css']
})
export class ViewListingComponent implements OnInit {

	private propID: string;
	private sub: any;
	private currentListing: ListingInfo;
	private isLoaded: boolean;
  private commentBody: string;
  private time: string;
  private newComment: CommentInfo;
  private isLoaded2: boolean;
  private commentArray: Array<CommentInfo>;
  private URL2: string;
  private avgRating: number;
  private rating: number;
  private ratingMessage: string ="Not Rated";
  private textMessage: FormControl;
  private newMessageForm: FormGroup;
  private pictureID: Array<any>;
  private imageMessage: string;
  private ratingArray: Array<any>;
  private emailSubject: string;
  private emailBody: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    document.getElementById("prop1").style.display = 'none';
    document.getElementById("prop2").style.display = 'none';
    document.getElementById("prop3").style.display = 'none';
    document.getElementById("prop4").style.display = 'none';
    (<HTMLImageElement>document.getElementsByClassName("back")[0]).style.display = 'none';

    this.commentArray = [];

  	this.isLoaded = false;
  	this.sub = this.route.params.subscribe(params => {
       this.propID = params.propertyId;
  	});

  	this.getListing().subscribe(listing => {
  		this.currentListing = listing;
      this.commentArray = listing.comments;
      this.pictureID = listing.linkedPictureIDs;
      this.ratingArray = listing.ratings;
      //console.log(this.pictureID.length);

      if(this.pictureID.length < 1){
        this.imageMessage = "Unfortunately, the property owner has not uploaded any pictures";
        document.getElementById('prop0').style.display = 'none';
      }
      else if(this.pictureID.length == 1){
        (<HTMLImageElement>document.getElementsByClassName("next")[0]).style.display = 'none';
        this.imageMessage = "Click cover image below to view property image";
      }else{
        this.imageMessage = "Click cover image below to view all " + this.pictureID.length + " images";
      }
      for(let i = 0; i< this.pictureID.length; i++){
        //console.log(this.pictureID[i]);
        this.http.post('/retrievePropertyPicture', {
          username: localStorage.getItem('username'),
          subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
          pictureLocation: this.pictureID[i]
        },
        {
          responseType: 'blob'
        }).subscribe(res => {
            if(!res['error']){
              //console.log(res);

              //Used to load all the images to hidden html elements so we can use them later
              let reader2 = new FileReader();
              let propertyStr = "prop" + i;
              if(res){
                //console.log("test")
                reader2.readAsDataURL(res);
              }else{
                console.log("Aww man")
              }
              reader2.onload = function(){
                //localStorage.setItem('profPic', JSON.stringify(inputEl.files[0]));
                //console.log("test");
                (<HTMLImageElement>document.getElementById(propertyStr)).src = reader2.result;
              }

              return res;
            }else {
              console.log(res['error']);
            }
          },
          err => {
            console.log("there was an error");
            console.log(err);
          });
      }

      var counter = 0;
      var length = this.pictureID.length - 1;
      // Get the modal
      var modal = document.getElementById('myModal');

      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var img = (<HTMLImageElement>document.getElementById('prop0'));
      var modalImg = (<HTMLImageElement>document.getElementById("img01"));
      var captionText = document.getElementById("caption");

      img.onclick = function(){
          modal.style.display = "block";
          modalImg.src = (<HTMLImageElement>this).src;
          captionText.innerHTML = (counter + 1) + "/" + (length + 1);
      }

      // Get the <span> element that closes the modal
      var span = (<HTMLImageElement>document.getElementsByClassName("close")[0]);
      var next = (<HTMLImageElement>document.getElementsByClassName("next")[0]);
      var back = (<HTMLImageElement>document.getElementsByClassName("back")[0]);
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() { 
        modal.style.display = "none";
      }
      next.onclick = function() {
        (<HTMLImageElement>document.getElementsByClassName("back")[0]).style.display = 'block';
        if(counter < length)
        {
          counter = counter + 1;
          modalImg.src = (<HTMLImageElement>document.getElementById('prop' + counter)).src;
          captionText.innerHTML = (counter + 1) + "/" + (length + 1);
          if(counter == length){
            (<HTMLImageElement>document.getElementsByClassName("next")[0]).style.display = 'none';
          }
        }
      }

      back.onclick = function() {
        (<HTMLImageElement>document.getElementsByClassName("next")[0]).style.display = 'block';
        if(counter > 0)
        {
          counter = counter - 1;
          modalImg.src = (<HTMLImageElement>document.getElementById('prop' + counter)).src;
          captionText.innerHTML = (counter + 1) + "/" + (length + 1);
          if(counter == 0){
            (<HTMLImageElement>document.getElementsByClassName("back")[0]).style.display = 'none';
          }
        }
      }

      if(this.ratingArray != null)
      {
        this.getAverage().subscribe(rating => {
          this.avgRating = <number>rating;
          this.avgRating = Math.round(this.avgRating * 10)/10;
          if(this.avgRating == null)
          {
            //this.avgRating == 0;
          }
        });
      }



      // Get the modal
      var modal1 = document.getElementById('myModal1');

      // Get the button that opens the modal
      var btn = document.getElementById("myBtn");

      // Get the <span> element that closes the modal
      var span1 = (<HTMLImageElement>document.getElementsByClassName("close1")[0]);

      // When the user clicks on the button, open the modal 
      btn.onclick = function() {
          modal1.style.display = "block";
      }

      // When the user clicks on <span> (x), close the modal
      span1.onclick = function() {
          modal1.style.display = "none";
      };

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal1) {
              modal1.style.display = "none";
          }
      };

  		this.isLoaded = true;
  	});

  	  // Create the form used to send messages
      this.createFormControls();
      this.createForm();
	}

  email(){
    document.getElementById('myModal1').style.display = "none";
    this.emailSubject = (<HTMLInputElement>document.getElementById("emailSubject")).value;
    this.emailBody = (<HTMLInputElement>document.getElementById("emailBody")).value;
    console.log(this.emailSubject);
    console.log(this.emailBody);

    this.http.post('/emailOwner/' + this.propID, {
      username: localStorage.getItem('username'),
      subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
      subject: this.emailSubject,
      messageHTML: this.emailBody
    }).subscribe(
      res => {
        if(!res['error']){
          console.log(res);
        }else{
          console.log(res['error']);
        }
      },
      err => {
        console.log("there was an error");
        console.log(err);
      }
    );

    // Get the modal
    var modal2 = document.getElementById('myModal2');

    // Get the <span> element that closes the modal
    var span2 = (<HTMLImageElement>document.getElementsByClassName("close2")[0]);
    
    modal2.style.display = "block";
    
    // When the user clicks on <span> (x), close the modal
    span2.onclick = function() {
        modal2.style.display = "none";
    };

    (<HTMLInputElement>document.getElementById("emailSubject")).value = "";
    (<HTMLInputElement>document.getElementById("emailBody")).value = "";
  }

  getRating(){
    if((<HTMLInputElement>document.getElementById('one')).checked){
      this.rating = 1;
    }
    if((<HTMLInputElement>document.getElementById('two')).checked){
      this.rating = 2;
    }
    if((<HTMLInputElement>document.getElementById('three')).checked){
      this.rating = 3;
    }
    if((<HTMLInputElement>document.getElementById('four')).checked){
      this.rating = 4;
    }
    if((<HTMLInputElement>document.getElementById('five')).checked){
      this.rating = 5;
    }
    if(this.rating == null)
    {
      document.getElementById('ratingError').innerText = "UHHH Rate Me PLS";
    }
    else{
      document.getElementById('ratingError').innerText = "";
      this.http.post('/propertyRating/' + this.propID, {
        username: localStorage.getItem('username'),
        subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
        ratingPosterUsername: localStorage.getItem('username'),
        rating: this.rating
      }).subscribe(res => {
                  //console.log(res);
                    if(!res['error']){
                      console.log("no error");
                      this.getAverage().subscribe(rating => {
                        this.avgRating = <number>rating;
                        console.log(this.avgRating);
                        this.avgRating = Math.round(this.avgRating * 10)/10;
                        if(this.avgRating == null)
                        {
                          //this.avgRating == 0;
                        }
                      });
                    } else {
                      console.log(res['error']);
                    }
              },
              err => {
                console.log("there was an error");
                console.log(err);
              });
    }
  }

  comment(){
    this.commentBody = (<HTMLInputElement>document.getElementById("comment")).value;
    this.time = (new Date().toLocaleDateString()) + " " +(new Date().toLocaleTimeString());
    this.newComment = new CommentInfo(localStorage.getItem('username'), this.time, this.commentBody);
    this.URL2 = URL + this.propID;
    this.http.post(this.URL2, {
      username: localStorage.getItem('username'),
      subleaseISUcookie: localStorage.getItem('subleaseISUcookie'), 
      message: this.commentBody
    }).subscribe(
              res => {
                   if(!res['error']){
            console.log("no error");
            this.isLoaded = false;
            this.getListing().subscribe(listing => {
            this.currentListing = listing;
            this.commentArray = listing.comments;
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
    (<HTMLInputElement>document.getElementById("comment")).value = "";
    
  }

  getAverage(){
    console.log("test");
    return this.http.get<any>('/propertyRating/' + this.propID).map(res => {
      if(!res['error']){
        this.ratingMessage = "";
        return res.avgRating;
      }
      else{
        this.ratingMessage = "Not Rated"
      }
    });
  }
    createFormControls() {
      this.textMessage = new FormControl('');
    }

    createForm() {
    this.newMessageForm = new FormGroup ({
        textMessage: this.textMessage,
     });
    }

    onSubmit(form: any): void{
      if(this.textMessage.value != '') {
        this.http.post('/messages/saveHistory', {
          username: localStorage.getItem('username'),
          subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
          senderUsername: localStorage.getItem('username'),
          receiverUsername: this.currentListing.posterUsername,
          message: this.textMessage.value}
        ).subscribe(res => {
          if(!res['error']){
          window.alert("Message sent, you can see your messages in messages tab.");
          this.newMessageForm.reset(); // Clear the chat box
        }
        else {
          window.alert("There was an error in sending the message.");
        }
      });
      }
     }



	getListing(): Observable<ListingInfo> {
  	// Get the json data string
  	return this.http.post<ListingInfo>('/property/' + this.propID, {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
      console.log(res);

  		return new ListingInfo(
             res._id,
             res.posterUsername,
             res.leasingAgency,
             res.rentValue,
             res.address,
             res.postingMessage,
             res.propertyId,
             res.bathroomQuantity,
             res.roommateQuantity,
             res.personalBathroom,
             res.comments,
             res.linkedPictureIDs,
             res.ratings
             );
      });
  }
}
