import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-group-journal',
  templateUrl: './group-journal.component.html',
  styleUrls: ['./group-journal.component.scss'],
})
export class GroupJournalComponent implements OnInit {

  constructor(private db: DbService, private route: ActivatedRoute) { }
  journal$;

  list = [1, 2, 3, 4, 56, 7, 8, 9, 2, 6, 5, 2, 5, 5, 5, 21, 4141, 3]

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.journal$ = this.db.doc$(`journals/${id}`);
  }
}
