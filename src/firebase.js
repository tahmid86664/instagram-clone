import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAB5R-frlPV4gp1sLSls5niqfTaFwOtuT0",
  authDomain: "instagram-clone-f1ca0.firebaseapp.com",
  projectId: "instagram-clone-f1ca0",
  storageBucket: "instagram-clone-f1ca0.appspot.com",
  messagingSenderId: "1042770579028",
  appId: "1:1042770579028:web:939e50fc0d259c699c67c1",
  measurementId: "G-G78ZXRBWDH"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };