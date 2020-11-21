import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { from, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';

import { JournalFormComponent } from './journal-form/journal-form.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  journals$: Observable<any>;
  institutes$: Observable<any>;

  journalPath = { institute: '' };

  chosenInstitute = new BehaviorSubject(null);

  constructor(
    public db: DbService,
    public auth: AuthService,
    public modal: ModalController
  ) { }

  ngOnInit() {
    this.journals$ = this.auth.user$.pipe(
      switchMap(user => this.db.collection$('journals', ref =>
        ref
          //.where('uid', '==', user.uid)
          // .orderBy('createAt', 'desc')
          .limit(100)
      )
      ),
      shareReplay(1)
    );

    this.institutes$ = this.db.doc$('enums/university');

    this.journals$ = this.chosenInstitute.pipe(
      switchMap(filter => this.db.collection$('journals', ref =>
        ref
          .where('institute', '==', filter)
          .limit(100)
      )
      ),
      shareReplay(1)
    );
  }

  trackById(idx: string, journal: any): string {
    return journal.id;
  }

  updateChosenInstitute(val) {
    this.chosenInstitute.next(val);
  }

  changeInstitute(event, institute: string) {
    console.log(institute);
    this.journalPath.institute = institute;

    this.updateChosenInstitute(institute);
  }

  add() {

  }

  async showModal() {
    const modal = await this.modal.create({
      component: JournalFormComponent,
      componentProps: { journal: { journal: 'journal' } },
    });
    return await modal.present();
  }
}
