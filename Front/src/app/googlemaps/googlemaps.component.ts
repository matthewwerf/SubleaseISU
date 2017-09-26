import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.css']
})
export class GooglemapsComponent implements OnInit {

  constructor() { }

  title: string = 'Google Maps';
  lat: number = 51.678418;
  lng: number = 7.809007;

  ngOnInit() {
  }

}
