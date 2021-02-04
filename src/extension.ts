const fs = require("fs");
const dateFormat = require("dateformat");
import * as vscode from "vscode";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "producdev" is now active!');

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
      [pkg.name]: { seconds: {}, keystrokes: {} },
      timestamp: ts,
    };
    for (const file in time) {
      if (Object.prototype.hasOwnProperty.call(time, file)) {
        if (!res[pkg.name].seconds[ts]) {
          res[pkg.name].seconds[ts] = 0;
        }
        res[pkg.name].seconds[ts] += Math.floor(time[file] / 1000);
      }
    }
    for (const file in keystrokes) {
      if (Object.prototype.hasOwnProperty.call(keystrokes, file)) {
        if (!res[pkg.name].keystrokes[ts]) {
          res[pkg.name].keystrokes[ts] = 0;
        }
        res[pkg.name].keystrokes[ts] += keystrokes[file];
      }
    }

    // returns a payload sorted by file - possible future use?
    /*for (const file in time) {
      if (Object.prototype.hasOwnProperty.call(time, file)) {
        if (!res[pkg.name][file]) {
          res[pkg.name][file] = { time: 0, keystrokes: 0 };
        }
        res[pkg.name][file].time += time[file];
      }
    }
    for (const file in keystrokes) {
      if (Object.prototype.hasOwnProperty.call(keystrokes, file)) {
        if (!res[pkg.name][file]) {
          res[pkg.name][file] = { time: 0, keystrokes: 0 };
        }
        res[pkg.name][file].keystrokes += keystrokes[file];
      }
    }*/
    return res;
  };

  setInterval(() => {
    // run every 30 mins
    updateTime();
    console.log(payload());
    setup();
  }, 180000);
}

export function deactivate() {}
