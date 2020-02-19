import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  return admin.firestore().doc(`/users/${userRecord.uid}`).set({
    uid: userRecord.uid,
    displayName: userRecord.displayName,
    email: userRecord.email,
    photoURL: userRecord.photoURL
  });
});

exports.deleteUser = functions.firestore.document('users/{documentId}').onDelete((documentData, context) => {
  return admin.auth().deleteUser(context.params.documentId);
});

exports.addAdminRole = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  }).then(() => {
    return {
      message: `Muy bien! ${data.email} ahora es administrador`
    }
  }).catch(err => err);
});

exports.removeAdminRole = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: false });
  }).then(() => {
    return {
      message: `Que lástima! ${data.email} ya no es administrdor`
    }
  }).catch(err => err);
});
