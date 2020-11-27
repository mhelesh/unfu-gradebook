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
  studentList = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.journal$ = this.db.doc$(`journals/${id}`);

    this.journal$.subscribe(res => {

      // if (res.groupId) {
      //   res.groupId.get().then(result => {
      //     const groupMembers = result.data().members;

      //     console.log(groupMembers);

      //     for (const key in groupMembers) {
      //       if (Object.prototype.hasOwnProperty.call(groupMembers, key)) {
      //         const element = groupMembers[key];

      //         this.studentList.push({ key, element });
      //       }
      //     }
      //     console.log(this.studentList);
      //   });
      // }
    });
  }

  getFromRef(ref) {

  }
}
