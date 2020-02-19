import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import {User, auth} from 'firebase';
import {Observable} from 'rxjs';
import {MatSlideToggleChange, MatSnackBar} from '@angular/material';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User;
  admin: boolean;

  constructor(private firestore: AngularFirestore,
              private fireAuth: AngularFireAuth,
              private fireFunctions: AngularFireFunctions,
              private snackBar: MatSnackBar) {
    fireAuth.authState.subscribe((user: User) => {
      if (user) {
        user.getIdTokenResult().then((idToken: auth.IdTokenResult) => this.admin = idToken.claims.admin);
      }
      this.user = user;
    });
  }

  signIn = () => this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

  signOut = () => this.fireAuth.auth.signOut();

  findAll = () => this.firestore.collection('users').valueChanges();

  delete = (user: User) => this.firestore.collection('users').doc(user.uid).delete()
    .then(() => this.snackBar.open(`${user.email} ha sido eliminado`, 'Okay!', { duration: 2000}))
    .catch(() => this.snackBar.open(`Solo un administrador puede eliminar usuarios`, 'Okay!', { duration: 2000}))

  callAdmin = (event: MatSlideToggleChange) => {
    let adminRole: any;
    if (event.checked) {
      adminRole = this.fireFunctions.httpsCallable('addAdminRole');
    } else {
      adminRole = this.fireFunctions.httpsCallable('removeAdminRole');
    }
    adminRole({ email: this.user.email }).subscribe(data => {
      if (!data.err) {
        this.snackBar.open(data.message, 'Okay!', { duration: 2000 });
        this.signOut();
      }
    }, error => console.error(error));
  }

}
