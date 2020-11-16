import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  journals$: Observable<any>;
  institutes$: Observable<any>;

  chosenInstitute = new BehaviorSubject(null);

  constructor(public db: DbService, public auth: AuthService) { }

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
          .where('inst', '==', filter)
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

  changeInstitute(event) {
    console.log(event.detail.value);
    this.updateChosenInstitute(event.detail.value);
  }

}
