import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.css']
})
export class GooglemapsComponent implements OnInit {

  constructor() { }

  title: string = 'Google Maps';
  lat: number = 42.0308;
  lng: number = -93.6319;


  ngOnInit() {
  }

}
