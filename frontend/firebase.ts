import firebase from "firebase";
// this is the firebase config and it just intializes our app, later we can put these fields
// in a env file so the values are secured.
if (!firebase.apps.length) {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyDZ2uufxauOr_0vPmV6z1hntnOW2Ff68WQ",
    authDomain: "masterit-624a1.firebaseapp.com",
    projectId: "masterit-624a1",
    storageBucket: "masterit-624a1.appspot.com",
    messagingSenderId: "625207893725",
    appId: "1:625207893725:web:6a404041a36c4c0fe48534",
    measurementId: "G-NWLK3BC4W0",
  });
}

const authentication = firebase.auth(); // this for authentication and creating users
const storage = firebase.storage(); // this is for saving images or videos in the storage if needed
const provider = new firebase.auth.GoogleAuthProvider();

// exporting these three objects so when you import you can import either one of these objects by destructing
export { authentication, storage, provider };
