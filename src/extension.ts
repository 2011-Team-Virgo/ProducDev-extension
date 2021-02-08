const fs = require("fs");
const dateFormat = require("dateformat");
import * as vscode from "vscode";
import {firebaseUpload} from './db/firebase';
import { authenticate } from "./authenticate";
// import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";
import { GitAuth } from "./GitAuth";
// import {GoogleAuth} from "./GoogleAuth"
import axios from "axios";


export async function activate(context: vscode.ExtensionContext) {
  console.log("Extension activated");
  // const sidebarProvider = new SidebarProvider(context.extensionUri);
  // const googleauth = new GoogleAuth();
  // console.log(googleauth)

  const credentials = new GitAuth();
  await credentials.initialize(context);
  let id: number;

  const disposable = vscode.commands.registerCommand(
    "extension.getGitHubUser",
    async () => {
      /**
       * Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API
       * calls to GitHub. It provides convenient typings that can be helpful for using the API.
       *
       * Documentation on GitHub's REST API can be found here: https://docs.github.com/en/rest
       */
      const octokit = await credentials.getOctokit();
      const userInfo = await octokit.users.getAuthenticated();
      id = await userInfo.data.id;
      vscode.window.showInformationMessage(
        `Logged into GitHub as ${userInfo.data.login}`
      );
    }
  );

  context.subscriptions.push(disposable);

  TokenManager.globalState = context.globalState;

  interface LooseObject {
    [key: string]: any;
  }

  let pkg: LooseObject = { name: "PROJECT_NAME_UNKNOWN" };

  let time: LooseObject;
  let keystrokes: LooseObject;
  let currentFile: string = "";
  let timestamp: number = -1;
  let projectPath: string = "";

  if (vscode.workspace.workspaceFolders) {
    projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    if (fs.existsSync(`${projectPath}/package.json`)) {
      pkg = JSON.parse(fs.readFileSync(`${projectPath}/package.json`, "utf8"));
    } else {
      vscode.window.showErrorMessage(
        "ERROR: Your package.json file could not be found in the open directory"
      );
    }
  }

  const setup = () => {
    time = {};
    keystrokes = {};
    timestamp = Date.now(); // this sets the timestamp and filename to start tracking time upon opening vs code
    if (typeof vscode.window.activeTextEditor?.document.fileName === "string") {
      currentFile = vscode.window.activeTextEditor?.document.fileName.slice(
        projectPath.length
      );
    }
  };
  setup();

  const updateTime = () => {
    if (time[currentFile]) {
      time[currentFile] += Date.now() - timestamp;
    } else {
      time[currentFile] = Date.now() - timestamp;
    }
  };
  vscode.window.onDidChangeActiveTextEditor((event) => {
    if (timestamp > 0 && currentFile) {
      updateTime();
    }
    timestamp = Date.now();
    if (typeof event?.document.fileName === "string") {
      currentFile = event?.document.fileName.slice(projectPath.length);
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

  const payload = () => {
    const ts = dateFormat(new Date(), "yyyy-mm-dd_h:MM:ss");
    let res: LooseObject = {
      id,
      [pkg.name]: {},
    };
    for (const file in time) {
      if (Object.prototype.hasOwnProperty.call(time, file)) {
        if (!res[pkg.name][file]) {
          res[pkg.name][file] = { [ts]: { keystrokes: 0, minutes: 0 } };
        }
        res[pkg.name][file][ts].minutes += Math.floor(time[file] / 60000);
      }
    }
    for (const file in keystrokes) {
      if (Object.prototype.hasOwnProperty.call(keystrokes, file)) {
        if (!res[pkg.name][file]) {
          res[pkg.name][file] = { [ts]: { keystrokes: 0, minutes: 0 } };
        }
        res[pkg.name][file][ts].keystrokes += keystrokes[file];
      }
    }
    return res;
  };


  setInterval(async () => {
    // run every 30 mins
    updateTime();
    const pl = payload();
    firebaseUpload(pl, pkg.name);
    setup();
  }, 1800);
}

export function deactivate() {}
