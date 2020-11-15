import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Route } from '@angular/compiler/src/core';


@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate {

  constructor(private router: Router, private storage: Storage) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const isShown = await this.storage.get('introductionShown');

    if (!isShown) {
      this.router.navigateByUrl('/introduction');
    }

    return isShown;
  }
}
