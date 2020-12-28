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
  members$: Observable<any>;
  gradeTable$: Observable<any[]>;
  linkedDocs$: Observable<any[]>;

  gradeTable;

  studentList = [];

  editing = {};

  ColumnMode = ColumnMode;

  ngOnInit() {
    this.journalId = this.route.snapshot.paramMap.get('id');

    this.journal$ = this.db.doc$(`journals/${this.journalId}`);
    // this.members$ = this.db.collection$(`journals/${this.journalId}/members/`);
    this.gradeTable$ = this.db.collection$(`journals/${this.journalId}/gradeTable`)
      .pipe(
        tap(update => {
          this.gradeTable = update;
          this.gradeTable = this.gradeTable.map(
            o => ({ ...o, sum: this.totalSum(o) })
          )

          console.log(update)
        }),
        map(e => {
          return e.map(el => ({ ...el, sum: this.totalSum(el) }))
        })

      )

    // this.journal$.subscribe(res => {

    //   if (res.groupId) {
    //     res.groupId.get().then(result => {
    //       const groupMembers = result.data().members;

    //       for (const key in groupMembers) {
    //         if (Object.prototype.hasOwnProperty.call(groupMembers, key)) {
    //           const element = groupMembers[key];

    //           this.studentList.push({ key, element });
    //         }
    //       }
    //     });
    //   }
    // });

    this.linkedDocs$ = this.db.collection$('cloud-vision-photos', ref =>
      ref
        .where('linkedTo', '==', this.journalId)
        .limit(100)
    )

  }

  constructor(private db: DbService, private route: ActivatedRoute, public modalController: ModalController) { }

  updateValue(event, cell, rowIndex, type = 'number') {

    console.log(cell, rowIndex)
    this.editing[rowIndex + '-' + cell] = false;

    switch (type) {
      case 'number':
        this.db.updateAt(`journals/${this.journalId}/gradeTable/${this.gradeTable[rowIndex].id}`, { [cell]: parseInt(event.target.value, 10) });
        break;

      case 'string':
        this.db.updateAt(`journals/${this.journalId}/gradeTable/${this.gradeTable[rowIndex].id}`, { [cell]: event.target.value });
        break;
      default:
        break;
    }
  }

  totalSum(row) {
    let sum = 0;

    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const el = row[key];

        if (typeof el == 'number') {
          sum += el;
        }
      }
    }
    return sum;
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

  // getCellClass({ row, column, value }): any {
  //   let sum = 0;

  //   for (const key in row) {
  //     if (Object.prototype.hasOwnProperty.call(row, key)) {
  //       const el = row[key];

  //       if (typeof el == 'number') {
  //         sum += el;
  //       }
  //     }
  //   }

  //   return {
  //     'is-lows': sum < 50,
  //     'is-low': true,
  //     'is-med': sum < 75,
  //     'is-hig': sum < 100
  //   };
  // }
}
