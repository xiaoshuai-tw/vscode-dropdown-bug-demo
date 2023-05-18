/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
// import { getCHead } from "./getChead";
import { BuildProfileEditorProvider } from './BuildProfileEditor';

let hyseimGetBuildCHeadProfileTaskProvider: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	context.subscriptions.push(BuildProfileEditorProvider.register(context));
}

export function deactivate(): void {
}
