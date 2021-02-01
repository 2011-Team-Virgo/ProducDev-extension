import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "helloworld2" is now active!');

  interface LooseObject {
    [key: string]: any;
  }

  let time: LooseObject = {};
  let currentFile: string = "";
  let timestamp: number = -1;

  let keystrokes: LooseObject = {};

  let disposable = vscode.commands.registerCommand(
    "helloworld2.helloWorld",
    () => {
      vscode.window.onDidChangeActiveTextEditor((event) => {
        vscode.window.showInformationMessage("active editor changed");
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
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
