import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { DbService } from './db.service';

import { Platform } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private db: DbService, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(async (user) => (user ? db.doc$(`users/${user.uid}`) : of(null))) // smt wrong with async
    );
  }

  async anonymousLogin() {
    const credential = await this.afAuth.signInAnonymously();

    return await this.updateUserData(credential.user);
  }

  private updateUserData({ uid, email, displayName, isAnonymous }) {
    const path = `user/${uid}`;

    const data = {
      uid,
      email,
      displayName,
      isAnonymous
    };

    return this.db.updateAt(path, data);
  }

  async signOut() {
    await this.afAuth.signOut();

    return this.router.navigate(['/']);
  }
}
