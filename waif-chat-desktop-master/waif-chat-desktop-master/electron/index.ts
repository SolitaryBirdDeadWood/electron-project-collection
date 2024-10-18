const { app, BrowserWindow, ipcMain, webContents, dialog, systemPreferences, desktopCapturer, Menu, MenuItem } = require("electron")
const path = require("path")
const fs = require('fs')
process.env.NODE_ENV !== 'development' ? require('dotenv').config({ path: '.env.production' }) : require('dotenv').config({ path: '.env.development' })

// 判断系统
const isMac = process.platform === 'darwin'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 项目路径
const vueProjectAddress = process.env.NODE_ENV !== 'development' ? `file://${path.join(__dirname, "../dist", "index.html")}#` : "http://localhost:5173/#"

/**
 * 创建一个新的窗口
 */
const createWindow = () => {
  let win = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    width: 1000,
    height: 600,
    frame: false, // 窗口无边框
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true, // 渲染进程使用Node API
      contextIsolation: false, // 是否开启隔离上下文
      webSecurity: false
    }
  })

  win.loadURL(vueProjectAddress)

  let videoWin
  // 打开video窗口
  ipcMain.on('open-video', (e, url: string) => {
    if (videoWin) {
      videoWin.show()
    } else {
      videoWin = new BrowserWindow({
        width: 800,
        height: 500,
        titleBarStyle: "hidden",
        resizable: false, // 窗口大小是否可以调整
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })

      videoWin.on('ready-to-show', () => {
        videoWin.show()
      })

      videoWin.on('close', () => {
        videoWin = null
      })
    }

    videoWin.loadURL(vueProjectAddress + '/video?url=' + url)
  })

  // 关闭video窗口
  ipcMain.on('close-video', () => {
    videoWin.close()
    videoWin = null
  })

  // 最小化
  ipcMain.on('minWin', () => {
    win.minimize()
  })

  // 关闭主窗口
  ipcMain.on('close', () => {
    // 关闭软件
    app.quit()
  })

  // 打开dialog
  ipcMain.on('open-dialog', (e, msgInfo: string) => {
    dialog.showMessageBox({
      title: '消息提醒',
      defaultId: 0,
      message: `你确定要${msgInfo}?`,
      icon: path.join(__dirname, "./icons/icon.png"),
      buttons: ['确定', '取消']
    }).then(result => {
      let index = result.response
      if (index === 0) {
        // 确定按钮
        win.webContents.send('dialog-determine') // 主进程向渲染进程通信
      }
    })
  })

  let groupEditWin
  // 打开群编辑窗口
  ipcMain.on('open-group-edit', (e, id: string) => {
    if (groupEditWin) {
      groupEditWin.show()
    } else {
      groupEditWin = new BrowserWindow({
        width: 300,
        height: 550,
        titleBarStyle: "hidden",
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        show: false,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })
      if (isMac) groupEditWin.setWindowButtonVisibility(false) // mac中红绿灯隐藏

      groupEditWin.on('ready-to-show', () => {
        groupEditWin.show()
      })

      groupEditWin.on('close', () => {
        groupEditWin = null
      })
    }

    groupEditWin.loadURL(vueProjectAddress + '/edit/group?id=' + id)
  })

  // 群主将群成员踢出群聊
  ipcMain.on('del-group-user', () => {
    win.webContents.send('del-group-user')
  })

  // 关闭群编辑窗口
  ipcMain.on('close-group-edit', () => {
    groupEditWin.close()
    groupEditWin = null
  })

  // 保存群编辑按钮
  ipcMain.on('update-success', (e, groupName: string) => {
    groupEditWin.close()
    groupEditWin = null
    win.webContents.send('update-success', groupName)
  })

  let aboutWin
  // 打开关于歪fChat窗口
  ipcMain.on('open-about', () => {
    if (aboutWin) {
      aboutWin.show()
    } else {
      aboutWin = new BrowserWindow({
        width: 650,
        height: 500,
        titleBarStyle: "hidden",
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        show: false,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })

      aboutWin.on('ready-to-show', () => {
        aboutWin.show()
      })

      aboutWin.on('close', () => {
        aboutWin = null
      })
    }

    aboutWin.loadURL(vueProjectAddress + '/about')
  })

  // 关闭关于窗口
  ipcMain.on('close-about', () => {
    aboutWin.close()
    aboutWin = null
  })

  // 读取markdown文件
  ipcMain.on('read-file', async (e) => {
    let dir = path.resolve(__dirname, isMac ? './markdown/WaiFChat.md' : '.\\markdown\\WaiFChat.md')
    let str = await fs.readFileSync(dir, 'utf-8')
    aboutWin.webContents.send('read-file', str)
  })

  let webviewWin
  // 打开webview窗口
  ipcMain.on('open-webview', (e, url: string) => {
    const { screen } = require('electron')
    const { height } = screen.getPrimaryDisplay().workAreaSize // 获取设备高度
    if (webviewWin) {
      webviewWin.show()
    } else {
      webviewWin = new BrowserWindow({
        width: 750,
        height: height,
        minWidth: 750,
        minHeight: height,
        titleBarStyle: "hidden",
        frame: false, // 窗口无边框
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webviewTag: true // 启用webview
        }
      })

      webviewWin.on('ready-to-show', () => {
        webviewWin.show()
      })

      webviewWin.on('close', () => {
        webviewWin = null
      })
    }

    webviewWin.loadURL(vueProjectAddress + '/webview?url=' + url)
  })

  // 关闭webview窗口
  ipcMain.on('close-webview', () => {
    webviewWin.close()
    webviewWin = null
  })

  let screenWindowList: any[] = []
  // 获取屏幕媒体缩略图(包括屏幕和应用的)
  ipcMain.on('get-screen', async (e) => {
    // 获取屏幕
    try {
      let screenSources = await desktopCapturer.getSources({ types: ["screen"] })
      screenSources.forEach((source) => {
        screenWindowList.push({ source, type: 'screen' })
      })
      // 获取应用
      let windowSources = await desktopCapturer.getSources({ types: ["window"] })
      windowSources.forEach((source) => {
        screenWindowList.push({ source, type: 'window' })
      })

      // 通知主窗口已经获取到全部的窗口
      win.webContents.send('get-screen-success')
    } catch (error) {
      return
    }
  })

  let screenChooseWin
  // 打开选择屏幕共享窗口
  ipcMain.on('open-screen-choose', (e, { type, url }) => {
    if (screenChooseWin) {
      screenChooseWin.show()
    } else {
      screenChooseWin = new BrowserWindow({
        width: 480,
        height: 540,
        minWidth: 480,
        minHeight: 540,
        titleBarStyle: "hidden",
        frame: false, // 窗口无边框
        minimizable: false,
        maximizable: false,
        fullscreenable: false, // 是否可以全屏
        show: false,
        resizable: false, // 是否可以调整窗口大小
        parent: win, // 父窗口
        modal: true, // 模态窗口
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })
      if (isMac) screenChooseWin.setWindowButtonVisibility(false)

      screenChooseWin.on('ready-to-show', async () => {
        screenChooseWin.show()
      })

      screenChooseWin.on('close', () => {
        screenChooseWin = null
        screenWindowList = []
      })
    }

    screenChooseWin.loadURL(vueProjectAddress + url)
  })

  // 子窗口获取屏幕缩略图
  ipcMain.on('get-screen-img', (e) => {
    screenWindowList.forEach(item => {
      screenChooseWin.webContents.send('get-screen-img', item)
    })
  })

  // 关闭选择屏幕共享窗口
  ipcMain.on('close-screen-choose', () => {
    screenWindowList = []
    screenChooseWin.close()
    screenChooseWin = null
  })

  // 选择屏幕共享窗口确定按钮回调
  ipcMain.on('confirm-screen-choose', () => {
    win.webContents.send('confirm-screen-choose')
  })

  let telephoneWin
  // 打开语音, 视频窗口
  ipcMain.on('open-telephone', (e, { type, url }) => {
    if (telephoneWin) {
      telephoneWin.show()
    } else {
      telephoneWin = new BrowserWindow({
        width: 600,
        height: 580,
        minWidth: 600,
        minHeight: 580,
        titleBarStyle: "hidden",
        resizable: false, // 窗口大小是否可以调整
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })
      telephoneWin.setWindowButtonVisibility(false)

      telephoneWin.on('ready-to-show', () => {
        telephoneWin.show()
      })

      telephoneWin.on('close', () => {
        telephoneWin = null
      })
    }

    telephoneWin.loadURL(vueProjectAddress + url)
  })

  // 关闭通话窗口
  ipcMain.on('close-telephone', () => {
    telephoneWin.close()
    telephoneWin = null
  })

  let screenWin
  // 打开屏幕共享窗口
  ipcMain.on('open-screen-share', (e, { type, url, sourceId }) => {
    if (screenWin) {
      screenWin.show()
    } else {
      screenWin = new BrowserWindow({
        width: 800,
        height: 580,
        minWidth: 800,
        minHeight: 580,
        titleBarStyle: "hidden",
        resizable: false, // 窗口大小是否可以调整
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })
      screenWin.setWindowButtonVisibility(false)

      screenWin.on('ready-to-show', () => {
        screenWin.show()
      })

      screenWin.on('close', () => {
        screenWin = null
      })
    }

    let sourceIdStr = sourceId ? '&sourceId=' + sourceId : ''
    screenWin.loadURL(vueProjectAddress + url + sourceIdStr)
  })

  // 关闭屏幕共享窗口
  ipcMain.on('close-screen', () => {
    screenWin.close()
    screenWin = null
  })

  // 通话发起方将socket从主窗口传递给子窗口
  ipcMain.on('send_acceptData', (e, data) => {
    const { type } = data
    if (type === 'screen') {
      screenWin.webContents.send('send_acceptData', data)
    } else {
      telephoneWin.webContents.send('send_acceptData', data)
    }
  })

  // 接收方收到发起方的offer, 通知子窗口
  ipcMain.on('send_offer', (e, params) => {
    const { type } = params
    if (type === 'screen') {
      screenWin.webContents.send('send_offer', params)
    } else {
      telephoneWin.webContents.send('send_offer', params)
    }
  })

  // 发起方收到接收方的answer, 通知子窗口
  ipcMain.on('send_answer', (e, params) => {
    const { type } = params
    if (type === 'screen') {
      screenWin.webContents.send('send_answer', params)
    } else {
      telephoneWin.webContents.send('send_answer', params)
    }
  })

  // 接收方收到发起方的candidate信息, 通知子窗口
  ipcMain.on('send_candidate', (e, candidateData) => {
    const { type } = candidateData
    if (type === 'screen') {
      screenWin.webContents.send('send_candidate', candidateData)
    } else {
      telephoneWin.webContents.send('send_candidate', candidateData)
    }
  })

  // 加入通话的用户获取当前通话的全部人数
  ipcMain.on('user_jion_telephone', (e, data) => {
    const { type, chatType } = data
    if (type === 'screen' && chatType === 'friend') return
    telephoneWin.webContents.send('telephone_users', data)
  })

  // 新加入的用户通知其他用户（用于界面展示）
  ipcMain.on('add_group_telephone', (e, data) => {
    const { type } = data
    if (type === 'screen') return
    telephoneWin.webContents.send('add_group_telephone', data)
  })

  // 用户退出
  ipcMain.on('close-telephone-data', (e, data) => {
    telephoneWin.webContents.send('close-telephone-data', data)
  })

  // 窗口固定
  ipcMain.on('fixed-window', (e, { url, isFiexd }) => {
    let fixedWindow
    if (url === '/telephone/voice' || url === '/telephone/video') {
      fixedWindow = telephoneWin
    } else if (url === '/telephone/screen') {
      fixedWindow = screenWin
    }
    fixedWindow.setAlwaysOnTop(isFiexd)
  })

  // 退出登陆关闭所有子窗口
  ipcMain.on('logout', () => {
    // 关闭所有子窗口
    BrowserWindow.getAllWindows().forEach(window => {
      if (window === win) return
      window.close()
    })
  })

  // 监听chatAI页面右键删除历史会话
  ipcMain.on('open-context-menu', (e: any, id: string) => {
    const menu = new Menu()
    menu.append(new MenuItem(
      {
        label: '删除',
        click: () => {
          win.webContents.send('del-talk', id)
        }
      }
    ))
    menu.popup({ window: win })
  })

  // 窗口菜单
  const template = [
    ...(isMac
      ? [
        {
          label: app.name,
          submenu: [
            { label: '关于', role: 'about' },
            { type: 'separator' },
            { label: '服务', role: 'services' },
            { type: 'separator' },
            { label: '隐藏' + app.name, role: 'hide' },
            { label: '隐藏其他', role: 'hideOthers' },
            { label: '显示全部', role: 'unhide' },
            { type: 'separator' },
            { label: '退出' + app.name, role: 'quit' }
          ]
        },
        {
          label: '窗口',
          submenu: [
            { label: '最小化', role: 'minimize' },
            { label: '缩放', role: 'zoom' },
            { type: 'separator' },
            { label: '关闭', role: 'close' },
            { label: '前置所有窗口', role: 'front' },
            { label: '切换全屏', role: 'togglefullscreen' },
            { type: 'separator' },
            { label: '刷新', role: 'reload' },
          ]
        },
        {
          label: '编辑',
          submenu: [
            { label: '撤销', role: 'undo' },
            { label: '剪切', role: 'cut' },
            { label: '复制', role: 'copy' },
            { label: '粘贴', role: 'paste' },
            { label: '删除', role: 'delete' },
            { label: '全选', role: 'selectAll' }
          ]
        },
        {
          label: '帮助',
          role: 'help',
          submenu: [
            {
              label: 'Gitee联系我😊',
              click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://gitee.com/wifi-skew-f')
              }
            },
            { label: '微信: xiaotianna666' }
          ]
        }
      ] : [])
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // 获取媒体权限
  ipcMain.handle('request-media-access', async (event, mediaType: MediaType) => {
    return requestMediaAccess(mediaType)
  })
}

