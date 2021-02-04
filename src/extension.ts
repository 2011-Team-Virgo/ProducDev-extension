import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";
import {GitAuth} from "./GitAuth"
import {GoogleAuth} from "./GoogleAuth"


export async function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const googleauth = GoogleAuth();
  console.log(googleauth)
  const credentials = new GitAuth();
	await credentials.initialize(context);
  
  
	const disposable = vscode.commands.registerCommand('extension.getGitHubUser', async () => {
		/**
		 * Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API
		 * calls to GitHub. It provides convenient typings that can be helpful for using the API.
		 * 
		 * Documentation on GitHub's REST API can be found here: https://docs.github.com/en/rest
		 */
		const octokit = await credentials.getOctokit();
		const userInfo = await octokit.users.getAuthenticated();
    const {id} = await userInfo.data
		vscode.window.showInformationMessage(`Logged into GitHub as ${userInfo.data.login}`);
	});

	context.subscriptions.push(disposable);


  TokenManager.globalState = context.globalState;

  interface LooseObject {
    [key: string]: any;
  }

  let time: LooseObject = {};
  let currentFile: string = "";
  let timestamp: number = -1;

  let keystrokes: LooseObject = {};
  vscode.window.onDidChangeActiveTextEditor((event) => {
    if (timestamp > 0 && currentFile) {
      if (time[currentFile]) {
        time[currentFile] += Date.now() - timestamp;
      } else {
        time[currentFile] = Date.now() - timestamp;
      }
    }
    timestamp = Date.now();
    if (typeof event?.document.fileName === "string") {
      currentFile = event?.document.fileName;
    }
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (currentFile) {
      if (keystrokes[currentFile]) {
        keystrokes[currentFile]++;
      } else {
        keystrokes[currentFile] = 1;
      }
    }
  });
}

export function deactivate() {}
