import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LoginComponent, ProfileComponent],
})
export class SharedModule { }
