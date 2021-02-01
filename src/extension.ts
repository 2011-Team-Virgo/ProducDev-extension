import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "producdev" is now active!');

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
    console.log(time);
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
