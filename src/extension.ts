// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-platforms-customizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('flutter-platforms-customizer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Flutter Platforms Customizer!');
	});

	context.subscriptions.push(disposable);

	const createProjectDisposable = vscode.commands.registerCommand('flutter-platforms-customizer.createFlutterProject', async () => {
		// Prompt for project name
		const projectName = await vscode.window.showInputBox({
			prompt: 'Enter the Flutter project name',
			placeHolder: 'my_flutter_app',
		});
		if (!projectName) {
			return;
		}

		// Prompt for project location
		const projectUri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			openLabel: 'Select folder for the new Flutter project',
		});
		if (!projectUri || projectUri.length === 0) {
			return;
		}

		// Prompt for platforms
		const platforms = await vscode.window.showQuickPick(
			[
				{ label: 'android', picked: true },
				{ label: 'ios', picked: true },
				{ label: 'web' },
				{ label: 'windows' },
				{ label: 'macos' },
				{ label: 'linux' },
			],
			{
				canPickMany: true,
				placeHolder: 'Select platforms to support',
			}
		);
		if (!platforms || platforms.length === 0) {
			vscode.window.showWarningMessage('No platforms selected. Aborting project creation.');
			return;
		}

		const platformList = platforms.map(p => p.label).join(',');
		const folderPath = projectUri[0].fsPath;
		const terminal = vscode.window.createTerminal('Flutter Create');
		terminal.show();
		terminal.sendText(`cd "${folderPath}"`);
		terminal.sendText(`flutter create ${projectName} --platforms=${platformList}`);
		vscode.window.showInformationMessage(`Creating Flutter project '${projectName}' with platforms: ${platformList}`);
	});

	context.subscriptions.push(createProjectDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
