// import * as vscode from 'vscode';

// import {database} from "./server/db";

// import "firebase/auth";
// import "firebase/database";


// export class GoogleAuth{
//   async initialize(context: vscode.ExtensionContext): Promise<void> {
// 		this.registerListeners(context);
// 		this.setOctokit();
//   }
  
//   registerListeners(context: vscode.ExtensionContext): void {
// 		/**
// 		 * Sessions are changed when a user logs in or logs out.
// 		 */
// 		context.subscriptions.push(vscode.authentication.onDidChangeSessions(async e => {
// 			if (e.provider.id === GITHUB_AUTH_PROVIDER_ID) {
// 				await this.setOctokit();
// 			}
// 		}));
// 	}
//     let provider = new database.auth.GoogleAuthProvider();
//     let user;
//     database.auth()
//     .signInWithPopup(provider)
//     .then((result) => {
//       console.log(result)
//       var credential = result.credential;
//       // The signed-in user info.
//       var user = result.user;
//       user = user
//     }).catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });
//     return user
// }