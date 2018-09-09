const os = require("os");
const fs = require("fs");
const { exec } = require('child_process');
const { dialog } = require('electron');

module.exports = function(app) {
  if (os.platform() !== 'darwin') return;

  const appBasePath = app.getPath('exe').split('.app')[0];
  const appFullPath = appBasePath + '.app';
  const appName = appBasePath.split('/')[appBasePath.split('/').length - 1];
  const appParentsPath = appFullPath.replace(`${appName}.app`, '')

  const appBakName = appName + ' Old Version';
  const appBakFullPath = appFullPath.replace(`${appName}.app`, `${appBakName}.app`);

  const updateFolder = app.getPath('userData') + '/__update__';
  const updateInfo = JSON.parse(fs.readFileSync(`${updateFolder}/update-info.json`, 'utf8')).fileName;
  const updateFile = updateFolder + '/' + updateInfo;

  dialog.showMessageBox({message: app.getVersion()})

  exec(`rm -rf "${updateFolder}/app"`, (error, stdout, stderr) => {
    if (error || stderr.trim()) return dialog.showMessageBox({message: stderr});

    exec(`unzip -o "${updateFile}" -d "${updateFolder}/app"`, (error, stdout, stderr) => {
      if (error || stderr.trim()) return dialog.showMessageBox({message: stderr});

      exec(`mv "${appFullPath}" "${appBakFullPath}"`, (error, stdout, stderr) => {
        if (error || stderr.trim()) return dialog.showMessageBox({message: stderr});

        exec(`cd "${updateFolder}/app" && mv * "${appParentsPath}"`, (error, stdout, stderr) => {
          if (error || stderr.trim()) return dialog.showMessageBox({message: stderr});

          exec(`rm -rf "${appBakFullPath}"`, (error, stdout, stderr) => {
            if (error || stderr.trim()) return dialog.showMessageBox({message: stderr});
  
            exec(`"${app.getPath('exe')}"`);
            app.quit();
          });
        });
      });
    });
  });
}