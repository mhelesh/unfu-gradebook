import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

import { ColumnMode, nextSortDir } from '@swimlane/ngx-datatable';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';

import { PhotoVisionComponent } from 'src/app/shared/photo-vision/photo-vision.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-group-journal',
  templateUrl: './group-journal.component.html',
  styleUrls: ['./group-journal.component.scss'],
})
export class GroupJournalComponent implements OnInit {

  journalId;

  journal$: Observable<any>;
  members$
  gradeTable$;
  linkedDocs$: Observable<any>;
  gradeTable = [];

  studentList = [];

  editing = {};
  rows = [
    {
      "id": 0,
      "name": "Ramsey Cummings",
      "gender": "male",
      "age": 52,
      "address": {
        "state": "South Carolina",
        "city": "Glendale"
      }
    },
    {
      "id": 1,
      "name": "Stefanie Huff",
      "gender": "female",
      "age": 70,
      "address": {
        "state": "Arizona",
        "city": "Beaverdale"
      }
    },
    {
      "id": 2,
      "name": "Mabel David",
      "gender": "female",
      "age": 52,
      "address": {
        "state": "New Mexico",
        "city": "Grazierville"
      }
    },
    {
      "id": 3,
      "name": "Frank Bradford",
      "gender": "male",
      "age": 61,
      "address": {
        "state": "Wisconsin",
        "city": "Saranap"
      }
    },
    {
      "id": 4,
      "name": "Forbes Levine",
      "gender": "male",
      "age": 34,
      "address": {
        "state": "Vermont",
        "city": "Norris"
      }
    },
  ];

  ColumnMode = ColumnMode;

  ngOnInit() {
    this.journalId = this.route.snapshot.paramMap.get('id');

    this.journal$ = this.db.doc$(`journals/${this.journalId}`);
    this.members$ = this.db.collection$(`journals/${this.journalId}/members/`);
    this.gradeTable$ = this.db.collection$(`journals/${this.journalId}/gradeTable/`)
      .pipe(
        map(
          (a: any[]) => a.map(
            o => ({ ...o, sum: this.totalSum(o) })
          )
        )
      );

    this.journal$.subscribe(res => {

      if (res.groupId) {
        res.groupId.get().then(result => {
          const groupMembers = result.data().members;

          console.log(groupMembers);

          for (const key in groupMembers) {
            if (Object.prototype.hasOwnProperty.call(groupMembers, key)) {
              const element = groupMembers[key];

              this.studentList.push({ key, element });
            }
          }
          console.log(this.studentList);
        });
      }
    });

    this.linkedDocs$ = this.db.collection$('cloud-vision-photos', ref =>
      ref
        .where('linkedTo', '==', this.journalId)
        .limit(100)
    )

  }

  constructor(private db: DbService, private route: ActivatedRoute, public modalController: ModalController) { }

  updateValue(event, cell, rowIndex, type = 'number') {
    this.editing[rowIndex + '-' + cell] = false;

    switch (type) {
      case 'number':
        this.db.updateAt(`journals/${this.journalId}/gradeTable/${'lkLmRQCQ7AkeoZomeXKE'}`, { [cell]: parseInt(event.target.value, 10) });
        break;

      case 'string':
        this.db.updateAt(`journals/${this.journalId}/gradeTable/${'lkLmRQCQ7AkeoZomeXKE'}`, { [cell]: event.target.value });
        break;
      default:
        break;
    }
  }

  totalSum(row) {
    console.log(row);
    let sum = 0;

    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const el = row[key];

        if (typeof el == 'number') {
          sum += el;
          console.log(el);
        }
      }
    }
    return sum;
  }

  getCellClass({ row, column, value }): any {
    let sum = 0;

    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const el = row[key];

        if (typeof el == 'number') {
          sum += el;
          console.log(el);
        }
      }
    }

    return {
      'is-lows': sum < 50,
      'is-low': true,
      'is-med': sum < 75,
      'is-hig': sum < 100
    };
  }


  async presentPVModal() {
    const modal = await this.modalController.create({
      component: PhotoVisionComponent,
      cssClass: 'modal-pv',
      componentProps: {
        'linkedToJournal': this.journalId,
      }
    });
    return await modal.present();
  }
}
