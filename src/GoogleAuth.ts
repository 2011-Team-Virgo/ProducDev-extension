import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


export const GoogleAuth = ()=>{
    let provider = new firebase.auth.GoogleAuthProvider();
    let user;
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result)
      var credential = result.credential;
      // The signed-in user info.
      var user = result.user;
      user = user
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    return user
}