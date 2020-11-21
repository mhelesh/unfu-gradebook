import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JournalFormComponent } from './journal-form.component';

describe('JournalFormComponent', () => {
  let component: JournalFormComponent;
  let fixture: ComponentFixture<JournalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
