import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(public db: DbService, public auth: AuthService) { }

  ngOnInit() {
    this.journals$ = this.auth.user$.pipe(
      switchMap(user => this.db.collection$('journals', ref =>
        ref
          // .where('uid', '==', user.uid)
          // .orderBy('createAt', 'desc')
          .limit(100)
      )
      ),
      shareReplay(1)
    );
  }

  trackById(idx: string, journal: any): string {
    return journal.id;
  }

}
