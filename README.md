# vscode-dropdown-bug-demo
Example of bug saving within the VSCode-dropdown component in a Webview.

# Steps to reproduce the bug

1. Open `package.json` and run the command `install:all` to install all necessary packages for the project.
2. Open `package.json` and run the command `build:webview` to package the project.
3. Press `F5` to enter the debugging window, press `Ctrl+Shift+P` to open the VSCode command box, enter `vscode:Show VscodeDropdown Bug`, and the dropdown component bug reproduction page will appear.
4. `test1` corresponds to a normal dropdown component. `test2` and `test3` correspond to the components where the bug occurs.
5. After entering the page for the first time, select the component corresponding to `test3` and select the third value `Turn on low side switches`, which corresponds to the value of `2`. Press the shortcut key `Ctrl+S` to save the value. The value changes to `1`, but should be `2`.
6. The bug only exists when saving for the first time. After saving once, the bug does not occur again.

## We are hoping for a prompt fix and response. Thank you !!!

