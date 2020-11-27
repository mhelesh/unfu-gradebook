import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { LogoComponent } from './logo/logo.component';



@NgModule({
  declarations: [LoginComponent, ProfileComponent, HeaderComponent, PageHeaderComponent, LogoComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [LoginComponent, ProfileComponent, HeaderComponent, PageHeaderComponent, LogoComponent],
})
export class SharedModule { }
