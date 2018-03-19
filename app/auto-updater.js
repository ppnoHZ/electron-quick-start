const app = require('electron').app
const autoUpdater = require('electron').autoUpdater
const ChildProcess = require('child_process')
const Menu = require('electron').Menu
const path = require('path')
const { dialog } = require('electron')
var os = require('os');
var platform = os.platform() + '_' + os.arch();


console.log('platform ', platform)
var state = 'checking'


show_message = function (content) {
    const options = {
        type: 'info',
        title: '信息',
        message: content,
    }
    dialog.showMessageBox(options, function (index) {
        // event.sender.send('information-dialog-selection', index)
    })
}

exports.initialize = function () {
    if (process.mas) return
    autoUpdater.on('checking-for-update', function () {
        // show_message('checking-for-update')
        state = 'checking'
        exports.updateMenu()
    })

    autoUpdater.on('update-available', function () {
        state = 'checking'
        show_message('发现新版本')

        // dialog.showMessageBox(null, { title: 'update-available checking' })

        exports.updateMenu()
    })

    autoUpdater.on('update-downloaded', function () {
        state = 'installed'
        show_message('新版本下载完成，点击确定立即更新！')

        // dialog.showMessageBox(null, { title: 'update-downloaded' })

        exports.updateMenu()
        autoUpdater.quitAndInstall()

    })

    autoUpdater.on('update-not-available', function () {
        // show_message('update-not-available')

        state = 'no-update'
        exports.updateMenu()
    })

    autoUpdater.on('error', function (error) {
        state = 'no-update'
        // dialog.showMessageBox(null, { title: ' error update-downloaded' })
        show_message('error' + error)

        exports.updateMenu()
    })
    // const url=`http://192.168.3.104:8080/updates/latest?v=${app.getVersion()}&p=${platform}`;
    // console.log(`http://192.168.3.104:1337/update/${platform}/${app.getVersion()}`)
    autoUpdater.setFeedURL(`http://192.168.3.104:1337/update/${platform}/${app.getVersion()}`)

    // autoUpdater.setFeedURL(`http://192.168.3.104:1337/update/windows_64/${app.getVersion()}`)
    // autoUpdater.setFeedURL(`http://192.168.3.104:8080/updates/latest?v=${app.getVersion()}&p=${platform}`)

    autoUpdater.checkForUpdates()
}

exports.updateMenu = function () {

    if (process.mas) return
    var menu = Menu.getApplicationMenu()

    if (!menu) return

    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                switch (item.key) {
                    case 'checkForUpdate':
                        item.visible = state === 'no-update'
                        break
                    case 'checkingForUpdate':
                        item.visible = state === 'checking'
                        break
                    case 'restartToUpdate':
                        item.visible = state === 'installed'
                        break
                }
            })
        }
    })
}

exports.createShortcut = function (callback) {
    spawnUpdate([
        '--createShortcut',
        path.basename(process.execPath),
        '--shortcut-locations',
        'StartMenu'
    ], callback)
}

exports.removeShortcut = function (callback) {
    spawnUpdate([
        '--removeShortcut',
        path.basename(process.execPath)
    ], callback)
}

function spawnUpdate(args, callback) {
    var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe')
    var stdout = ''
    var spawned = null

    try {
        spawned = ChildProcess.spawn(updateExe, args)
    } catch (error) {
        if (error && error.stdout == null) error.stdout = stdout
        process.nextTick(function () { callback(error) })
        return
    }

    var error = null

    spawned.stdout.on('data', function (data) { stdout += data })

    spawned.on('error', function (processError) {
        if (!error) error = processError
    })

    spawned.on('close', function (code, signal) {
        if (!error && code !== 0) {
            error = new Error('Command failed: ' + code + ' ' + signal)
        }
        if (error && error.code == null) error.code = code
        if (error && error.stdout == null) error.stdout = stdout
        callback(error)
    })
}
