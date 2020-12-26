import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoVisionComponent } from '../shared/photo-vision/photo-vision.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public modalController: ModalController) { }

  async presentPVModal() {
    const modal = await this.modalController.create({
      component: PhotoVisionComponent,
      cssClass: 'modal-pv',
      componentProps: {
        'linkedToJournal': 'any',
      }
    });
    return await modal.present();
  }
}