type MediaType = 'microphone' | 'camera' | 'screen'
/**
 * 访问状态
 *  'not-determined'：[未确定]表示用户尚未做出决定，或者系统尚未提示用户进行授权。
 *  'granted'：[已授权]表示用户已经明确授予了应用的权限。
 *  'denied'：[拒绝]表示用户拒绝了应用授权的请求。
 *  'restricted'：[受限]在某些情况下，可能是由于系统策略或其他安全限制导致应用无法获得改权限。
 *  'unknown'：[未知]在无法确定权限状态的情况下返回，可能是因为某种错误或其他不可预知的情况。
 */
type IAccessStatus = 'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'

/**
 * 请求媒体权限
 * @param MediaType
 */
const requestMediaAccess = async (mediaType: MediaType): Promise<IAccessStatus> => {
  try {
    // 获取当前媒体设备（在这里指麦克风或摄像头）的访问权限状态
    const privilege: IAccessStatus = systemPreferences.getMediaAccessStatus(mediaType)
    if (privilege !== 'granted' && mediaType !== 'screen') {
      // 未授权,则重新唤起系统弹框,等待用户点击授权
      await systemPreferences.askForMediaAccess(mediaType)
      // 请求权限后，再次获取媒体访问状态并返回
      return systemPreferences.getMediaAccessStatus(mediaType)
    }
    // 已授权,则直接返回媒体访问状态
    return privilege
  } catch (e) {
    return 'unknown'
  }
}

// 打开窗口
app.whenReady().then(() => {
  createWindow() // 创建窗口
})

// 关闭窗口
app.on("window-all-closed", () => {
  app.quit()
})