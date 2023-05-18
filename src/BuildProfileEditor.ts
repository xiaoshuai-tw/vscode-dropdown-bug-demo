/* eslint-disable @typescript-eslint/semi */
import * as vscode from 'vscode';
import { getNonce } from './utilities/getNonce';
import { getUri } from "./utilities/getUri";
import { TextEncoder } from 'util';

export class BuildProfileEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {

		vscode.commands.registerCommand('vscode.dropdownBug.show', () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage("Please opening a workspace");
				return;
			}

			var uri = vscode.Uri.joinPath(workspaceFolders[0].uri, `vscode-dropdown-bug-demo.json`);
			this.createAndOpenProfile(uri)
		});

		const provider = new BuildProfileEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(BuildProfileEditorProvider.viewType, provider);
		return providerRegistration;
	}

	public static async createAndOpenProfile(uri: vscode.Uri) {
		var content = new TextEncoder().encode('{}');

		try {
			await vscode.workspace.fs.stat(uri)
			vscode.window.showErrorMessage("文件存在，请直接打开");
		}
		catch {
			vscode.workspace.fs.writeFile(uri, content).then(() => {
				vscode.commands.executeCommand('vscode.openWith', uri, BuildProfileEditorProvider.viewType);
			});
		}
	}

	private static readonly viewType = 'vscode.dropdownBug';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	/**
	 * Called when our custom editor is opened.
	 * 
	 * 
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			console.log("updateWebview() content update");
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.action) {
				case 'onChange':
					this.updateField(document, e);
					return;
			}
		});

		updateWebview();
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	private getHtmlForWebview(webview: vscode.Webview): string {
		// The CSS file from the React build output
		const stylesUri = getUri(webview, this.context.extensionUri, [
			"webview-ui",
			"build",
			"static",
			"css",
			"main.css",
		]);
		// The JS file from the React build output
		const scriptUri = getUri(webview, this.context.extensionUri, [
			"webview-ui",
			"build",
			"static",
			"js",
			"main.js",
		]);

		const nonce = getNonce();

		// Tip: Install the es6-string-html VS Code extension to enable code highlighting below
		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
			  <head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}'; worker-src blob:;">
				<link rel="stylesheet" type="text/css" href="${stylesUri}">
				<title>Hello World</title>
			  </head>
			  <body>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			  </body>
			</html>
		  `;
	}

	private updateField(document: vscode.TextDocument, message?: any) {
		const json = this.getDocumentAsJson(document);
		if (message["action"]) {
			delete message.action
		}
		// 将message中字段合并到json中
		function mergeJSON(json: any, message: any) {
			for (var key in message) {
				if (json[key] === undefined) {  // 不冲突的，直接赋值
					json[key] = message[key];
					continue;
				}
				if (typeof message[key] !== "object") { // 存在冲突的，如果不是object则赋值
					json[key] = message[key];
					continue;
				}
				if (typeof message[key] === "object" && message[key].constructor === Array) { //存在冲突且是object的，则继续递归遍历
					json[key] = message[key];
					continue;
				}
				if (typeof message[key] === "object" && message[key].constructor === Object) { //存在冲突且是object的，则继续递归遍历
					mergeJSON(json[key], message[key])
				}
			}
		}
		mergeJSON(json, message);
		return this.updateTextDocument(document, json);
	}

	/**
	 * Try to get a current document as json text.
	 */
	private getDocumentAsJson(document: vscode.TextDocument): any {
		const text = document.getText();
		if (text.trim().length === 0) {
			return {};
		}

		try {
			return JSON.parse(text);
		} catch {
			throw new Error('Could not get document as json. Content is not valid json');
		}
	}

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 2));

		return vscode.workspace.applyEdit(edit);
	}
}
