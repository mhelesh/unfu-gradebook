import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';
import { SharedModule } from '../shared/shared.module';

import { JournalPage } from './journal.page';
import { JournalFormComponent } from './journal-form/journal-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    JournalPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [JournalPage, JournalFormComponent],
  entryComponents: [JournalFormComponent]
})
export class JournalPageModule { }
