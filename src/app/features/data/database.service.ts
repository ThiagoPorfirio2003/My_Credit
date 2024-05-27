import { Injectable, inject } from '@angular/core';
import { setDoc, doc, Firestore, getDoc, collection, query, getDocs, where, updateDoc } 
from '@angular/fire/firestore';
import { CollectionsNames } from 'src/app/core/models/collectionNames';
import { QRSimple } from 'src/app/core/models/QR.model';
import { MyUser } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public firestore : Firestore;

  public readonly USERS_COLLECTION_NAME : CollectionsNames = CollectionsNames.USER;

  constructor() 
  { 
    this.firestore = inject(Firestore);
  }

  public getDocRef(collectionName : CollectionsNames, idDoc : string)
  {
    return getDoc(doc(this.firestore, collectionName, idDoc));
  }

  public getCollectionRef(collectionName : CollectionsNames)
  {
    return collection(this.firestore, collectionName);
  }

  public UpdateUserCredit(userUID : string, credit : number, QRs : Array<QRSimple>)
  {
    return updateDoc(doc(this.firestore, CollectionsNames.USER, userUID),
    {
      credit : credit,
      QRs: QRs
    });
  }
}
