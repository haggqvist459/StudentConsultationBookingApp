import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC7m-JeQ0bH8AIw1jOLvf_SasdPkuGYWds",
  authDomain: "student-booking-9e3e8.firebaseapp.com",
  databaseURL: "https://student-booking-9e3e8.firebaseio.com",
  projectId: "student-booking-9e3e8",
  storageBucket: "student-booking-9e3e8.appspot.com",
  messagingSenderId: "1072858336258",
  appId: "1:1072858336258:web:9dd082e7f51f53d15eeb1b",
  measurementId: "G-WX9953NNT5"
};


firebase.initializeApp(firebaseConfig);

export { firebase };







