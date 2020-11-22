import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupJournalComponent } from './group-journal/group-journal.component';

import { JournalPage } from './journal.page';

const routes: Routes = [
  {
    path: '',
    component: JournalPage
  },
  {
    path: ':id',
    component: GroupJournalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalPageRoutingModule { }
