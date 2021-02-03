import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";

// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/database";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

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
