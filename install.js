var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: 'app/dist/win-unpacked',
    outputDirectory: 'app/dist/installer64',
    authors: 'RSC',
    exe: '贸易中心.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));