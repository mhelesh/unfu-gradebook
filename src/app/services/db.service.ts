import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private afs: AngularFirestore) { }

  collection$(path: string, query?: QueryFn) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  doc$(path: string): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as {} };
        })
      );
  }

  // Creates or updates data on a collection or document. path to 'collection' or 'collection/docID'
  updateAt(path: string, data: object): Promise<any> {
    const segments = path.split('/').filter(v => v);

    // Odd is always a collection | Even is always document
    if (segments.length % 2) {
      return this.afs.collection(path).add(data);
    } else {
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  // Deletes document from Firestore by path to document
  delete(path: string) {
    return this.afs.doc(path).delete();
  }
}
