import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
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

  ngOnInit() {
    const data = {
      institute: null,
      groupName: null,
      ...this.journal
    };

    this.institutes$ = this.db.doc$('enums/university');

    this.journalForm = this.fb.group({
      institute: ['', [Validators.required]],
      group: ['', [Validators.required]],
      groupYear: [1, [Validators.required]],
    })

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

    console.log(this.journalForm.value);

    this.db.updateAt(`journals/${id}`, data);
  }

  async gg() {

    console.log(this.journalForm.value);
  }
}
