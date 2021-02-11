const fs = require("fs");
const dateFormat = require("dateformat");
import * as vscode from "vscode";
import { firebaseUpload } from "./db/firebase";
import { TokenManager } from "./TokenManager";
import { GitAuth } from "./GitAuth";

interface LooseObject {
  [key: string]: any;
}

let pkg: LooseObject = { name: "PROJECT_NAME_UNKNOWN" };
let id: number;
let time: LooseObject;
let keystrokes: LooseObject;
let idleTime: LooseObject;
let currentFile: string = "";
let timestamp: number = -1;
let projectPath: string = "";
let idle = false;
let idleStamp = -1;

const updateTime = (obj: LooseObject, stamp: number) => {
  if (obj[currentFile]) {
    obj[currentFile] += Date.now() - stamp;
  } else {
    obj[currentFile] = Date.now() - stamp;
  }
};

export async function activate(context: vscode.ExtensionContext) {
  console.log("ProducDev activated.");

  const credentials = new GitAuth();
  await credentials.initialize(context);

  const disposable = vscode.commands.registerCommand(
    "producdev.getGitHubUser",
    async () => {
      /**
       * Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API
       * calls to GitHub. It provides convenient typings that can be helpful for using the API.
       *
       * Documentation on GitHub's REST API can be found here: https://docs.github.com/en/rest
       */
      const octokit = await credentials.getOctokit();
      const userInfo = await octokit.users.getAuthenticated();

      id = userInfo.data.id;
      vscode.window.showInformationMessage(
        `Logged into GitHub as ${userInfo.data.login}`
      );
    }
  );
  const googleAuthDisp = vscode.commands.registerCommand(
    "producdev.getGoogleUser",
    async()=>{
      vscode.window.showInformationMessage(
        `I am a command (GoogleAuth)`
      );
    }
  )

  context.subscriptions.push(disposable);
  context.subscriptions.push(googleAuthDisp);

  TokenManager.globalState = context.globalState;

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
    idleTime = {};
    timestamp = Date.now(); // this sets the timestamp and filename to start tracking time upon opening vs code
    idle ? (idleStamp = Date.now()) : (idleStamp = -1);
    if (typeof vscode.window.activeTextEditor?.document.fileName === "string") {
      currentFile = vscode.window.activeTextEditor?.document.fileName.slice(
        projectPath.length
      );
    }
  };
  setup();

  const idleNow = () => {
    idle = true;
    console.log("Idling...");
    idleStamp = Date.now();
  };

  const clearIdle = () => {
    if (idleStamp !== -1) {
      idle = false;
      console.log("No longer idle.");
      updateTime(idleTime, idleStamp);
      idleStamp = -1;
    }
  };

  let timer = setTimeout(idleNow, 300000); // timeout after 5 mins

  vscode.window.onDidChangeActiveTextEditor((event) => {
    if (timestamp > 0 && currentFile) {
      updateTime(time, timestamp);
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
      if (idle) {
        clearIdle();
      }
      clearTimeout(timer);
      timer = setTimeout(idleNow, 300000); // reset on activity
    }
  });

  setInterval(async () => {
    // run every 30 mins
    updateTime(time, timestamp);
    updateTime(idleTime, idleStamp);
    if (id) {
      const pl = payload();
      firebaseUpload(pl, pkg.name);
    }
    setup();
  }, 900000);
}

const payload = () => {
  const ts = dateFormat(new Date(), "yyyy-mm-dd_h:MM:ss");
  let res: LooseObject = {
    id,
    [pkg.name]: {},
  };
  for (const file in time) {
    if (!res[pkg.name][file]) {
      res[pkg.name][file] = {
        [ts]: { keystrokes: 0, minutes: 0, idleTime: 0 },
      };
    }
    res[pkg.name][file][ts].minutes += (time[file] / 60000).toFixed(2);
  }
  for (const file in keystrokes) {
    if (!res[pkg.name][file]) {
      res[pkg.name][file] = {
        [ts]: { keystrokes: 0, minutes: 0, idleTime: 0 },
      };
    }
    res[pkg.name][file][ts].keystrokes += keystrokes[file];
  }
  for (const file in idleTime) {
    if (Object.prototype.hasOwnProperty.call(idleTime, file)) {
      if (!res[pkg.name][file]) {
        res[pkg.name][file] = {
          [ts]: { keystrokes: 0, minutes: 0, idleTime: 0 },
        };
      }
      res[pkg.name][file][ts].idleTime += (idleTime[file] / 60000).toFixed(2);
    }
  }
  return res;
};

export function deactivate() {
  console.log("ProducDev deactivated.");
  return new Promise((resolve) => {
    updateTime(time, timestamp);
    updateTime(idleTime, idleStamp);
    if (id) {
      const pl = payload();
      firebaseUpload(pl, pkg.name);
      resolve(pl);
    }
  });
}
