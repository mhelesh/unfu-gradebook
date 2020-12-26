import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Input() user;
  @Output() logout: EventEmitter<boolean> = new EventEmitter<boolean>();

  signOut() {
    this.logout.emit(true);
  }
  constructor() { }

  ngOnInit() { }

}
