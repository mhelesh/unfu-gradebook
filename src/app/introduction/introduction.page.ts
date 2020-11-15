import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage {

  constructor(private storage: Storage, private router: Router) { }

  @ViewChild('slides') slides;

  async finish() {
    await this.storage.set('introductionShown', true);
  }

  next() {
    this.slides.slideNext();
  }
}
