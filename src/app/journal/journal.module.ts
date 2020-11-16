import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';
import { SharedModule } from '../shared/shared.module';

import { JournalPage } from './journal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    JournalPageRoutingModule
  ],
  declarations: [JournalPage]
})
export class JournalPageModule { }
