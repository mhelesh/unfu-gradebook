import { Component, OnInit } from '@angular/core';

import { tap, filter } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-photo-vision',
  templateUrl: './photo-vision.component.html',
  styleUrls: ['./photo-vision.component.scss'],
})
export class PhotoVisionComponent implements OnInit {

  task: AngularFireUploadTask;
  result$: Observable<any>;

  loading: HTMLIonLoadingElement;
  image: string;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private camera: Camera,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() { }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();

    // const { role, data } = await this.loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  async uploadPhoto(file: string) {
    this.presentLoading();

    const docId = this.afs.createId();
    const path = `${docId}.jpg`;

    const photoRef = this.afs.collection('photos').doc(docId);

    this.result$ = photoRef.valueChanges()
      .pipe(
        filter(data => !!data),
        tap(_ => this.loading.dismiss())
      );

    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(path).putString(this.image, 'data_url');
  }

  async captureAndUpload() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    const base64 = await this.camera.getPicture(options);

    this.uploadPhoto(base64);
  }
}
