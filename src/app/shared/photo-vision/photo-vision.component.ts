import { Component, Input, OnInit } from '@angular/core';

import { tap, filter } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DbService } from 'src/app/services/db.service';

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

  docId: string;

  @Input() linkedToJournal = 'any';

  constructor(
    public platform: Platform,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
    private db: DbService,
    public modalCtrl: ModalController
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
  }

  async uploadPhoto(file: string) {
    this.presentLoading();

    const docId = this.afs.createId();
    const path = `${docId}.jpg`;

    console.log(`${docId}.jpg`);
    this.docId = docId;

    const photoRef = this.afs.collection('cloud-vision-photos').doc(docId);

    this.result$ = photoRef.valueChanges()
      .pipe(
        filter(data => !!data),
        tap(_ => {
          this.loading.dismiss();
          console.log('got photo changed ', this.result$);
        })
      );

    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(path).putString(this.image, 'data_url');
  }

  async captureAndUpload(captureType) {
    console.log('Capturing...');

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType[captureType],
    };

    const base64 = await this.camera.getPicture(options);

    this.uploadPhoto(base64);
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.toString().replace('data:image/jpeg;base64,', '');
      this.uploadPhoto(base64);
    };
  }

  base64ToImg(base64) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64);
  }

  saveWithMetadata(documentName, linkedTo) {
    this.db.updateAt(`cloud-vision-photos/${this.docId}`, { documentName, linkedTo })
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}

// https://stackblitz.com/edit/angular-g9n9np?file=src%2Fapp%2Fapp.component.ts