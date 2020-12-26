import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss'],
})
export class JournalFormComponent implements OnInit {

  constructor(
    private db: DbService,
    private auth: AuthService,
    private fb: FormBuilder,
    public modal: ModalController,
  ) { }

  journalForm: FormGroup;
  todoForm: FormGroup;
  journal;


  institutes$: Observable<any>;
  groups$: Observable<any>;
  chosenGroup = new BehaviorSubject(null);

  ngOnInit() {
    const data = {
      institute: null,
      groupName: null,
      ...this.journal
    };

    this.institutes$ = this.db.doc$('enums/university');

    this.groups$ = this.chosenGroup.pipe(
      switchMap(filter => this.db.collection$('groups', ref =>
        ref
          .where('group', '==', filter)
          .limit(100)
      )
      ),
      shareReplay(1)
    );

    this.journalForm = this.fb.group({
      institute: ['', [Validators.required]],
      group: ['', [Validators.required]],
      groupRef: ['', [Validators.required]],
      groupYear: [1, [Validators.required]],
    });

  }

  async createGroup() {
    const uid = await this.auth.uid();
    const id = this.journal.id ? this.journal.id : '';

    const data = {
      createdBy: uid,
      createdAt: Date.now(),
      ...this.journal,
      ...this.journalForm.value
    };

    const docId = this.db.generateId(data.group + data.groupYear);

    this.db.updateAt(`journals/${docId}`, data);
    this.db.createWithSubCollectionAndFill('journals', docId, 'members', data);

    this.modal.dismiss();
  }

  async gg() {

    console.log(this.journalForm.value);
  }

  updateChosenGroup(event) {
    console.log(event.target.value);
    this.chosenGroup.next(event.target.value);
  }

  generateId(part) {
    return part + '-' + Date.now;
  }

  closeModal() {
    this.modal.dismiss();
  }

}
