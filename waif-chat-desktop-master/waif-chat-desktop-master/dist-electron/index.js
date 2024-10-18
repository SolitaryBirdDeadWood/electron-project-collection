"use strict";
const { app, BrowserWindow, ipcMain, webContents, dialog, systemPreferences, desktopCapturer, Menu, MenuItem } = require("electron");
const path = require("path");
const fs = require("fs");
process.env.NODE_ENV !== "development" ? require("dotenv").config({ path: ".env.production" }) : require("dotenv").config({ path: ".env.development" });
const isMac = process.platform === "darwin";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const vueProjectAddress = process.env.NODE_ENV !== "development" ? `file://${path.join(__dirname, "../dist", "index.html")}#` : "http://localhost:5173/#";
const createWindow = () => {
  let win = new BrowserWindow({
    minWidth: 1e3,
    minHeight: 600,
    width: 1e3,
    height: 600,
    frame: false,
    // 窗口无边框
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      // 渲染进程使用Node API
      contextIsolation: false,
      // 是否开启隔离上下文
      webSecurity: false
    }
  });
  win.loadURL(vueProjectAddress);
  let videoWin;
  ipcMain.on("open-video", (e, url) => {
    if (videoWin) {
      videoWin.show();
    } else {
      videoWin = new BrowserWindow({
        width: 800,
        height: 500,
        titleBarStyle: "hidden",
        resizable: false,
        // 窗口大小是否可以调整
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      videoWin.on("ready-to-show", () => {
        videoWin.show();
      });
      videoWin.on("close", () => {
        videoWin = null;
      });
    }
    videoWin.loadURL(vueProjectAddress + "/video?url=" + url);
  });
  ipcMain.on("close-video", () => {
    videoWin.close();
    videoWin = null;
  });
  ipcMain.on("minWin", () => {
    win.minimize();
  });
  ipcMain.on("close", () => {
    app.quit();
  });
  ipcMain.on("open-dialog", (e, msgInfo) => {
    dialog.showMessageBox({
      title: "消息提醒",
      defaultId: 0,
      message: `你确定要${msgInfo}?`,
      icon: path.join(__dirname, "./icons/icon.png"),
      buttons: ["确定", "取消"]
    }).then((result) => {
      let index = result.response;
      if (index === 0) {
        win.webContents.send("dialog-determine");
      }
    });
  });
  let groupEditWin;
  ipcMain.on("open-group-edit", (e, id) => {
    if (groupEditWin) {
      groupEditWin.show();
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
      });
      if (isMac)
        groupEditWin.setWindowButtonVisibility(false);
      groupEditWin.on("ready-to-show", () => {
        groupEditWin.show();
      });
      groupEditWin.on("close", () => {
        groupEditWin = null;
      });
    }
    groupEditWin.loadURL(vueProjectAddress + "/edit/group?id=" + id);
  });
  ipcMain.on("del-group-user", () => {
    win.webContents.send("del-group-user");
  });
  ipcMain.on("close-group-edit", () => {
    groupEditWin.close();
    groupEditWin = null;
  });
  ipcMain.on("update-success", (e, groupName) => {
    groupEditWin.close();
    groupEditWin = null;
    win.webContents.send("update-success", groupName);
  });
  let aboutWin;
  ipcMain.on("open-about", () => {
    if (aboutWin) {
      aboutWin.show();
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
      });
      aboutWin.on("ready-to-show", () => {
        aboutWin.show();
      });
      aboutWin.on("close", () => {
        aboutWin = null;
      });
    }
    aboutWin.loadURL(vueProjectAddress + "/about");
  });
  ipcMain.on("close-about", () => {
    aboutWin.close();
    aboutWin = null;
  });
  ipcMain.on("read-file", async (e) => {
    let dir = path.resolve(__dirname, isMac ? "./markdown/WaiFChat.md" : ".\\markdown\\WaiFChat.md");
    let str = await fs.readFileSync(dir, "utf-8");
    aboutWin.webContents.send("read-file", str);
  });
  let webviewWin;
  ipcMain.on("open-webview", (e, url) => {
    const { screen } = require("electron");
    const { height } = screen.getPrimaryDisplay().workAreaSize;
    if (webviewWin) {
      webviewWin.show();
    } else {
      webviewWin = new BrowserWindow({
        width: 750,
        height,
        minWidth: 750,
        minHeight: height,
        titleBarStyle: "hidden",
        frame: false,
        // 窗口无边框
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webviewTag: true
          // 启用webview
        }
      });
      webviewWin.on("ready-to-show", () => {
        webviewWin.show();
      });
      webviewWin.on("close", () => {
        webviewWin = null;
      });
    }
    webviewWin.loadURL(vueProjectAddress + "/webview?url=" + url);
  });
  ipcMain.on("close-webview", () => {
    webviewWin.close();
    webviewWin = null;
  });
  let screenWindowList = [];
  ipcMain.on("get-screen", async (e) => {
    try {
      let screenSources = await desktopCapturer.getSources({ types: ["screen"] });
      screenSources.forEach((source) => {
        screenWindowList.push({ source, type: "screen" });
      });
      let windowSources = await desktopCapturer.getSources({ types: ["window"] });
      windowSources.forEach((source) => {
        screenWindowList.push({ source, type: "window" });
      });
      win.webContents.send("get-screen-success");
    } catch (error) {
      return;
    }
  });
  let screenChooseWin;
  ipcMain.on("open-screen-choose", (e, { type, url }) => {
    if (screenChooseWin) {
      screenChooseWin.show();
    } else {
      screenChooseWin = new BrowserWindow({
        width: 480,
        height: 540,
        minWidth: 480,
        minHeight: 540,
        titleBarStyle: "hidden",
        frame: false,
        // 窗口无边框
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        // 是否可以全屏
        show: false,
        resizable: false,
        // 是否可以调整窗口大小
        parent: win,
        // 父窗口
        modal: true,
        // 模态窗口
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      if (isMac)
        screenChooseWin.setWindowButtonVisibility(false);
      screenChooseWin.on("ready-to-show", async () => {
        screenChooseWin.show();
      });
      screenChooseWin.on("close", () => {
        screenChooseWin = null;
        screenWindowList = [];
      });
    }
    screenChooseWin.loadURL(vueProjectAddress + url);
  });
  ipcMain.on("get-screen-img", (e) => {
    screenWindowList.forEach((item) => {
      screenChooseWin.webContents.send("get-screen-img", item);
    });
  });
  ipcMain.on("close-screen-choose", () => {
    screenWindowList = [];
    screenChooseWin.close();
    screenChooseWin = null;
  });
  ipcMain.on("confirm-screen-choose", () => {
    win.webContents.send("confirm-screen-choose");
  });
  let telephoneWin;
  ipcMain.on("open-telephone", (e, { type, url }) => {
    if (telephoneWin) {
      telephoneWin.show();
    } else {
      telephoneWin = new BrowserWindow({
        width: 600,
        height: 580,
        minWidth: 600,
        minHeight: 580,
        titleBarStyle: "hidden",
        resizable: false,
        // 窗口大小是否可以调整
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      telephoneWin.setWindowButtonVisibility(false);
      telephoneWin.on("ready-to-show", () => {
        telephoneWin.show();
      });
      telephoneWin.on("close", () => {
        telephoneWin = null;
      });
    }
    telephoneWin.loadURL(vueProjectAddress + url);
  });
  ipcMain.on("close-telephone", () => {
    telephoneWin.close();
    telephoneWin = null;
  });
  let screenWin;
  ipcMain.on("open-screen-share", (e, { type, url, sourceId }) => {
    if (screenWin) {
      screenWin.show();
    } else {
      screenWin = new BrowserWindow({
        width: 800,
        height: 580,
        minWidth: 800,
        minHeight: 580,
        titleBarStyle: "hidden",
        resizable: false,
        // 窗口大小是否可以调整
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      screenWin.setWindowButtonVisibility(false);
      screenWin.on("ready-to-show", () => {
        screenWin.show();
      });
      screenWin.on("close", () => {
        screenWin = null;
      });
    }
    let sourceIdStr = sourceId ? "&sourceId=" + sourceId : "";
    screenWin.loadURL(vueProjectAddress + url + sourceIdStr);
  });
  ipcMain.on("close-screen", () => {
    screenWin.close();
    screenWin = null;
  });
  ipcMain.on("send_acceptData", (e, data) => {
    const { type } = data;
    if (type === "screen") {
      screenWin.webContents.send("send_acceptData", data);
    } else {
      telephoneWin.webContents.send("send_acceptData", data);
    }
  });
  ipcMain.on("send_offer", (e, params) => {
    const { type } = params;
    if (type === "screen") {
      screenWin.webContents.send("send_offer", params);
    } else {
      telephoneWin.webContents.send("send_offer", params);
    }
  });
  ipcMain.on("send_answer", (e, params) => {
    const { type } = params;
    if (type === "screen") {
      screenWin.webContents.send("send_answer", params);
    } else {
      telephoneWin.webContents.send("send_answer", params);
    }
  });
  ipcMain.on("send_candidate", (e, candidateData) => {
    const { type } = candidateData;
    if (type === "screen") {
      screenWin.webContents.send("send_candidate", candidateData);
    } else {
      telephoneWin.webContents.send("send_candidate", candidateData);
    }
  });
  ipcMain.on("user_jion_telephone", (e, data) => {
    const { type, chatType } = data;
    if (type === "screen" && chatType === "friend")
      return;
    telephoneWin.webContents.send("telephone_users", data);
  });
  ipcMain.on("add_group_telephone", (e, data) => {
    const { type } = data;
    if (type === "screen")
      return;
    telephoneWin.webContents.send("add_group_telephone", data);
  });
  ipcMain.on("close-telephone-data", (e, data) => {
    telephoneWin.webContents.send("close-telephone-data", data);
  });
  ipcMain.on("fixed-window", (e, { url, isFiexd }) => {
    let fixedWindow;
    if (url === "/telephone/voice" || url === "/telephone/video") {
      fixedWindow = telephoneWin;
    } else if (url === "/telephone/screen") {
      fixedWindow = screenWin;
    }
    fixedWindow.setAlwaysOnTop(isFiexd);
  });
  ipcMain.on("logout", () => {
    BrowserWindow.getAllWindows().forEach((window) => {
      if (window === win)
        return;
      window.close();
    });
  });
  ipcMain.on("open-context-menu", (e, id) => {
    const menu2 = new Menu();
    menu2.append(new MenuItem(
      {
        label: "删除",
        click: () => {
          win.webContents.send("del-talk", id);
        }
      }
    ));
    menu2.popup({ window: win });
  });
  const template = [
    ...isMac ? [
      {
        label: app.name,
        submenu: [
          { label: "关于", role: "about" },
          { type: "separator" },
          { label: "服务", role: "services" },
          { type: "separator" },
          { label: "隐藏" + app.name, role: "hide" },
          { label: "隐藏其他", role: "hideOthers" },
          { label: "显示全部", role: "unhide" },
          { type: "separator" },
          { label: "退出" + app.name, role: "quit" }
        ]
      },
      {
        label: "窗口",
        submenu: [
          { label: "最小化", role: "minimize" },
          { label: "缩放", role: "zoom" },
          { type: "separator" },
          { label: "关闭", role: "close" },
          { label: "前置所有窗口", role: "front" },
          { label: "切换全屏", role: "togglefullscreen" },
          { type: "separator" },
          { label: "刷新", role: "reload" }
        ]
      },
      {
        label: "编辑",
        submenu: [
          { label: "撤销", role: "undo" },
          { label: "剪切", role: "cut" },
          { label: "复制", role: "copy" },
          { label: "粘贴", role: "paste" },
          { label: "删除", role: "delete" },
          { label: "全选", role: "selectAll" }
        ]
      },
      {
        label: "帮助",
        role: "help",
        submenu: [
          {
            label: "Gitee联系我😊",
            click: async () => {
              const { shell } = require("electron");
              await shell.openExternal("https://gitee.com/wifi-skew-f");
            }
          },
          { label: "微信: xiaotianna666" }
        ]
      }
    ] : []
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  ipcMain.handle("request-media-access", async (event, mediaType) => {
    return requestMediaAccess(mediaType);
  });
};
const requestMediaAccess = async (mediaType) => {
  try {
    const privilege = systemPreferences.getMediaAccessStatus(mediaType);
    if (privilege !== "granted" && mediaType !== "screen") {
      await systemPreferences.askForMediaAccess(mediaType);
      return systemPreferences.getMediaAccessStatus(mediaType);
    }
    return privilege;
  } catch (e) {
    return "unknown";
  }
};
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  app.quit();
});
